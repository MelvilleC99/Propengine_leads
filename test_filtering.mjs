// Debug script to test agency filtering

import Papa from 'papaparse';
import { filterLeadsByAgencies } from './src/lib/sales-dashboard/calculations';
import type { LeadRecord } from './src/types/data';
import fs from 'fs';

async function testFiltering() {
  console.log('Testing agency filtering...\n');
  
  // Load the CSV
  const csvContent = fs.readFileSync('./public/sales_rental_sudonum.csv', 'utf-8');
  
  const parseResult = await new Promise<LeadRecord[]>((resolve) => {
    Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as LeadRecord[]);
      }
    });
  });
  
  console.log(`Total leads loaded: ${parseResult.length}`);
  
  // Check unique franchises
  const franchises = new Set(parseResult.map(l => l.Franchise));
  console.log(`\nUnique franchises: ${franchises.size}`);
  console.log('Sample franchises:');
  Array.from(franchises).slice(0, 10).forEach(f => console.log(`  - ${f}`));
  
  // Test filtering by PE Bloemfontein
  const testAgency = 'PE Bloemfontein';
  const filtered = filterLeadsByAgencies(parseResult, [testAgency]);
  
  console.log(`\nFiltering by "${testAgency}":`);
  console.log(`  Leads found: ${filtered.length}`);
  
  // Show sample
  if (filtered.length > 0) {
    console.log('\n  Sample filtered leads:');
    filtered.slice(0, 3).forEach((lead, idx) => {
      console.log(`    ${idx + 1}. Franchise: ${lead.Franchise}, Status: ${lead.Status}, Type: ${lead.lead_type}`);
    });
  }
  
  // Count sales vs rentals
  const salesLeads = filtered.filter(l => l.lead_type === 'Sales');
  const rentalLeads = filtered.filter(l => l.lead_type === 'Rental');
  console.log(`\n  Sales leads: ${salesLeads.length}`);
  console.log(`  Rental leads: ${rentalLeads.length}`);
  
  // Count statuses
  const statuses = {};
  filtered.forEach(lead => {
    statuses[lead.Status] = (statuses[lead.Status] || 0) + 1;
  });
  console.log('\n  Status breakdown:');
  Object.entries(statuses).forEach(([status, count]) => {
    console.log(`    ${status}: ${count}`);
  });
}

testFiltering().catch(console.error);
