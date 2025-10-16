# Sales Data Source Analysis - RealNet Platinum & Rainmaker

## 🔍 ISSUE: Low Sales Numbers for Portal Marketing Spend

You're spending significant money on Property24 and Private Property marketing, but the sales numbers seem very low. Here's what the data shows:

---

## 📊 **RealNet Platinum Sales Breakdown**

**Total Sales: 70**

| Lead Source | Count | Percentage |
|-------------|-------|------------|
| **NO LEAD SOURCE (empty)** | **36** | **51.4%** |
| Website | 21 | 30.0% |
| Word of Mouth | 7 | 10.0% |
| **Property24** | **2** | **2.9%** |
| Other | 2 | 2.9% |
| Canvassing | 2 | 2.9% |
| **Private Property** | **0** | **0%** |

### 🚨 **Problem:**
- You're paying for P24 & PP marketing
- But only **2 sales** (2.9%) are attributed to Property24
- **ZERO sales** attributed to Private Property
- **51% of sales have NO lead source** - we don't know where they came from!

---

## 📊 **RealNet Rainmaker Sales Breakdown**

**Total Sales: 452**

| Lead Source | Count | Percentage |
|-------------|-------|------------|
| **NO LEAD SOURCE (empty)** | **315** | **69.7%** |
| **Property24** | **67** | **14.8%** |
| Canvassing | 32 | 7.1% |
| **Private Property** | **13** | **2.9%** |
| Boards (For Sale) | 5 | 1.1% |
| Other | 5 | 1.1% |
| Word of Mouth | 4 | 0.9% |
| Website | 2 | 0.4% |
| Family | 1 | 0.2% |

### 🚨 **Problem:**
- **70% of sales have NO lead source** - massive data gap!
- Only 67 sales (14.8%) attributed to Property24
- Only 13 sales (2.9%) attributed to Private Property
- You're spending over R100k/month on portals, but attribution is missing

---

## 🎯 **Root Cause: Missing Lead Source Data**

### **The Sales CSV Source:**
File: `realnet_sales_with_lead_source.csv`

This appears to be sales data, but the `lead_source` column is:
- **Empty for 51-70% of records** (no lead source at all)
- Only filled in when there's a clear attribution

### **Why This Happens:**
1. **Agents don't always capture lead source** when recording a sale
2. **Sales close weeks/months later** - agents forget where the lead came from
3. **Multiple touchpoints** - buyer saw P24, then visited office, sale recorded as "walk-in"
4. **Manual data entry errors** - fields left blank

---

## 💡 **What This Means for Your ROI Dashboard**

### **Current Calculation:**
```
Cost Per Sale = Total Marketing Spend ÷ Sales with Lead Source

RealNet Platinum (Aug + Sep):
- P24 Spend: R36,839.12
- P24 Sales: 2 sales
- Cost Per Sale: R36,839.12 ÷ 2 = R18,419.56 per sale ❌

RealNet Rainmaker (Aug + Sep):
- P24 Spend: R154,427.75
- P24 Sales: 67 sales
- Cost Per Sale: R154,427.75 ÷ 67 = R2,304.89 per sale
```

### **The Problem:**
The **Cost Per Sale is ONLY calculated for sales with a lead source**. This means:
- Sales with empty lead_source are **ignored**
- The real ROI might be better (if those blank sales came from portals)
- OR it could be worse (if you're spending on portals but sales come from elsewhere)

---

## ❓ **Key Questions for You**

1. **Is this sales data accurate?**
   - Source file: `realnet_sales_with_lead_source.csv`
   - Does this represent ALL sales for these agencies?

2. **Why are 51-70% of sales missing lead source?**
   - Is this normal in your data?
   - Do agents capture this information?

3. **Web Reference Field:**
   - I see there's a `web_reference` column (like RNR14184, RL94099)
   - Could we use this to improve lead source attribution?
   - These look like portal reference numbers

4. **Do you have a better sales data source?**
   - Perhaps from a different system?
   - With better lead source tracking?

---

## 🔧 **Possible Solutions**

### **Option 1: Accept Current Attribution (Conservative)**
- Keep current logic
- Only count sales with explicit P24/PP lead source
- This gives a conservative (possibly pessimistic) ROI view

### **Option 2: Use Web Reference for Attribution**
- Check if sales with `web_reference` but no `lead_source` came from portals
- Extract portal from web reference format
- Improve attribution accuracy

### **Option 3: Proportional Attribution**
- Assume blank lead sources follow same distribution as known sources
- If 80% of known sources are P24, assume 80% of blanks are too
- More optimistic ROI, but based on assumptions

### **Option 4: Get Better Source Data**
- Work with your CRM/system to improve lead source capture
- Ensure agents always record where leads came from
- Best long-term solution

---

## 📋 **Summary**

**Current Situation:**
- ✅ Dashboard calculations are CORRECT based on available data
- ❌ Data quality is poor - 51-70% missing lead sources
- ❌ ROI metrics are therefore incomplete/unreliable

**What's Being Calculated:**
- Cost Per Sale = Spend ÷ Sales **WITH lead_source attribution**
- This excludes all the blank sales
- Numbers may look worse than reality OR may hide poor performance

**Next Steps:**
1. Verify this is the correct sales data source
2. Check if web_reference can help attribution
3. Consider data quality improvement initiatives
4. Decide which calculation approach makes sense for your business

---

Would you like me to:
1. Check the web_reference field to see if we can improve attribution?
2. Modify calculations to handle blank lead sources differently?
3. Add a data quality warning to the dashboard showing % of sales with missing lead source?
