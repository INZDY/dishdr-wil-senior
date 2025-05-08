import pandas as pd
import numpy as np
import xgboost as xgb

import json
import ast
import time

from joblib import load

from flask import Flask, request, jsonify
from waitress import serve
from threading import Thread, Lock

#load model
model = xgb.XGBClassifier()
model.load_model('data/xgbddx_model.json')
#load y encoder
y_encoder = load('data/xgbddx_ylabel.joblib')
#evidence list
with open('data/evi_mixed.json','r',encoding='utf8') as f1:
    evi_mixed = json.load(f1)
#evi/diag pair
with open('data/evi_diag_pair.json','r',encoding='utf8') as f2:
    evi_diag = json.load(f2)
#frequent_Q data
df_fcol = pd.read_csv('data/df_fcol.csv',index_col=0)
#department mapper
department_data = pd.read_csv('data/department_mixed.csv')

class Build():
    
    def predict(self,threshold,evi_list=[]):
        """
        function : predict
        in : evi_list -> list of symptom code that are true by user's input
        in : threshold -> threshold value for selecting output class
        out : class_list -> top 5 predicted disease
        out : class_value[0] -> confidentiality of first predicted class
        """
        #create input dataframe
        b_list = {evi: [1] if evi in evi_list else [0] for evi in evi_mixed.keys()}
        transform_df = pd.DataFrame(b_list)

        predicted = np.round(model.predict_proba(transform_df),2).flatten()

        sorted_indices = np.argsort(-predicted)
        #top five
        class_out = [idx for idx in sorted_indices if predicted[idx] > threshold][:5]
        class_list = y_encoder.classes_[class_out]
        class_value = predicted[class_out]

        return class_list,class_value[0]
    
    def pick_Q(self,false_streak,class_list=[]):
        """
        function : predict
        in : false_streak -> number of consecutive time false given
        in : class_list -> top 5 predicted disease
        out : current_Q -> code of question
        """
        #all candidate rejected
        if false_streak >= len(class_list):
            return {"error":"All false"}

        Q_can = ast.literal_eval(df_fcol.loc[df_fcol['diagnosis'] == class_list[false_streak],'f_column'].values[0])
        Q_can = [Q for Q in Q_can if Q not in self.log.keys()]

        #no question left
        if not Q_can:
            return {"error":"Out of question"}

        Q_sub = []
        for i in range(1+false_streak,len(class_list)):
            dfi = ast.literal_eval(df_fcol.loc[df_fcol['diagnosis'] == class_list[i],'f_column'].values[0])
            Q_sub = Q_sub + dfi

        Q_sub = [Q for Q in Q_sub if Q not in self.log.keys()]
        Q_focus = [Q for Q in Q_can if Q not in Q_sub]

        if Q_focus:
            current_Q = Q_focus[0]
        else:
            current_Q = Q_can[0]

        return current_Q

    #translate evidence name into text question
    def evi_to_Q(self,evi_string):
        return evi_mixed[evi_string]
    
    # Main
    def main(self,symptoms):

        user_list = symptoms
        self.log = user_list
        evi_list = []
        # Consider softmax disease > 5%
        threshold = 0.05
        false_steak = 0

        # return general department with > 5 symptomns
        if len(user_list.keys()) > 5:
            return {"department":{"en":"GP","th":"โรคทั่วไป"}}
    
        #create input list for model & false steak count from user input
        for i, (key,value) in enumerate(user_list.items()):
            if value == False:
                false_streak += 1
            else:
                false_streak = 0
                evi_list.append(key)

        [class_list,class_value] = self.predict(threshold,evi_list)

        # case 1 : confidence level > 95%
        if class_value > 0.95:
            record = department_data[department_data["disease"] == class_list[0]]
            return {"department":{"en":record['en'].iloc[0],"th":record['th'].iloc[0]}}
        # case 2 : confidence level > 80%, input more than 3 symptom
        elif class_value > 0.8 and len(user_list.keys()) > 3:
            department_loc = department_data.loc[department_data["disease"] == class_list[0]]
            return {"department":{"en":department_loc['en'].iloc[0],"th":department_loc['th'].iloc[0]}}
        # return question
        else:
            # special case
            current_Q = self.pick_Q(false_streak,class_list)
            if isinstance(current_Q, dict):
                return {"department":{"en":"GP","th":"โรคทั่วไป"}}
            # normal question
            else:
                Q = self.evi_to_Q(current_Q)
                return {"question":{"code":current_Q,"en":Q['en'],"th":Q['th']}}



#remove inactive session (15 min) every 5 min
def cleanup(timeout=900,interval=300):
    while True:
        time.sleep(interval)  
        with lock:
            current_time = time.time()
            to_delete = [
                session_id for session_id, last_active in user_timestamps.items()
                if current_time - last_active > timeout
            ]
            for session_id in to_delete:
                user_model.pop(session_id, None)
                user_timestamps.pop(session_id, None)


#update user timestamp
def update_user_timestamp(session_id):
    with lock:
        user_timestamps[session_id] = time.time()

#app
app = Flask(__name__)

user_model = {}
user_timestamps = {}
lock = Lock()

Thread(target=cleanup, daemon=True).start()

@app.route('/predict', methods=['POST'])
def predict():
    """
    Input: {'session_id': 'session_id', 'symptoms': {data}} as JSON
    """
    data = request.get_json()
   
    if not data or not "session_id" in data or not "symptoms" in data:
        return jsonify({'error': 'Missing data'}), 400
        
    session_id = data['session_id']
    symptoms = data['symptoms']
    
    with lock:
        if session_id not in user_model:
            user_model[session_id] = Build()
    
    model = user_model[session_id]

    result = model.main(symptoms)
   
    key = next(iter(result))

    update_user_timestamp(session_id)

    if key == 'department':
        return jsonify({'session_id':session_id,'department': result[key]})
    elif key == 'question':
        return jsonify({'session_id':session_id,'question': result[key]})
    else :
        return jsonify({'session_id':session_id,'error': 'something wrong'})



if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)