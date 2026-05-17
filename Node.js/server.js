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
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
