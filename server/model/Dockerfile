FROM python:3.11-slim

WORKDIR /model

RUN python -m pip install --upgrade pip setuptools wheel

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "flask-GAP.py"]