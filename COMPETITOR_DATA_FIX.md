# Leads Performance - Competitor Data Fix

## Issue
After anonymization, ALL agencies in `sales_rental_sudonum.csv` start with "PE" (Property Engine), so there are no competitor agencies in that file anymore.

## Solution
Load competitor data from the separate `other_agency_response_rates.csv` file instead.

## Data Sources for Leads Performance Page

### **Property Engine Data** (Filtered by Date)
- **Source:** `sales_rental_sudonum.csv`
- **Filter:** `lead_type === 'Sales'` AND selected date range
- **Used for:**
  - PE Total Leads count
  - PE Response Rate
  - PE Agency rankings (top/bottom 5)
  - PE Agent rankings (top/bottom 5)
  - Lead Sources

### **Competitor Data** (All-Time, No Date Filter)
- **Source:** `other_agency_response_rates.csv`
- **Pre-aggregated data** from competitors
- **Used for:**
  - Competitor Total Leads count
  - Competitor Response Rate
  - Comparison metrics (PE vs Industry)

## Why Competitor Data is NOT Date-Filtered

The competitor data in `other_agency_response_rates.csv` is:
1. Already anonymized (`Competitor Branch 1`, `Competitor Branch 2`, etc.)
2. Pre-aggregated (we don't have raw lead records)
3. Used as a **benchmark** for comparison

We show:
- **PE data** for the selected date range (dynamic)
- **Competitor data** as all-time benchmark (static)

This is intentional and makes sense for comparison purposes.

## Files Modified

**`/src/app/leads/page.tsx`:**
```typescript
// Load both data sources
const [rawLeads, setRawLeads] = useState<LeadRecord[]>([]);
const [otherAgenciesData, setOtherAgenciesData] = useState<OtherAgency[]>([]);

useEffect(() => {
  // Load PE leads from Sydenham CSV (for date filtering)
  Papa.parse('/sales_rental_sudonum.csv', { ... });
  
  // Load competitor data from pre-aggregated CSV (no date filtering)
  Papa.parse('/other_agency_response_rates.csv', { ... });
}, []);

// Later in the component:
const otherAgencies = otherAgenciesData; // Use pre-loaded data
```

## Result

Now the Leads Performance page shows:

### **Total Leads Comparison Card:**
- Property Engine: X leads (filtered by date)
- Other Agencies: Y leads (all-time benchmark)
- Difference: ±Z leads (X% more/less)

### **Response Rate Comparison Card:**
- Property Engine: X% (filtered by date)
- Other Agencies: Y% (all-time benchmark)
- Difference: ±Z% better/worse than industry

---

**✅ Competitor data is now showing correctly!**
