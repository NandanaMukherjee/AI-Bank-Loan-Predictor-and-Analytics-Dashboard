import { useState } from "react";
import axios from "axios";

function PredictionForm() {

  const [formData, setFormData] = useState({
    income: "",
    creditScore: "",
    debtToIncomeRatio: "",
    savingsAmount: "",
    existingLoansCount: "",
    riskScore: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    try {
      // 💡 Looks for your Render ML URL on Vercel, otherwise uses local port 5001
      const ML_BASE_URL = process.env.REACT_APP_ML_API_URL || "http://127.0.0.1:5001";

      const response = await axios.post(
        `${ML_BASE_URL}/predict`,
        {
          income: Number(formData.income),
          creditScore: Number(formData.creditScore),
          debtToIncomeRatio: Number(formData.debtToIncomeRatio),
          savingsAmount: Number(formData.savingsAmount),
          existingLoansCount: Number(formData.existingLoansCount),
          riskScore: Number(formData.riskScore)
        }
      );

      setResult(response.data);

    } catch (error) {
      console.log(error);
      alert("Prediction failed");
    }
  };

  return (
    <div className="prediction-card">

      <h2>AI Loan Prediction</h2>

      <div className="prediction-grid">

        <input
          type="number"
          name="income"
          placeholder="Income"
          onChange={handleChange}
        />

        <input
          type="number"
          name="creditScore"
          placeholder="Credit Score"
          onChange={handleChange}
        />

        <input
          type="number"
          name="debtToIncomeRatio"
          placeholder="Debt To Income Ratio"
          onChange={handleChange}
        />

        <input
          type="number"
          name="savingsAmount"
          placeholder="Savings Amount"
          onChange={handleChange}
        />

        <input
          type="number"
          name="existingLoansCount"
          placeholder="Existing Loans Count"
          onChange={handleChange}
        />

        <input
          type="number"
          name="riskScore"
          placeholder="Risk Score"
          onChange={handleChange}
        />

      </div>

      <button onClick={handlePredict}>
        Predict Loan
      </button>

      {result && (
        <div className="result-box">

          <h3>
            Prediction: {result.prediction}
          </h3>

          <p>
            Approval Probability: {result.approvalProbability}%
          </p>

          <h4>Reasons:</h4>

          <ul>
            {result.reasons.map((reason, index) => (
              <li key={index}>
                {reason}
              </li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}

export default PredictionForm;