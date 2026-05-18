const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
const MONGO_URI =
  "mongodb://nandanamukh14_db_user:Pnu%402003@ac-ffppp0r-shard-00-00.qaxu26u.mongodb.net:27017,ac-ffppp0r-shard-00-01.qaxu26u.mongodb.net:27017,ac-ffppp0r-shard-00-02.qaxu26u.mongodb.net:27017/BankLoan?replicaSet=atlas-13uzun-shard-0&ssl=true&authSource=admin";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// ================= MODEL =================
const loanSchema = new mongoose.Schema({}, { strict: false });

const Loan = mongoose.model(
  "Loan",
  loanSchema,
  "Banking_Loan_Data"
);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ================= MAIN API =================
app.get("/loans", async (req, res) => {
  try {
    const data = await Loan.find({});
    console.log("Fetched records:", data.length);

    res.json(data);
  } catch (err) {
    console.log("API Error ❌", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

// ===================== Predictor========================
app.post("/predict", (req, res) => {
  try {
    let {
      income,
      creditScore,
      debtToIncomeRatio,
      savingsAmount,
      existingLoansCount,
      riskScore
    } = req.body;

    // Convert & sanitize inputs
    income = Number(income || 0);
    creditScore = Number(creditScore || 0);
    debtToIncomeRatio = Number(debtToIncomeRatio || 0);
    savingsAmount = Number(savingsAmount || 0);
    existingLoansCount = Number(existingLoansCount || 0);
    riskScore = Number(riskScore || 0);

    // Prevent invalid data
    if (!income || !creditScore) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    // Normalized scoring (more stable)
    let score =
      (creditScore / 850) * 0.35 +
      (income / 200000) * 0.2 +
      (savingsAmount / 1000000) * 0.15 -
      (debtToIncomeRatio * 0.2) -
      (existingLoansCount * 0.1) -
      (riskScore * 0.25);

    // Clamp score between 0 and 1
    score = Math.max(0, Math.min(score, 1));

    const prediction = score > 0.5 ? "Approved" : "Rejected";

    const approvalProbability = (score * 100).toFixed(2);

    const reasons = [];

    if (creditScore >= 700) reasons.push("Good credit score");
    else reasons.push("Low credit score");

    if (debtToIncomeRatio < 0.4) reasons.push("Low debt burden");
    else reasons.push("High debt burden");

    if (savingsAmount > 200000) reasons.push("Strong savings");
    else reasons.push("Low savings");

    if (existingLoansCount > 2) reasons.push("Multiple existing loans (risk)");
    else reasons.push("Low existing loan burden");

    res.json({
      prediction,
      approvalProbability,
      reasons
    });

  } catch (err) {
    console.log("Prediction Error:", err);
    res.status(500).json({
      error: "Prediction failed"
    });
  }
});