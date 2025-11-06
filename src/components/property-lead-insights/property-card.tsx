"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MapPin, Eye, Calendar } from "lucide-react";
import { fetchPropertyDetails } from "@/lib/property-lead-insights/api";
import type { PropertyDetails } from "@/lib/property-lead-insights/types";

interface PropertyCardProps {
  property: {
    id: number;
    propertyName: string;
    reference: string;
    suburb: string;
    price: number;
    totalEnquiries: number;
    uniqueLeads: number;
    lastEnquired: string;
    hasOffer: boolean;
    agency: string;
    agent: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
  };
  filters: {
    dateRange: string;
    agency?: string;
    agent?: string;
  };
}

export function PropertyCard({ property, filters }: PropertyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [details, setDetails] = useState<PropertyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExpand = async () => {
    if (!isExpanded && !details) {
      // Fetch details when expanding for the first time
      setIsLoading(true);
      try {
        const propertyDetails = await fetchPropertyDetails(property.id, filters);
        setDetails(propertyDetails);
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Main Property Info */}
        <div 
          className="flex items-start justify-between cursor-pointer"
          onClick={handleExpand}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {property.propertyName || property.reference || "No Reference"}
              </h3>
              {property.hasOffer && (
                <Badge variant="default" className="bg-green-600">
                  Offer
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{property.suburb}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">{formatCurrency(property.price)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="h-4 w-4" />
                <span>{property.totalEnquiries} enquiries</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Last: {formatDate(property.lastEnquired)}</span>
              </div>
            </div>
          </div>

          <button className="ml-4 text-gray-400 hover:text-gray-600">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading details...</p>
              </div>
            ) : details ? (
              <>
                {/* Property Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Property Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Agency:</span>
                      <span className="ml-2 font-medium">{property.agency}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Agent:</span>
                      <span className="ml-2 font-medium">{property.agent}</span>
                    </div>
                    {property.propertyType && (
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium">{property.propertyType}</span>
                      </div>
                    )}
                    {property.bedrooms && property.bedrooms > 0 && (
                      <div>
                        <span className="text-gray-600">Bedrooms:</span>
                        <span className="ml-2 font-medium">{property.bedrooms}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Engagement Overview */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Engagement Overview</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{details.uniqueLeads}</div>
                      <div className="text-gray-600 text-xs">Unique Leads</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{details.totalEnquiries}</div>
                      <div className="text-gray-600 text-xs">Total Enquiries</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-xs font-semibold text-purple-600">
                        {formatDate(details.firstEnquired)}
                      </div>
                      <div className="text-gray-600 text-xs">First Enquired</div>
                    </div>
                  </div>
                </div>

                {/* Source Breakdown */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Source Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Property24</span>
                      <span className="font-medium">{details.sourceBreakdown.property24}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Private Property</span>
                      <span className="font-medium">{details.sourceBreakdown.privateProperty}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Website</span>
                      <span className="font-medium">{details.sourceBreakdown.website}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Other</span>
                      <span className="font-medium">{details.sourceBreakdown.other}</span>
                    </div>
                  </div>
                </div>

                {/* Top Leads */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Top Interested Leads</h4>
                  {details.topLeads.length > 0 ? (
                    <div className="space-y-3">
                      {details.topLeads.map((lead) => (
                        <div key={lead.id} className="p-3 bg-gray-50 rounded text-sm">
                          <div className="font-medium text-gray-900 mb-2">{lead.name}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>Enquired about this: {lead.timesEnquired}x</div>
                            <div>Total enquired: {lead.totalProperties}</div>
                            <div>Budget: {lead.budgetRange}</div>
                            <div>Last: {formatDate(lead.lastActive)}</div>
                          </div>
                          {lead.suburbs.length > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              Also enquiring about: {lead.suburbs.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No lead details available</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center">Unable to load details</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
