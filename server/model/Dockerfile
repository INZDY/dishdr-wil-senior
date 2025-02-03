FROM python:3.13-alpine

WORKDIR /model

RUN apk add --no-cache gcc g++ musl-dev

RUN python -m pip install --upgrade pip setuptools wheel

COPY requirement.txt .

RUN pip install --no-cache-dir -r requirement.txt

COPY . .

EXPOSE 5000

CMD ["python", "flask-GAP.py"]
