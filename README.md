# Dynamic Inquiry System for Hospital Department Recommendation

A hospital appointment management web application, integrated with dynamic symptom inquiry system using machine learning.
The goal is to provide maximum efficiency by minimizing number of questions needed to determine appropriate hospital department, accelerating patient visit process.

## Stucture
The project mainly separated into two components inquiry system and web application.

### Server
Includes Flask to run API server housing the ML inquiry system and compiled ML model.

### Webapp
Next.js folder housing all web application code.

## Development
For web application, cd into 'webapp' folder and run:
```
npm install
npx prisma generate
```
Then add .env files for database and authentication API.

Run web application development server
```
npm run dev
```

For inquiry system, cd into '/server/model' and run:
```
python -m flask app run flask-XGB
```
