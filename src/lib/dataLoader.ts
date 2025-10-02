// Shared CSV data loader utility
import Papa from 'papaparse';
import type { SalesRecord, LeadRecord } from '@/types/data';

/**
 * Load sales data from CSV file
 */
export async function loadSalesData(): Promise<SalesRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse('/realnet_sales_with_lead_source.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Convert string 'False'/'True' to boolean
        const data = results.data.map((row: unknown) => ({
          ...(row as Record<string, unknown>),
          data_error: (row as Record<string, unknown>).data_error === 'True' || (row as Record<string, unknown>).data_error === true,
          has_lead_source: (row as Record<string, unknown>).has_lead_source === 'True' || (row as Record<string, unknown>).has_lead_source === true,
          has_web_reference: (row as Record<string, unknown>).has_web_reference === 'True' || (row as Record<string, unknown>).has_web_reference === true,
        })) as SalesRecord[];
        
        resolve(data);
      },
      error: (error) => {
        console.error('Error loading sales data:', error);
        reject(error);
      }
    });
  });
}

/**
 * Load leads data from CSV file
 */
export async function loadLeadsData(): Promise<LeadRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse('/sales_rental_sudonum.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as LeadRecord[]);
      },
      error: (error) => {
        console.error('Error loading leads data:', error);
        reject(error);
      }
    });
  });
}
