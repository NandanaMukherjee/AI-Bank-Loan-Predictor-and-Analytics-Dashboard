# AI Bank Loan Predictor and Analytics Dashboard

## About This Project

This project is a full-stack MERN + Machine Learning system that predicts loan approval outcomes and provides analytical insights into customer financial behavior.

The goal of this project is not only to predict whether a loan will be approved or rejected but also to understand the patterns behind financial decisions using data visualization and machine learning.

It combines a Flask-based machine learning model with a React and Node.js dashboard, using MongoDB to manage and store data. The system is designed to simulate how financial institutions evaluate loan applications and assess risk.

---

## What This Project Does

- Predicts loan approval based on financial and personal data
- Analyzes customer financial behavior such as income, credit score, savings, and debt
- Identifies high-risk and potentially fraudulent applications
- Displays insights through an interactive dashboard

---

## Machine Learning Model

The model evaluates loan applications using key features such as:

- Income  
- Credit Score  
- Debt-to-Income Ratio  
- Savings Amount  
- Existing Loans  
- Risk Score  

The model is deployed using Flask and provides real-time predictions through an API connected to the frontend.

---

## Dashboard Features

The dashboard focuses on visualizing key financial insights, including:

- Total loans and their status (approved, rejected, fraud)
- Approval and default rates
- Average income and credit score of applicants
- Loan amount distribution

It also includes deeper analysis such as:

- Loan purpose trends
- Relationship between income and loan amount
- Credit score vs interest rate patterns
- Employment and education-based analysis
- Region-wise risk distribution
- Age group and dependency analysis
- Fraud detection patterns

---

## Tech Stack

Frontend:
- React.js  
- JavaScript  
- Recharts  
- Axios  

Backend:
- Node.js  
- Express.js  
- REST APIs  

Database:
- MongoDB Atlas  
- Mongoose  

Machine Learning:
- Python  
- Scikit-learn  
- Flask API  

---

## System Architecture

React Frontend → Node.js/Express Backend → MongoDB Atlas → Flask Machine Learning API

The frontend handles user interaction, the backend manages APIs and business logic, MongoDB stores the data, and Flask serves the machine learning model for predictions.

---

## What I Learned

- Integrating machine learning with full-stack applications  
- Building and connecting REST APIs across services  
- Working with real-world financial datasets  
- Designing dashboards for meaningful data visualization  
- Structuring end-to-end production-style systems  

---

## Project Summary

This project focuses on building a practical system that combines machine learning and full-stack development. It simulates real-world loan evaluation processes and helps understand financial risk through data-driven insights.