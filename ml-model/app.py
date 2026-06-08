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

      

       

        # ================= FINANCIAL PROFILE =================

       # ================= FINANCIAL PROFILE =================

        if len(reasons) == 0:

             if prediction == 1:

               if probability >= 0.80:
                reasons = ["Excellent financial profile"]

               elif probability >= 0.60:
                reasons = ["Good financial profile"]

               else:
                reasons = ["Loan approved with moderate risk"]

             else:

                if probability <= 0.30:
                 reasons = ["Application did not meet approval criteria"]

                else:
                  reasons = ["Borderline financial profile"]

        elif len(reasons)>= 5:

         reasons.insert(
            0,
           " High approval risk"
                  )

        elif len(reasons)>= 3:

         reasons.insert(
              0,
          "Moderate financial risk"
                   )

        else:

         reasons.insert(
        0,
        "Some risk factors detected"
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