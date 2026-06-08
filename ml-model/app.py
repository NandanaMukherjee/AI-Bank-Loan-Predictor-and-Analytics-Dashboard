from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ================= LOAD MODEL =================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "model.pkl")

model = joblib.load(model_path)

# ================= HOME ROUTE =================

@app.route("/")
def home():
    return "🚀 Loan AI API is running successfully!"

# ================= PREDICTION API =================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # ================= GET INPUT DATA =================

        data = request.get_json()

        # ================= REQUIRED FIELDS =================

        required_fields = [

            "income",
            "creditScore",
            "debtToIncomeRatio",
            "savingsAmount",
            "existingLoansCount",
            "riskScore",
            "loanAmount",
            "interestRate",
            "financialHealthScore",
            "jobTenureYears",
            "creditHistoryLength",
            "monthlyExpenses",
            "loanTenureMonths",
            "dependents",
            "age"

        ]

        # ================= VALIDATION =================

        for field in required_fields:

            if field not in data:

                return jsonify({
                    "error": f"Missing field: {field}"
                }), 400

        # ================= CONVERT INPUT =================

        income = float(data["income"])

        creditScore = float(data["creditScore"])

        debtToIncomeRatio = float(data["debtToIncomeRatio"])

        savingsAmount = float(data["savingsAmount"])

        existingLoansCount = float(data["existingLoansCount"])

        riskScore = float(data["riskScore"])

        loanAmount = float(data["loanAmount"])

        interestRate = float(data["interestRate"])

        financialHealthScore = float(data["financialHealthScore"])

        jobTenureYears = float(data["jobTenureYears"])

        creditHistoryLength = float(data["creditHistoryLength"])

        monthlyExpenses = float(data["monthlyExpenses"])

        loanTenureMonths = float(data["loanTenureMonths"])

        dependents = float(data["dependents"])

        age = float(data["age"])

        # ================= MODEL INPUT =================

        features = np.array([[

            income,
            creditScore,
            debtToIncomeRatio,
            savingsAmount,
            existingLoansCount,
            riskScore,
            

        ]])

        # ================= AI PREDICTION =================

        prediction = model.predict(features)[0]

        probability = model.predict_proba(features)[0][1]

        result = "Approved" if prediction == 1 else "Rejected"

        # ================= EXPLANATION LAYER =================

        reasons = []

        if creditScore < 600:
            reasons.append("Low credit score")

        if debtToIncomeRatio > 40:
            reasons.append("High debt-to-income ratio")

        if riskScore > 70:
            reasons.append("High risk score")

        if existingLoansCount > 3:
            reasons.append("Too many existing loans")

        if savingsAmount < 5000:
            reasons.append("Low savings amount")

        if income < monthlyExpenses:
            reasons.append("Expenses higher than income")

        if financialHealthScore < 50:
            reasons.append("Poor financial health score")

        if jobTenureYears < 2:
            reasons.append("Low job stability")

        if creditHistoryLength < 3:
            reasons.append("Short credit history")

        # ================= FINANCIAL PROFILE =================

        if len(reasons) == 0:

            reasons = [
                "Excellent financial profile"
            ]

        elif len(reasons) >= 5:

            reasons.insert(
                0,
                "Bad financial profile"
            )

        elif len(reasons) >= 2:

            reasons.insert(
                0,
                "Moderate financial risk"
            )

        # ================= RESPONSE =================

        return jsonify({

            "prediction": result,

            "approvalProbability": round(
                probability * 100,
                2
            ),

            "reasons": reasons

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# ================= RUN SERVER =================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5001
    )