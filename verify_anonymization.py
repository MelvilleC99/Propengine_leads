#!/usr/bin/env python3
"""
Quick verification that no 'RealNet' strings remain in CSV files.
"""

import os
from pathlib import Path

def check_file_for_realnet(filepath):
    """Check if file contains 'RealNet' (case-insensitive)."""
    found_instances = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            if 'realnet' in line.lower():
                found_instances.append((line_num, line.strip()[:100]))
    
    return found_instances

def main():
    public_dir = Path('public')
    csv_files = [
        'agency_marketing_spend.csv',
        'agent_response_rates.csv',
        'realnet_agency_response_rates.csv',
        'realnet_sales_with_lead_source.csv',
        'sales_rental_sudonum.csv',
        'other_agency_response_rates.csv'
    ]
    
    print("=" * 60)
    print("VERIFICATION: Checking for 'RealNet' in CSV files")
    print("=" * 60)
    
    all_clear = True
    
    for csv_file in csv_files:
        filepath = public_dir / csv_file
        print(f"\n📄 Checking {csv_file}...")
        
        instances = check_file_for_realnet(filepath)
        
        if instances:
            print(f"   ⚠️  Found {len(instances)} instance(s) of 'RealNet':")
            for line_num, content in instances[:3]:  # Show first 3
                print(f"      Line {line_num}: {content}")
            all_clear = False
        else:
            print(f"   ✅ Clean - No 'RealNet' found")
    
    print("\n" + "=" * 60)
    if all_clear:
        print("✅ VERIFICATION PASSED!")
        print("All files are properly anonymized.")
    else:
        print("⚠️  VERIFICATION FAILED!")
        print("Some files still contain 'RealNet'.")
    print("=" * 60)

if __name__ == "__main__":
    main()
