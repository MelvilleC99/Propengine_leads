#!/usr/bin/env python3
"""
Anonymize dashboard data by replacing real agency and agent names with fake ones.
"""

import pandas as pd
import re
from pathlib import Path
import random

# Fake agent names to use
FAKE_AGENT_NAMES = [
    "James Mitchell", "Robert Chen", "Michael Anderson", "David Thompson",
    "William Foster", "Thomas Brooks", "Daniel Martinez", "Christopher Lee",
    "Matthew Davis", "Andrew Wilson", "Joshua Garcia", "Ryan Peterson",
    "Brandon Miller", "Tyler Moore", "Jacob Taylor", "Nicholas White",
    "Kevin Harris", "Eric Johnson", "Brian Clark", "Steven Rodriguez",
    "Justin Lewis", "Aaron Walker", "Kyle Hall", "Nathan Young",
    "Derek Allen", "Marcus King", "Luke Wright", "Connor Lopez",
    "Ethan Hill", "Isaac Scott", "Gabriel Green", "Austin Baker",
    "Jordan Adams", "Cameron Nelson", "Hunter Carter", "Caleb Mitchell",
    "Evan Turner", "Adrian Phillips", "Ian Campbell", "Sean Parker",
    "Vincent Evans", "Blake Edwards", "Owen Collins", "Carson Stewart",
    "Trevor Morris", "Cole Rogers", "Spencer Reed", "Brett Cook",
    "Travis Morgan", "Seth Bell", "Preston Murphy", "Jared Bailey",
    "Marcus Rivera", "Grant Cooper", "Wesley Richardson", "Chase Cox",
    "Garrett Howard", "Shane Ward", "Marcus Torres", "Dustin Peterson",
    "Bradley Gray", "Colin Ramirez", "Malcolm James", "Raymond Watson",
    "Kenneth Brooks", "Gerald Hayes", "Keith Myers", "Dennis Wood",
    "Frank Ross", "Louis Henderson", "Carl Coleman", "Arthur Jenkins",
    "Albert Perry", "Roy Powell", "Eugene Long", "Ralph Patterson",
    "Russell Hughes", "Harry Flores", "Philip Washington", "Douglas Butler",
    "Henry Simmons", "Walter Foster", "Jerome Bryant", "Lawrence Alexander",
    "Leo Russell", "Howard Griffin", "Gregory Diaz", "Martin Hayes",
    "Samuel Bennett", "Victor Webb", "Frederick Price", "Francis Barnes",
    "Peter Ross", "Harold Fisher", "Edwin Sanders", "Curtis Stevens",
    "Stanley Wells", "Leonard Hughes", "Ernest Porter", "Leon Griffin",
    "Bernard Mason", "Dale Dixon", "Craig Hunt", "Edgar Hart",
    "Gordon Kennedy", "Maurice West", "Rodney Shaw", "Claude Chapman",
    "Floyd Gibson", "Norman Knight", "Vernon Fuller", "Hugo Walton",
    "Randall Beck", "Milton Stone", "Clifford Flynn", "Lester Harper",
    "Theodore Duncan", "Gilbert Carr", "Leroy Wade", "Marvin Cortez",
    "Melvin Lowe", "Oscar Newman", "Julius Delgado", "Allan Santiago",
    "Warren Hicks"
]

# Shuffle to randomize assignment
random.seed(42)  # For reproducibility
random.shuffle(FAKE_AGENT_NAMES)

def anonymize_agency_name(agency_name):
    """
    Convert agency names to PE format.
    Examples:
    - "RealNet Bloemfontein" -> "PE Bloemfontein"
    - "RealNet RainMaker" -> "PE Premium"
    - "RealNet - Bloemfontein" -> "PE Bloemfontein"
    - "RealNet - Rainmaker" -> "PE Premium"
    """
    if pd.isna(agency_name) or agency_name == "":
        return agency_name
    
    # Remove various RealNet prefixes
    name = str(agency_name)
    name = re.sub(r'^RealNet\s*-?\s*', '', name, flags=re.IGNORECASE)
    name = re.sub(r'^RealNet\s+', '', name, flags=re.IGNORECASE)
    
    # Replace RainMaker with Premium (case-insensitive)
    name = re.sub(r'\bRainMaker\b', 'Premium', name, flags=re.IGNORECASE)
    name = re.sub(r'\brainmaker\b', 'Premium', name, flags=re.IGNORECASE)
    
    # Add PE prefix
    return f"PE {name}".strip()

def create_agent_mapping(all_csv_files):
    """
    Create a consistent mapping of real agent names to fake names.
    """
    # Collect all unique agent names from all files
    all_agents = set()
    
    print("Collecting all agent names from CSV files...")
    
    # agent_response_rates.csv
    try:
        df = pd.read_csv(all_csv_files['agent_response_rates'])
        if 'agent_name' in df.columns:
            all_agents.update(df['agent_name'].dropna().unique())
    except Exception as e:
        print(f"Warning reading agent_response_rates.csv: {e}")
    
    # realnet_sales_with_lead_source.csv
    try:
        df = pd.read_csv(all_csv_files['realnet_sales'])
        if 'agent_names' in df.columns:
            # Handle comma-separated agent names
            for names in df['agent_names'].dropna():
                if names:
                    all_agents.update([n.strip() for n in str(names).split(',')])
    except Exception as e:
        print(f"Warning reading realnet_sales_with_lead_source.csv: {e}")
    
    # sales_rental_sudonum.csv
    try:
        df = pd.read_csv(all_csv_files['sales_rental'])
        if 'Agent Name' in df.columns:
            all_agents.update(df['Agent Name'].dropna().unique())
    except Exception as e:
        print(f"Warning reading sales_rental_sudonum.csv: {e}")
    
    # Remove empty strings
    all_agents = {a for a in all_agents if a and str(a).strip()}
    
    print(f"Found {len(all_agents)} unique agent names")
    
    # Create mapping
    agent_mapping = {}
    
    # Sort agents for consistent assignment
    sorted_agents = sorted(all_agents)
    
    # Cycle through fake names, reusing them without numbers if we run out
    for i, real_name in enumerate(sorted_agents):
        fake_name_idx = i % len(FAKE_AGENT_NAMES)
        agent_mapping[real_name] = FAKE_AGENT_NAMES[fake_name_idx]
    
    return agent_mapping

def anonymize_agent_name(name, mapping):
    """Replace agent name with fake name from mapping."""
    if pd.isna(name) or name == "":
        return name
    return mapping.get(str(name).strip(), name)

def anonymize_agent_names_list(names_str, mapping):
    """Handle comma-separated agent names."""
    if pd.isna(names_str) or names_str == "":
        return names_str
    
    names = [n.strip() for n in str(names_str).split(',')]
    anonymized = [mapping.get(n, n) for n in names]
    return ', '.join(anonymized)

def main():
    # Define file paths
    public_dir = Path('public')
    
    csv_files = {
        'agency_marketing': public_dir / 'agency_marketing_spend.csv',
        'agent_response': public_dir / 'agent_response_rates.csv',
        'realnet_agency': public_dir / 'realnet_agency_response_rates.csv',
        'realnet_sales': public_dir / 'realnet_sales_with_lead_source.csv',
        'sales_rental': public_dir / 'sales_rental_sudonum.csv',
        'other_agency': public_dir / 'other_agency_response_rates.csv'
    }
    
    # Check all files exist
    missing = [name for name, path in csv_files.items() if not path.exists()]
    if missing:
        print(f"ERROR: Missing files: {missing}")
        return
    
    print("=" * 60)
    print("ANONYMIZING DASHBOARD DATA")
    print("=" * 60)
    
    # Create agent name mapping
    agent_mapping = create_agent_mapping(csv_files)
    
    print(f"\nAgent mapping created: {len(agent_mapping)} agents")
    print("\nSample mappings:")
    for i, (real, fake) in enumerate(list(agent_mapping.items())[:5]):
        print(f"  {real} -> {fake}")
    
    # Process each CSV file
    print("\n" + "=" * 60)
    print("PROCESSING FILES")
    print("=" * 60)
    
    
    # 1. agency_marketing_spend.csv
    print("\n1. Processing agency_marketing_spend.csv...")
    df = pd.read_csv(csv_files['agency_marketing'])
    df['account_name'] = df['account_name'].apply(anonymize_agency_name)
    df.to_csv(csv_files['agency_marketing'], index=False)
    print(f"   ✓ Anonymized {len(df)} agency records")
    
    # 2. agent_response_rates.csv
    print("\n2. Processing agent_response_rates.csv...")
    df = pd.read_csv(csv_files['agent_response'])
    df['agent_name'] = df['agent_name'].apply(lambda x: anonymize_agent_name(x, agent_mapping))
    df.to_csv(csv_files['agent_response'], index=False)
    print(f"   ✓ Anonymized {len(df)} agent records")
    
    # 3. realnet_agency_response_rates.csv
    print("\n3. Processing realnet_agency_response_rates.csv...")
    df = pd.read_csv(csv_files['realnet_agency'])
    df['agency'] = df['agency'].apply(anonymize_agency_name)
    df.to_csv(csv_files['realnet_agency'], index=False)
    print(f"   ✓ Anonymized {len(df)} agency records")
    
    # 4. realnet_sales_with_lead_source.csv (large file)
    print("\n4. Processing realnet_sales_with_lead_source.csv...")
    df = pd.read_csv(csv_files['realnet_sales'])
    df['account_name'] = df['account_name'].apply(anonymize_agency_name)
    df['agent_names'] = df['agent_names'].apply(lambda x: anonymize_agent_names_list(x, agent_mapping))
    df.to_csv(csv_files['realnet_sales'], index=False)
    print(f"   ✓ Anonymized {len(df)} sales records")
    
    # 5. sales_rental_sudonum.csv (very large file)
    print("\n5. Processing sales_rental_sudonum.csv...")
    df = pd.read_csv(csv_files['sales_rental'])
    df['Franchise'] = df['Franchise'].apply(anonymize_agency_name)
    df['Agent Name'] = df['Agent Name'].apply(lambda x: anonymize_agent_name(x, agent_mapping))
    df.to_csv(csv_files['sales_rental'], index=False)
    print(f"   ✓ Anonymized {len(df)} lead records")
    
    # 6. other_agency_response_rates.csv
    # Remove org_name and agency columns, keep only response rate data
    print("\n6. Processing other_agency_response_rates.csv...")
    df = pd.read_csv(csv_files['other_agency'])
    # Replace org and agency names with generic labels
    df['org_name'] = 'Competitor Agency'
    df['agency'] = df.apply(lambda row: f"Competitor Branch {row.name + 1}", axis=1)
    df.to_csv(csv_files['other_agency'], index=False)
    print(f"   ✓ Anonymized {len(df)} competitor records")
    
    print("\n" + "=" * 60)
    print("✅ ANONYMIZATION COMPLETE!")
    print("=" * 60)
    print("\nAll CSV files have been anonymized:")
    print("  • Agency names: RealNet → PE")
    print(f"  • Agent names: {len(agent_mapping)} agents anonymized")
    print("  • Competitor agencies: Anonymized to generic labels")
    print("\nThe files have been updated in place.")
    print("Make sure to commit these changes to your branch!")

if __name__ == "__main__":
    main()
