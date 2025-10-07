# Dashboard Data Flow - Corrected Understanding

## Data Sources & Usage

### 1. **`sales_rental_sudonum.csv`** (Sydenham Data → "Property Engine")
**What it contains:** ALL leads received (both Sales and Rentals)

**Used for (SALES LEADS ONLY - filter `lead_type === 'Sales'`):**
- ✅ **Total Leads** count
- ✅ **Response Rate** calculation  
- ✅ **Lead Sources** top 5
- ✅ **Cost Per Lead** calculations
- ✅ **Effective Cost Per Lead**
- ✅ **Total Waste Per Lead**

**Used in these dashboards:**
- Sales & Leads Dashboard: Total Leads, Response Rate cards
- Leads Performance: ALL metrics (lead comparison, response rate, agency/agent rankings)
- Marketing ROI: Cost per lead calculations

**CRITICAL:** Always filter for `lead_type === 'Sales'` - NEVER include Rentals!

---

### 2. **`realnet_sales_with_lead_source.csv`** (Sales Data)
**What it contains:** ~1,484 property sales records

**Fields:**
- `sales_leads_count`: Number of leads (only populated for ~400 properties)
- `lead_source`: Source of lead (only populated for ~476 properties)
- `purchase_amount`: Sale price
- `commission_amount`: Commission earned

**Used for:**
- ✅ **Properties Sold** count (all sales)
- ✅ **Total Revenue** (all sales)
- ✅ **Total Commission** (all sales)
- ✅ **Leads Per Sale** (only properties with `sales_leads_count > 0`)
- ✅ **Lead Source Breakdown** (only properties with `lead_source` data)
- ✅ **Revenue by Lead Source** (only properties with `lead_source`)
- ✅ **Commission by Lead Source** (only properties with `lead_source`)

**Used in:**
- Sales & Leads Dashboard: All sales-related metrics

---

### 3. **`agency_marketing_spend.csv`**
**Used for:** Marketing spend calculations in ROI dashboard

---

## Important Data Relationships

### **Total Revenue ≠ Revenue by Lead Source**
- **Total Revenue:** Sum of ALL 1,484 sales = Full revenue
- **Revenue by Lead Source:** Only ~476 sales with `lead_source` data
- **This is EXPECTED** - we don't have lead_source for all sales

### **Leads Per Sale Calculation:**
```typescript
// Only use sales where we KNOW the lead count
const salesWithLeads = salesData.filter(s => s.sales_leads_count > 0); // ~400 sales
const linkedLeadsTotal = _.sumBy(salesWithLeads, 'sales_leads_count');
const leadsPerSale = linkedLeadsTotal / salesWithLeads.length;
```

### **Lead Source Breakdown:**
```typescript
// Only use sales with lead_source data
const salesWithSource = salesData.filter(s => s.lead_source !== null); // ~476 sales
// Then calculate by source (Property24, Private Property, etc.)
```

---

## Agency Filtering Example: "PE George"

When user selects "PE George":

### **From Sydenham Data (`sales_rental_sudonum.csv`):**
```typescript
// Filter leads by agency (with normalization for name variations)
const filtered = leads
  .filter(l => l.lead_type === 'Sales')  // SALES ONLY!
  .filter(l => normalizeAgencyName(l.Franchise) === 'PE George');

// Result:
Total Leads: 247 (example)
Response Rate: 51.7% (example)
```

### **From Sales Data (`realnet_sales_with_lead_source.csv`):**
```typescript
// Filter sales by agency
const filtered = sales.filter(s => s.account_name === 'PE George');

// Results:
Properties Sold: 40 (all sales for PE George)
Total Revenue: R 92,619,200 (sum of all sales)
Total Commission: R 2,315,480 (sum of all commissions)

// Lead Source Breakdown (only sales with lead_source):
- Property24: 9 sales
- Private Property: 3 sales  
- Website: 2 sales
// Note: Only 14 of the 40 sales have lead_source data!

// Leads Per Sale (only sales with sales_leads_count):
- 25 of 40 sales have lead count data
- Total leads for those 25: 247
- Leads Per Sale: 247 / 25 = 9.88
```

---

## Current Status ✅

### **Sales & Leads Dashboard:**
- ✅ Total Leads: From Sydenham (Sales only)
- ✅ Response Rate: From Sydenham (Sales only)
- ✅ Properties Sold: From Sales data (all)
- ✅ Total Revenue: From Sales data (all)
- ✅ Total Commission: From Sales data (all)
- ✅ Leads Per Sale: From Sales data (properties with lead count)
- ✅ Lead Source Breakdown: From Sales data (properties with lead_source)
- ✅ Agency filtering: ✅ FIXED with normalization

### **Leads Performance Page:**
- ✅ Total Leads: From Sydenham (Sales only)
- ✅ Response Rate: From Sydenham (Sales only)  
- ✅ PE vs Competitors: From Sydenham (Sales only)
- ✅ Agency Rankings: From Sydenham (Sales only)
- ✅ Agent Rankings: From Sydenham (Sales only)
- ✅ Lead Sources: From Sydenham (Sales only)
- ✅ Date filtering: ✅ FIXED

---

## Agency Name Normalization

**Problem:** Names don't match between files
- Sales: `"PE George"`
- Leads: `"PE George / Wilderness"`

**Solution:** Normalize both before comparing
```typescript
function normalizeAgencyName(name: string): string {
  return name
    .split('(')[0]      // Remove (location)
    .split('/')[0]      // Remove / location
    .trim();
}
```

**Result:**
- `"PE George / Wilderness"` → `"PE George"` ✅ MATCHES
- `"PE Bosveld (Thabazimbi)"` → `"PE Bosveld"` ✅ MATCHES

---

## Summary of Fixes Applied

1. ✅ **Agency Filter for Leads** - Added normalization to match name variations
2. ✅ **Sales Leads Only** - Confirmed filtering for `lead_type === 'Sales'` everywhere
3. ✅ **Date Filter on Leads Performance** - Complete refactor to support date filtering
4. ✅ **Preserved Lead Source Logic** - Still uses only sales with `lead_source` data

---

## What's Correct (No Changes Needed):

- ✅ Leads Per Sale calculation (only properties with lead count)
- ✅ Lead Source Breakdown (only properties with lead_source)
- ✅ Total Revenue vs Revenue by Lead Source mismatch (EXPECTED)
- ✅ Marketing ROI calculations

**Everything should now be working correctly!** 🎉
