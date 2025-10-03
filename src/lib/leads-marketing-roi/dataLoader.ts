// Load agency marketing spend data
import Papa from 'papaparse';
import type { AgencySpend } from './calculations';

/**
 * Load agency marketing spend allocations from CSV
 */
export async function loadAgencySpend(): Promise<AgencySpend[]> {
  return new Promise((resolve, reject) => {
    Papa.parse('/agency_marketing_spend.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as AgencySpend[]);
      },
      error: (error) => {
        console.error('Error loading agency spend data:', error);
        reject(error);
      }
    });
  });
}