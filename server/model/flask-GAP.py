import pandas as pd
import numpy as np
import tensorflow as tf
from keras.models import load_model
from joblib import load
import time
from threading import Thread, Lock

from flask import Flask, request, jsonify
from waitress import serve

model = load_model('pooling.keras')
x_encoder = load('label_encoder.joblib')
dataset = pd.read_csv('dataset_symptom.csv')
dummies = pd.get_dummies(dataset['Disease'].values)
department_data = pd.read_csv('disease_department.csv')

class Build():
    """
    function : transform
    Transform list into 3D keras input for model
    in : input_list -> list of 17 symptom
    out : transformed_list
    """
    def x_transform(self,input_list):
        try:
            transform_list = x_encoder.transform(input_list).reshape(1,17)
        except ValueError as e:
            return {'error':'unseen label'}
        return transform_list

    """
    function : predict
    Predict the disease, select top 5 and calculate confidence threshold
    in : transformed_list
    out : class_list -> top 5 predicted disease
    out : threshold -> confidentiality threshold
    """
    def predict(self,transform_list):
        
        threshold = 0
        #predict the input, rounded , and flatten
        predicted = np.round(model.predict(transform_list),2).flatten()

        #get class with probability > 5%
        class_out = [x for x in tf.where(predicted > 0.05).numpy().flatten()]

        #Can't find any candidate
        if class_out == []:
            return {'error':'no class predicted'}
        
        #sorted and only top 5
        class_out = sorted(class_out, key=lambda x: predicted[x], reverse=True)[:5]
       
        #map to disease name
        class_list = [dummies.columns[x] for x in class_out]
        class_value = tf.gather(predicted,class_out)
        
        #create confidence threshold
        if class_value[0] >= 0.95:
            threshold = 2
        elif class_value[0] >= 0.8:
            threshold = 1
        else:
            threshold = 0

        return class_list,threshold

    """
    function : pick_Q
    Pick next question based on predicted disease
    in : class_list -> top 5 predicted disease
    in : false_streak -> consecutive false given by user
    in : key_list -> symptoms used
    out : current_Q -> next question for asking
    """
    def pick_Q(self,class_list,false_streak,key_list):

        #no false streak could exceed predicted disease
        if false_streak >= len(class_list):
            return {'error':'all false'}

        #get question from top disease by false streak
        df_main = dataset[dataset['Disease'] == class_list[false_streak]].drop(['Disease'],axis=1)
        df_main = df_main.T.stack().drop_duplicates()
        df_main = df_main[~df_main.isin(key_list)]

        #no question avaliable
        if df_main.empty:
            return {'error':'out of question'}

        #get question from other disease in list
        df_list = pd.DataFrame()
        for i in range(1+false_streak,len(class_list)):
            dfi = dataset[dataset['Disease'] == class_list[i]].drop(['Disease'],axis=1)
            dfi = dfi.T.stack().drop_duplicates()
            df_list = pd.concat([df_list,dfi], ignore_index=True)
        df_list = df_list.drop_duplicates()
        df_list = df_list[~df_list.isin(key_list)]

        #find unique question
        df_focus = df_main[~df_main.isin(df_list)]

        #prioritize unique question
        if not df_focus.empty:
            current_Q = df_focus.iloc[0]
        else:
            current_Q = df_main.iloc[0]
            
        return {'question':current_Q}

    """
    function : map_departments
    map disease name into the department 
    """
    def map_departments(self, class_list):
        department_ans = {}
        for i, value in enumerate(class_list, 1):
            predicted_department = department_data[department_data['Disease'] == value]
            if not predicted_department.empty:
                department_ans[f'result {i}'] = predicted_department['Department'].values[0]
            else:
                department_ans[f'result {i}'] = 'Unknown Department'
        return department_ans

    # Main
    def main(self,user_list):
        log = user_list
        key_list = list(log.keys())
        value_list = list(log.values())
        input_list = np.full((17),'0',dtype=object)
        false_streak = 0
        threshold = 0
        department_ans = {}

        #create input list for model & false steak count from user input
        j = 0
        for i, value in enumerate(value_list):
            if value == False:
                false_streak += 1
            else:
                false_streak = 0
                input_list[j] = key_list[i]
                j += 1

        #function call : transform 
        transformed_list = self.x_transform(input_list)
        if 'error' in transformed_list:
            return transformed_list
        
        #function call : predict
        class_list,threshold = self.predict(transformed_list)
        if 'error' in class_list:
            return class_list

        #return department answer on high probability case
            #department threshold 1 : 80%, 2 : 95%
        if threshold == 1 and len(key_list)>5:
            department_ans = self.map_departments(class_list)
            return department_ans
        elif threshold == 2:
            department_ans = self.map_departments(class_list)
            return department_ans
        elif len(key_list)>8:
            return {'error':'too long'}

        #function call : pick_Q
        current_Q = self.pick_Q(class_list,false_streak,key_list)
        if 'error' in current_Q:
            false_streak = 0

        return current_Q

"""
remove inactive session (15 min) every 5 min
"""
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

"""
update user timestamp
"""
def update_user_timestamp(session_id):
    with lock:
        user_timestamps[session_id] = time.time()


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
    
    update_user_timestamp(session_id)
    return jsonify({'_id':session_id,'response': result})


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)