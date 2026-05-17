import React, { useEffect, useState } from "react";
import axios from "axios";
import PredictionForm from "./PredictionForm";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from "recharts";

import "./App.css";

function App() {
  const [loans, setLoans] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    // 💡 Looks for the Vercel variable live, otherwise uses localhost for your laptop
    const BACKEND_BASE_URL = process.env.REACT_APP_NODE_API_URL || "http://localhost:5000";

    axios.get(`${BACKEND_BASE_URL}/loans`)
      .then((response) => {
        const cleaned = response.data.map((loan) => ({
          ...loan,
          loanStatus: loan.loanStatus?.toLowerCase?.()?.trim(),
          defaultHistory: loan.defaultHistory?.toLowerCase?.()?.trim(),
          isFraudSuspected:
            loan.isFraudSuspected === true ||
            loan.isFraudSuspected === "true" ||
            loan.isFraudSuspected === 1
        }));

        console.log("CLEANED DATA:", cleaned);
        setLoans(cleaned);
      })
      .catch(console.log);
  }, []);

  // ================= KPIs =================
  const totalApplications = loans.length;

  const approvedLoans = loans.filter(
    (loan) => loan.loanStatus === "approved"
  ).length;

  const rejectedLoans = loans.filter(
    (loan) => loan.loanStatus === "rejected"
  ).length;

  const pendingLoans = loans.filter(
    (loan) => loan.loanStatus === "pending"
  ).length;

  const fraudCases = loans.filter(
    (loan) => loan.isFraudSuspected === true
  ).length;

  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + (loan.loanAmount || 0),
    0
  );

  const avgLoanAmount =
    loans.length > 0
      ? Math.round(totalLoanAmount / loans.length)
      : 0;

  const avgCreditScore =
    loans.length > 0
      ? (
          loans.reduce(
            (sum, loan) => sum + (loan.creditScore || 0),
            0
          ) / loans.length
        ).toFixed(0)
      : 0;

  const avgIncome =
    loans.length > 0
      ? Math.round(
          loans.reduce(
            (sum, loan) => sum + (loan.income || 0),
            0
          ) / loans.length
        )
      : 0;

  const approvalRate =
    totalApplications > 0
      ? (
          (approvedLoans / totalApplications) *
          100
        ).toFixed(1)
      : 0;

  const defaultRate =
    totalApplications > 0
      ? (
          (loans.filter(
            (loan) => loan.defaultHistory === "yes"
          ).length /
            totalApplications) *
          100
        ).toFixed(1)
      : 0;

  // ================= COLORS =================
  const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4"
  ];

  // ================= PIE CHARTS =================
  const loanStatusData = [
    { name: "Approved", value: approvedLoans },
    { name: "Rejected", value: rejectedLoans },
    { name: "Pending", value: pendingLoans }
  ];

  const fraudData = [
    { name: "Fraud", value: fraudCases },
    { name: "Safe", value: totalApplications - fraudCases }
  ];

  // ================= APPLICATION CHANNEL =================
  const channelMap = {};
  loans.forEach((loan) => {
    const channel = loan.applicationChannel || "Unknown";
    channelMap[channel] = (channelMap[channel] || 0) + 1;
  });

  const channelData = Object.keys(channelMap).map((key) => ({
    name: key,
    value: channelMap[key]
  }));

  // ================= LOAN PURPOSE =================
  const purposeMap = {};
  loans.forEach((loan) => {
    const purpose = loan.loanPurpose || "Unknown";
    purposeMap[purpose] = (purposeMap[purpose] || 0) + 1;
  });

  const purposeData = Object.keys(purposeMap).map((key) => ({
    name: key,
    value: purposeMap[key]
  }));

  // ================= BRANCH =================
  const branchMap = {};
  loans.forEach((loan) => {
    const branch = loan.branch || "Unknown";
    branchMap[branch] = (branchMap[branch] || 0) + 1;
  });

  const branchData = Object.keys(branchMap).map((key) => ({
    name: key,
    value: branchMap[key]
  }));

  // ================= EMPLOYMENT =================
  const employmentMap = {};
  loans.forEach((loan) => {
    const emp = loan.employmentType || "Unknown";
    employmentMap[emp] = (employmentMap[emp] || 0) + (loan.loanAmount || 0);
  });

  const employmentData = Object.keys(employmentMap).map((key) => ({
    name: key,
    value: employmentMap[key]
  }));

  // ================= EDUCATION =================
  const educationMap = {};
  loans.forEach((loan) => {
    const edu = loan.educationLevel || "Unknown";
    educationMap[edu] = (educationMap[edu] || 0) + (loan.creditScore || 0);
  });

  const educationData = Object.keys(educationMap).map((key) => ({
    name: key,
    value: educationMap[key]
  }));

  // ================= REGION =================
  const regionMap = {};
  loans.forEach((loan) => {
    const region = loan.region || "Unknown";
    regionMap[region] = (regionMap[region] || 0) + (loan.riskScore || 0);
  });

  const regionData = Object.keys(regionMap).map((key) => ({
    name: key,
    value: regionMap[key]
  }));

  // ================= AGE GROUP =================
  const ageMap = { "18-30": 0, "31-45": 0, "46-60": 0, "60+": 0 };
  loans.forEach((loan) => {
    if (loan.age <= 30) ageMap["18-30"]++;
    else if (loan.age <= 45) ageMap["31-45"]++;
    else if (loan.age <= 60) ageMap["46-60"]++;
    else ageMap["60+"]++;
  });

  const ageData = Object.keys(ageMap).map((key) => ({
    name: key,
    value: ageMap[key]
  }));

  // ================= DEPENDENTS =================
  const dependentMap = {};
  loans.forEach((loan) => {
    const dep = loan.dependents || 0;
    dependentMap[dep] = (dependentMap[dep] || 0) + 1;
  });

  const dependentData = Object.keys(dependentMap).map((key) => ({
    name: key,
    value: dependentMap[key]
  }));

  // ================= LINE CHARTS =================
  const creditData = loans.map((loan) => ({
    creditScore: loan.creditScore,
    interestRate: loan.interestRate,
    approvalProbability: loan.approvalProbability
  }));

  // ================= FRAUD PATTERN SUMMARY =================
  const fraudSummaryMap = {};
  loans.forEach((loan) => {
    const apps = loan.multipleApplicationsCount || 0;
    if (!fraudSummaryMap[apps]) {
      fraudSummaryMap[apps] = 0;
    }
    if (loan.isFraudSuspected) {
      fraudSummaryMap[apps]++;
    }
  });

  const fraudSummaryData = Object.keys(fraudSummaryMap).map((key) => ({
    applications: key,
    fraudCases: fraudSummaryMap[key]
  }));

  return (
    <div className="dashboard">
      <h1 className="title">Bank Loan Analytics Dashboard</h1>

      {/* ================= KPI GRID ================= */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Loans</h3>
          <p>{totalApplications}</p>
        </div>

        <div className="kpi-card">
          <h3>Approved</h3>
          <p>{approvedLoans}</p>
        </div>

        <div className="kpi-card">
          <h3>Rejected</h3>
          <p>{rejectedLoans}</p>
        </div>

        <div className="kpi-card">
          <h3>Fraud Cases</h3>
          <p>{fraudCases}</p>
        </div>

        <div className="kpi-card">
          <h3>Approval %</h3>
          <p>{approvalRate}%</p>
        </div>

        <div className="kpi-card">
          <h3>Default %</h3>
          <p>{defaultRate}%</p>
        </div>

        <div className="kpi-card">
          <h3>Avg Credit</h3>
          <p>{avgCreditScore}</p>
        </div>

        <div className="kpi-card">
          <h3>Avg Income</h3>
          <p>₹ {avgIncome.toLocaleString()}</p>
        </div>

        <div className="kpi-card">
          <h3>Total Loan</h3>
          <p>₹ {totalLoanAmount.toLocaleString()}</p>
        </div>

        <div className="kpi-card">
          <h3>Avg Loan</h3>
          <p>₹ {avgLoanAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* ================= CHART GRID ================= */}
      <div className="chart-grid">
        
        {/* AI Prediction Form Added Here Cleanly */}
        <div className="chart-card form-container-card">
          <PredictionForm />
        </div>

        {/* Loan Status */}
        <div className="chart-card">
          <h3>Loan Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={loanStatusData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {loanStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud */}
        <div className="chart-card">
          <h3>Fraud Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudData}
                dataKey="value"
                outerRadius={100}
                label
              >
                <Cell fill="#ef4444" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Branch */}
        <div className="chart-card">
          <h3>Branch-wise Applications</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Purpose */}
        <div className="chart-card">
          <h3>Loan Purpose</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={purposeData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {purposeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Loan */}
        <div className="chart-card">
          <h3>Income vs Loan Amount</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={loans.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="customerName"
                tick={{ fill: "#cbd5e1", fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff"
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Income" />
              <Line type="monotone" dataKey="loanAmount" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} name="Loan Amount" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Credit Trend */}
        <div className="chart-card">
          <h3>Credit Score vs Interest Rate (Risk Bands)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={creditData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="creditScore"
                tick={{ fontSize: 11 }}
                label={{ value: "Credit Score", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{ value: "Interest Rate (%)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "interestRate" ? "Interest Rate (%)" : name
                ]}
              />
              <Area type="monotone" dataKey="interestRate" stroke="#06b6d4" fill="#bae6fd" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Employment */}
        <div className="chart-card">
          <h3>Employment Type vs Loan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Education */}
        <div className="chart-card">
          <h3>Education vs Credit Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Region */}
        <div className="chart-card">
          <h3>Region Risk Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Age */}
        <div className="chart-card">
          <h3>Age Group Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dependents */}
        <div className="chart-card">
          <h3>Dependents Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dependentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Channel */}
        <div className="chart-card">
          <h3>Application Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {channelData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tenure */}
        <div className="chart-card">
          <h3>Loan Tenure vs Loan Amount</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={loans.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="loanTenureMonths"
                label={{ value: "Tenure (Months)", position: "insideBottom", offset: -5, fill: "#cbd5e1" }}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <YAxis
                label={{ value: "Loan Amount", angle: -90, position: "insideLeft", fill: "#cbd5e1" }}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff"
                }}
              />
              <Legend />
              <Bar dataKey="loanAmount" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Loan Amount" />
              <Line type="monotone" dataKey="loanTenureMonths" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} name="Tenure" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud Pattern */}
        <div className="chart-card">
          <h3>Multiple Applications vs Fraud Cases</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fraudSummaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="applications"
                label={{ value: "Multiple Applications", position: "insideBottom", offset: -5, fill: "#cbd5e1" }}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <YAxis
                label={{ value: "Fraud Cases", angle: -90, position: "insideLeft", fill: "#cbd5e1" }}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff"
                }}
              />
              <Legend />
              <Bar dataKey="fraudCases" fill="#ef4444" radius={[6, 6, 0, 0]} name="Fraud Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="chart-card">
          <h3>Customer Risk Score Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={loans.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="customerName"
                tick={{ fill: "#cbd5e1", fontSize: 10 }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 100]}
                label={{ value: "Risk Score", angle: -90, position: "insideLeft", fill: "#cbd5e1" }}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff"
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="riskScore" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Risk Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default App;