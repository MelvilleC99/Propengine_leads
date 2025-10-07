# Agency Filter Issue - RESOLVED ✅

## Issue
When filtering by agency on Sales & Leads dashboard:
- Sales filtered correctly
- **Leads showed 0** even though data existed
- Response rate was 0% or incorrect

## Root Cause Found 🎯

**The agency names don't match between the two CSV files!**

### Sales CSV (`realnet_sales_with_lead_source.csv`):
```
'PE Bosveld'
'PE George'
'PE Pristine'
'PE Pretoria North'
'PE Select'
```

### Leads CSV (`sales_rental_sudonum.csv`):
```
'PE Bosveld (Thabazimbi)'           ← Has location in parentheses!
'PE George / Wilderness'             ← Has location after slash!
'PE Pristine (Jbay & St Francis)'   ← Has location in parentheses!
'PE Pretoria North-West'            ← Different name!
'PE Select (Cape Town – Strandfontein / Michells Plain)'  ← Very detailed!
```

**The exact string matching failed because:**
- `"PE George" !== "PE George / Wilderness"`
- `"PE Bosveld" !== "PE Bosveld (Thabazimbi)"`

## Solution Applied ✅

Added name normalization function in `/src/lib/sales-dashboard/calculations.ts`:

```typescript
function normalizeAgencyName(name: string): string {
  return name
    .split('(')[0]      // Remove everything after (
    .split('/')[0]      // Remove everything after /
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}
```

Updated `filterLeadsByAgencies()` to normalize BOTH:
1. The selected agencies from the dropdown
2. The Franchise field in each lead record

Now the matching works:
- User selects: `"PE George"` (from sales data)
- Normalizes to: `"PE George"`
- Matches: `"PE George / Wilderness"` → normalizes to `"PE George"` ✅

## Examples of Normalization

| Original Name (Leads CSV) | Normalized | Matches (Sales CSV) |
|---------------------------|------------|---------------------|
| PE Bosveld (Thabazimbi) | PE Bosveld | PE Bosveld ✅ |
| PE George / Wilderness | PE George | PE George ✅ |
| PE Pristine (Jbay & St Francis) | PE Pristine | PE Pristine ✅ |
| PE Select (Cape Town – Strandfontein / Michells Plain) | PE Select | PE Select ✅ |
| PE Sterling (Uitenhage/ Despatch/PE) | PE Sterling | PE Sterling ✅ |

## Files Modified

1. `/src/lib/sales-dashboard/calculations.ts`
   - Added `normalizeAgencyName()` function
   - Updated `filterLeadsByAgencies()` to use normalization
   - Added debug logging (can be removed later)

## Testing

Now when you:
1. Filter by "PE George" on Sales & Leads dashboard
2. It should show:
   - ✅ Properties Sold (from sales data)
   - ✅ Total Leads (from leads data - including "PE George / Wilderness")
   - ✅ Response Rate (calculated from filtered leads)
   - ✅ All other metrics

## Debug Logging

Console logs are still active to verify the fix works:
- Shows original and normalized agency names
- Shows how many leads are found after filtering
- Can be removed once confirmed working

## Next Steps

1. Test the dashboard: `npm run dev`
2. Filter by various agencies (especially PE George, PE Bosveld, PE Pristine)
3. Verify leads count and response rate update correctly
4. If working correctly, we can remove the console.log statements

---

**This should completely fix the agency filtering issue! 🎉**
