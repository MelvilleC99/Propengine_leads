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


/**
 * Load property inventory data from CSV file
 */
export async function loadPropertyData(): Promise<Array<Record<string, unknown>>> {
  return new Promise((resolve, reject) => {
    Papa.parse('/Leon_cleaned.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Parse the data and convert dates
        const data = results.data.map((row: Record<string, unknown>) => {
          // Parse price - remove "R " and spaces, then convert to number
          const priceStr = row.Price?.replace(/R\s*/g, '').replace(/\s/g, '') || '0';
          const price = parseInt(priceStr, 10);

          // Parse dates
          const listingDate = row['Listing Date'] ? new Date(row['Listing Date']) : new Date();
          const offerDate = row['Offer Date'] ? new Date(row['Offer Date']) : null;

          return {
            price,
            location: row.Location || '',
            propertyType: row['Property Type'] || '',
            status: row.Status || '',
            agency: row.Agency || '',
            agentName: row['Agent Name'] || '',
            listingDate,
            offerDate,
          };
        });
        
        resolve(data);
      },
      error: (error) => {
        console.error('Error loading property data:', error);
        reject(error);
      }
    });
  });
}
