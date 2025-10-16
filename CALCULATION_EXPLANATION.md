# Marketing ROI Dashboard - Calculation Explanation

## ✅ Name Changes Complete

All CSV files updated:
- ✅ **sales_rental_sudonum.csv** (Leads data from Sudonum)
  - 4,109 instances of "PE Platinum" → "RealNet Platinum"
  - 15,376 instances of "PE Premium" → "RealNet Rainmaker"

- ✅ **realnet_sales_with_lead_source.csv** (Sales data)
  - 70 instances of "PE Platinum" → "RealNet Platinum"
  - 452 instances of "PE Premium" → "RealNet Rainmaker"

- ✅ **agency_marketing_spend.csv** (Marketing spend data)
  - Agency names updated with actual Aug & Sep spend figures

---

## 📊 YES - We Use Sudonum Data for Everything!

### **Data Sources:**

1. **Leads Data** = `sales_rental_sudonum.csv` (from Sudonum)
   - Contains all leads with their status
   - Key field: `Status` (e.g., "Agent Responded", "New Lead", etc.)
   - Key field: `Franchise` (agency name, e.g., "RealNet Platinum")
   - Key field: `Source` (portal, e.g., "Property24", "Private Property")

2. **Sales Data** = `realnet_sales_with_lead_source.csv`
   - Contains completed sales
   - Key field: `account_name` (agency name)
   - Key field: `lead_source` (portal where lead originated)

3. **Marketing Spend Data** = `agency_marketing_spend.csv`
   - Your actual monthly spend per agency per portal

---

## 🧮 How Each Metric is Calculated

### **1. Cost Per Lead**
```
Cost Per Lead = Total Marketing Spend ÷ Total Leads

Example for RealNet Platinum (Aug + Sep, Property24):
= (R17,116.52 + R19,722.60) ÷ Total P24 Leads
= R36,839.12 ÷ [Number of leads from Sudonum]
```

**Data Used:**
- ✅ Total Spend: From `agency_marketing_spend.csv`
- ✅ Total Leads: Count from `sales_rental_sudonum.csv` where `Franchise = "RealNet Platinum"` and `Source = "Property24"`

---

### **2. Effective Cost Per Lead (Real Cost Per Lead)**
```
Effective Cost Per Lead = Total Marketing Spend ÷ Responded Leads

Responded Leads = Leads where Status = "Agent Responded"
```

**This is the REAL cost per lead** because it only counts leads that agents actually responded to!

**Example:**
- Total Spend: R36,839.12
- Total Leads: 1,000
- Responded Leads: 650 (65% response rate)
- Effective Cost Per Lead = R36,839.12 ÷ 650 = R56.68

**Data Used:**
- ✅ Total Spend: From `agency_marketing_spend.csv`
- ✅ Responded Leads: Count from `sales_rental_sudonum.csv` where `Status = "Agent Responded"`

---

### **3. Response Rate**
```
Response Rate = (Responded Leads ÷ Total Leads) × 100

Example:
= (650 ÷ 1,000) × 100
= 65%
```

**Data Used:**
- ✅ From `sales_rental_sudonum.csv` (Sudonum data)

---

### **4. Wasted Cost Per Lead**
```
Step 1: Calculate Wastage Rate
Wastage Rate = 100% - Response Rate

Step 2: Calculate Wasted Spend
Wasted Spend = Total Spend × (Wastage Rate ÷ 100)

Step 3: Calculate Wasted Cost Per Lead
Wasted Cost Per Lead = Wasted Spend ÷ Non-Responded Leads

Example:
- Response Rate: 65%
- Wastage Rate: 35%
- Total Spend: R36,839.12
- Wasted Spend: R36,839.12 × 0.35 = R12,893.69
- Non-Responded Leads: 1,000 - 650 = 350
- Wasted Cost Per Lead: R12,893.69 ÷ 350 = R36.84
```

**Data Used:**
- ✅ Response data from `sales_rental_sudonum.csv`
- ✅ Spend from `agency_marketing_spend.csv`

---

### **5. Cost Per Sale** 🎯
```
Cost Per Sale = Total Marketing Spend ÷ Total Sales

Example for RealNet Platinum (Aug + Sep, Property24):
= (R17,116.52 + R19,722.60) ÷ Total Sales with P24 lead source
= R36,839.12 ÷ [Number of sales from realnet_sales_with_lead_source.csv]
```

**Data Used:**
- ✅ Total Spend: From `agency_marketing_spend.csv`
- ✅ Total Sales: Count from `realnet_sales_with_lead_source.csv` where:
  - `account_name = "RealNet Platinum"` 
  - `lead_source = "Property24"`
  - Date within selected month range

**Example:**
If RealNet Platinum had:
- Total P24 Spend (Aug + Sep): R36,839.12
- Total P24 Sales in that period: 15 sales
- Cost Per Sale = R36,839.12 ÷ 15 = **R2,455.94 per sale**

---

## 🔄 Complete Flow Example

Let's trace RealNet Platinum for August 2025, Property24:

### **Step 1: Get Marketing Spend**
From `agency_marketing_spend.csv`:
- August P24 spend: R17,116.52

### **Step 2: Count Total Leads**
From `sales_rental_sudonum.csv`:
- Filter: `Franchise = "RealNet Platinum"`
- Filter: `Source = "Property24"`
- Filter: Date in August 2025
- Result: Let's say **500 leads**

### **Step 3: Count Responded Leads**
From same filtered leads:
- Additional filter: `Status = "Agent Responded"`
- Result: Let's say **325 leads** (65% response rate)

### **Step 4: Count Sales**
From `realnet_sales_with_lead_source.csv`:
- Filter: `account_name = "RealNet Platinum"`
- Filter: `lead_source = "Property24"`
- Filter: Date in August 2025
- Result: Let's say **12 sales**

### **Step 5: Calculate All Metrics**

1. **Cost Per Lead** = R17,116.52 ÷ 500 = **R34.23**

2. **Effective Cost Per Lead** = R17,116.52 ÷ 325 = **R52.67**

3. **Response Rate** = (325 ÷ 500) × 100 = **65%**

4. **Wastage Rate** = 100% - 65% = **35%**

5. **Wasted Spend** = R17,116.52 × 0.35 = **R5,990.78**

6. **Non-Responded Leads** = 500 - 325 = **175 leads**

7. **Wasted Cost Per Lead** = R5,990.78 ÷ 175 = **R34.23**

8. **Cost Per Sale** = R17,116.52 ÷ 12 = **R1,426.38**

---

## ✅ Summary

**YES, we use Sudonum data for:**
- ✅ Lead counts (total leads)
- ✅ Response rates (Status = "Agent Responded")
- ✅ Calculating effective cost per lead
- ✅ Calculating wasted spend and wasted cost per lead

**Sales data comes from:**
- ✅ `realnet_sales_with_lead_source.csv` for cost per sale calculation

**Marketing spend comes from:**
- ✅ `agency_marketing_spend.csv` with your actual Aug & Sep figures

**All calculations are now using actual monthly spend, not averaged!**

---

## 🎯 Key Insight

The **"Effective Cost Per Lead"** is your most important metric because:
- It shows the TRUE cost per lead that agents actually responded to
- It accounts for the wastage (non-responded leads)
- Example: If you pay R34 per lead but only 65% respond, your effective cost is R52

The **"Cost Per Sale"** shows ROI because:
- It tells you exactly how much marketing spend it takes to generate one sale
- You can compare this to your commission to see if it's profitable
