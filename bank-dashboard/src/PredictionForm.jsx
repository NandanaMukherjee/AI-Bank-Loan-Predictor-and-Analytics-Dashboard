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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    try {
      setLoading(true);

      const ML_BASE_URL =
  process.env.REACT_APP_ML_API_URL || "http://localhost:5000";
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

      console.log("API Response:", response.data);

      setResult(response.data);
    } catch (error) {
      console.log("Prediction error:", error);
      alert("Prediction failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-card">
      <h2>AI Loan Prediction</h2>

      <div className="prediction-grid">
        <input name="income" type="number" placeholder="Income" onChange={handleChange} />
        <input name="creditScore" type="number" placeholder="Credit Score" onChange={handleChange} />
        <input name="debtToIncomeRatio" type="number" placeholder="Debt To Income Ratio" onChange={handleChange} />
        <input name="savingsAmount" type="number" placeholder="Savings Amount" onChange={handleChange} />
        <input name="existingLoansCount" type="number" placeholder="Existing Loans Count" onChange={handleChange} />
        <input name="riskScore" type="number" placeholder="Risk Score" onChange={handleChange} />
      </div>

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict Loan"}
      </button>

      {result && (
        <div className="result-box">
          <h3>
            Prediction:{" "}
            {result.prediction !== undefined
              ? result.prediction
              : "No prediction returned"}
          </h3>

          <p>
            Approval Probability:{" "}
            {result.approvalProbability !== undefined
              ? result.approvalProbability
              : "N/A"}
            %
          </p>

          <h4>Reasons:</h4>

          <ul>
            {(Array.isArray(result.reasons) ? result.reasons : []).map(
              (reason, index) => (
                <li key={index}>{reason}</li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PredictionForm;