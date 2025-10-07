# Debugging Agency Filter Issue - Leads Count Showing 0

## Issue Description
When filtering by agency (e.g., "PE Bloemfontein") on the Sales & Leads dashboard:
- Sales data filters correctly (shows properties sold)
- **Leads count shows 0**
- **Response rate shows 0% or incorrect values**
- But we know the sudonum CSV has leads data for that agency

## Root Cause Analysis

### Data Flow:
1. **Sales Data:** `realnet_sales_with_lead_source.csv` → `account_name` field → "PE Bloemfontein"
2. **Leads Data:** `sales_rental_sudonum.csv` → `Franchise` field → "PE Bloemfontein" (or variations?)
3. **Filtering:** Must match `account_name` (sales) with `Franchise` (leads)

### Possible Issues:

#### 1. **Name Mismatch** (Most Likely)
The agency names might not match exactly between the two CSV files:
- Sales CSV: `"PE Bloemfontein"`
- Leads CSV: `"PE Bloemfontein"` OR `"PE - Bloemfontein"` OR something else?

#### 2. **Whitespace Issues**
- Trailing/leading spaces in CSV data
- Different whitespace characters

#### 3. **Case Sensitivity**
- Though less likely since we're using exact match

## Debug Steps Added

I've added console.log statements to help diagnose:

### In `/src/app/sales/page.tsx`:
```typescript
console.log('=== FILTERING DEBUG ===');
console.log('Selected agencies:', selectedAgencies);
console.log('Filtered sales:', currentData.sales.length);
console.log('Filtered leads:', currentData.leads.length);
console.log('Sales leads only:', currentData.leads.filter(l => l.lead_type === 'Sales').length);
console.log('Calculated metrics:', metrics);
```

### In `/src/lib/sales-dashboard/calculations.ts`:
```typescript
console.log('filterLeadsByAgencies called with:', {
  totalLeads: data.length,
  agencies: agencies,
  sampleFranchises: data.slice(0, 5).map(l => l.Franchise)
});
console.log('filterLeadsByAgencies result:', {
  filteredLeads: filtered.length,
  sampleFiltered: filtered.slice(0, 3).map(l => ({ franchise: l.Franchise, status: l.Status, type: l.lead_type }))
});
```

## How to Debug

1. **Run the dashboard:**
   ```bash
   npm run dev
   ```

2. **Open browser console (F12)**

3. **Filter by an agency** (e.g., "PE Bloemfontein")

4. **Check the console output:**
   
   Look for:
   - What agency names are being sent to the filter?
   - What franchise names exist in the leads data?
   - How many leads are being returned?

### Example Expected Output:
```
=== FILTERING DEBUG ===
Selected agencies: ["PE Bloemfontein"]
filterLeadsByAgencies called with: {
  totalLeads: 31743,
  agencies: ["PE Bloemfontein"],
  sampleFranchises: ["PE Premium", "PE Select", "PE Bloemfontein", ...]
}
filterLeadsByAgencies result: {
  filteredLeads: 1573,
  sampleFiltered: [...]
}
Filtered sales: 148
Filtered leads: 1573
Sales leads only: 1573
Calculated metrics: { totalLeads: 1573, responseRate: 49.7, ... }
```

## Quick Fix if Name Mismatch Found

If the console shows the names don't match (e.g., "PE - Bloemfontein" vs "PE Bloemfontein"), we need to normalize them:

### Solution: Add name normalization function

```typescript
function normalizeAgencyName(name: string): string {
  return name
    .replace(/\s*-\s*/g, ' ')  // Remove dashes with spaces
    .replace(/\s+/g, ' ')       // Normalize multiple spaces
    .trim()
    .toLowerCase();
}

export function filterLeadsByAgencies(
  data: LeadRecord[],
  agencies: string[]
): LeadRecord[] {
  if (agencies.length === 0) return data;
  
  const normalizedAgencies = agencies.map(normalizeAgencyName);
  
  return data.filter(lead => 
    normalizedAgencies.includes(normalizeAgencyName(lead.Franchise))
  );
}
```

## Next Steps

1. Run the dashboard and check console logs
2. Share the console output
3. Based on what we see, we'll apply the appropriate fix

## Files with Debug Logging

- `/src/app/sales/page.tsx` - Added filtering debug output
- `/src/lib/sales-dashboard/calculations.ts` - Added filterLeadsByAgencies debug output

**These console.log statements should be removed once the issue is fixed.**
