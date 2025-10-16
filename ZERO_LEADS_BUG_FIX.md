# Zero Leads Bug Fix

## Issue Found
RealNet Rainmaker AGRI (formerly PE Premium AGRI - Farms & Smallholdings) was showing wasted spend even though there were **zero leads** in the system.

## Root Cause
When `totalLeads = 0`:
- Old logic: `wastageRate = 100 - 0 = 100%`
- Old logic: `wastedSpend = totalSpend × 1.00 = totalSpend` ❌

This showed the entire marketing spend as "wasted" even though there were no leads to base this calculation on.

## Fix Applied
Updated `calculateSourceMetrics()` function in `/src/lib/leads-marketing-roi/calculations.ts`:

```typescript
// Before (WRONG):
const responseRate = totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0;
const wastageRate = 100 - responseRate;  // ❌ Always 100% when no leads
const wastedSpend = totalSpend * (wastageRate / 100);  // ❌ Shows total spend as wasted

// After (CORRECT):
const responseRate = totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0;
const wastageRate = totalLeads > 0 ? 100 - responseRate : 0;  // ✅ 0% when no leads
const wastedSpend = totalLeads > 0 ? totalSpend * (wastageRate / 100) : 0;  // ✅ R0 when no leads
```

## Result
Now when there are **zero leads**:
- Response Rate: 0%
- Wastage Rate: 0% (instead of 100%)
- Wasted Spend: R0 (instead of showing total spend)
- Wasted Cost Per Lead: R0

This makes logical sense because:
- You can't have a response rate without leads
- You can't have wastage without leads
- The spend might be allocated, but we can't measure its effectiveness without data

## Agencies Affected
Any agency with marketing spend allocated but zero leads in the system:
- RealNet Rainmaker AGRI - Farms & Smallholdings
- Any other agencies that might have this scenario

## Testing
After this fix:
1. RealNet Rainmaker AGRI should show:
   - Total Leads: 0
   - Response Rate: 0%
   - Wastage Rate: 0%
   - Wasted Spend: R0.00
   
2. The dashboard will no longer show misleading "wasted spend" figures for agencies with no lead data.
