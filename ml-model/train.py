from pymongo import MongoClient
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# ================= CONNECT MONGODB ATLAS =================

MONGO_URI = "mongodb+srv://nandanamukh14_db_user:Pnu%402003@cluster0.qaxu26u.mongodb.net/BankLoan?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)

db = client["BankLoan"]
collection = db["Banking_Loan_Data"]

# ================= FETCH DATA =================

data = list(collection.find())

print("📌 Total documents fetched:", len(data))

if len(data) == 0:
    raise Exception("❌ No data found in MongoDB collection. Check DB or collection name.")

df = pd.json_normalize(data)

# ================= CLEAN =================

if "_id" in df.columns:
    df.drop(columns=["_id"], inplace=True)

print("\n✅ Columns in dataset:")
print(df.columns.tolist())

# ================= FEATURES =================

features = [

    "income",
    "monthlyExpenses",
    "savingsAmount",
    "creditScore",
    "debtToIncomeRatio",
    "existingLoansCount",
    "loanAmount",
    "interestRate",
    "jobTenureYears",
    "creditHistoryLength",
    "loanTenureMonths",
    "dependents",
    "age"

]

target = "loanStatus"

# ================= VALIDATION =================

missing_cols = [col for col in features + [target] if col not in df.columns]

if missing_cols:
    print("\n❌ Missing columns:", missing_cols)
    print("\n👉 Fix MongoDB field names (case-sensitive)")
    exit()

# ================= CLEAN DATA =================

df = df.dropna(subset=features + [target])

print("📌 Final training data shape:", df.shape)

# ================= SPLIT DATA =================

X = df[features]
y = df[target].apply(lambda x: 1 if x == "Approved" else 0)

X_train, X_test, y_train, y_test = train_test_split(

    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y

)

# ================= TRAIN MODEL =================

model = RandomForestClassifier(

    n_estimators=200,
    random_state=42,
    class_weight="balanced"

)

model.fit(X_train, y_train)

# ================= EVALUATION =================

accuracy = model.score(X_test, y_test)

# ================= SAVE MODEL =================

model_path = os.path.join(os.path.dirname(__file__), "model.pkl")

joblib.dump(model, model_path)

print("\n✅ Model trained successfully!")
print("Accuracy:", accuracy)