/**
 * @fileoverview Defines the data models for Destination and Package in Firestore.
 */

export interface Destination {
  name: string;
  description: string;
  highlights: string[];
  packages: string[]; // Array of packageIDs
}

export interface Package {
  destination: string; // ID of the parent destination
  title: string;
  priceUSD: number;
  priceEAC?: number; // Price for East African Citizens
  inclusions: string[];
  duration: string;
}
