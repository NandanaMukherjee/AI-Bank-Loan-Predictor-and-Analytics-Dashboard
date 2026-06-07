const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
const MONGO_URI =
  "mongodb://nandanamukh14_db_user:Pnu%402003@ac-ffppp0r-shard-00-00.qaxu26u.mongodb.net:27017,ac-ffppp0r-shard-00-01.qaxu26u.mongodb.net:27017,ac-ffppp0r-shard-00-02.qaxu26u.mongodb.net:27017/?ssl=true&replicaSet=atlas-13uzun-shard-0&authSource=admin&appName=Cluster0";

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
app.post("/predict", async (req, res) => {
  try {
    const {
      income,
      creditScore,
      debtToIncomeRatio,
      savingsAmount,
      existingLoansCount,
      riskScore
    } = req.body;

    // ================= INPUT VALIDATION =================
    if (
      income === undefined ||
      creditScore === undefined ||
      debtToIncomeRatio === undefined ||
      savingsAmount === undefined ||
      existingLoansCount === undefined ||
      riskScore === undefined
    ) {
      return res.status(400).json({
        error: "All input fields are required"
      });
    }

    // ================= NORMALIZATION =================
    const normalizedIncome = Math.min(income / 200000, 1);

    const normalizedCredit = Math.min(
      creditScore / 850,
      1
    );

    const normalizedSavings = Math.min(
      savingsAmount / 500000,
      1
    );

    // Handles both 0.4 and 40 formats
    const normalizedDebt =
      debtToIncomeRatio > 1
        ? debtToIncomeRatio / 100
        : debtToIncomeRatio;

    const normalizedLoans = Math.min(
      existingLoansCount / 5,
      1
    );

    const normalizedRisk = Math.min(
      riskScore / 100,
      1
    );

    // ================= SCORING LOGIC =================
    let score =
      normalizedIncome * 25 +
      normalizedCredit * 30 +
      normalizedSavings * 20 -
      normalizedDebt * 25 -
      normalizedLoans * 10 -
      normalizedRisk * 30;

    // Base probability centered around 50
    let approvalProbability = Math.round(score + 50);

    // Clamp between 0 and 100
    approvalProbability = Math.max(
      0,
      Math.min(approvalProbability, 100)
    );

    // ================= DECISION =================
    const prediction =
      approvalProbability >= 60
        ? "Approved"
        : "Rejected";

    // ================= REASONS =================
    let reasons = [];

    if (creditScore >= 750) {
      reasons.push("Excellent credit score");
    } else if (creditScore >= 650) {
      reasons.push("Moderate credit score");
    } else {
      reasons.push("Low credit score");
    }

    if (normalizedDebt < 0.4) {
      reasons.push("Healthy debt-to-income ratio");
    } else {
      reasons.push("High debt burden");
    }

    if (savingsAmount >= 200000) {
      reasons.push("Strong savings history");
    } else {
      reasons.push("Limited savings");
    }

    if (existingLoansCount >= 3) {
      reasons.push("Multiple active loans");
    }

    if (riskScore < 40) {
      reasons.push("Low financial risk");
    } else {
      reasons.push("High financial risk");
    }

    // ================= RESPONSE =================
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