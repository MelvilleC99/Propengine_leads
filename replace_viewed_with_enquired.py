#!/usr/bin/env python3
"""
Replace 'viewed' with 'enquired' across all relevant files
"""
import os
import re

files_to_update = [
    '/Users/melville/Documents/PropEgine_leads/dashboard-insights/src/app/property-lead-insights/page.tsx',
    '/Users/melville/Documents/PropEgine_leads/dashboard-insights/src/components/property-lead-insights/property-card.tsx',
    '/Users/melville/Documents/PropEgine_leads/dashboard-insights/src/components/property-lead-insights/overview-metrics.tsx',
    '/Users/melville/Documents/PropEgine_leads/dashboard-insights/src/lib/property-lead-insights/queries.ts',
    '/Users/melville/Documents/PropEgine_leads/dashboard-insights/src/lib/property-lead-insights/types.ts',
]

replacements = [
    # Camel case
    ('lastViewed', 'lastEnquired'),
    ('firstViewed', 'firstEnquired'),
    ('totalViews', 'totalEnquiries'),
    ('timesViewed', 'timesEnquired'),
    ('viewCount', 'enquiryCount'),
    
    # Database columns (snake case)
    ('total_views', 'total_enquiries'),
    
    # Labels/text (with various casings)
    ('Total Views', 'Total Enquiries'),
    ('Total views', 'Total enquiries'),
    ('Unique Leads', 'Unique Leads'),  # Keep this as is
    ('Most Viewed', 'Most Enquired'),
    ('Top 10 Most Viewed Properties', 'Top 10 Most Enquired Properties'),
    (' views', ' enquiries'),
    (' Views', ' Enquiries'),
    ('First Viewed', 'First Enquired'),
    ('Last Viewed', 'Last Enquired'),
    ('Last: ', 'Last: '),  # Keep as is
    ('Viewed this', 'Enquired about this'),
    ('Total viewed', 'Total enquired'),
    ('Also viewing', 'Also enquiring about'),
]

total_replacements = 0

for filepath in files_to_update:
    if not os.path.exists(filepath):
        print(f'⚠️  File not found: {filepath}')
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    original_content = content
    file_replacements = 0
    
    for old, new in replacements:
        count = content.count(old)
        if count > 0:
            content = content.replace(old, new)
            file_replacements += count
    
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'✅ {os.path.basename(filepath)}: {file_replacements} replacements')
        total_replacements += file_replacements
    else:
        print(f'   {os.path.basename(filepath)}: No changes needed')

print(f'\n✅ Total replacements: {total_replacements}')
