/**
 * @fileoverview Defines the data model for an Email Template in Firestore.
 */

export interface EmailTemplate {
  subject: string;
  body: string; // Can contain placeholders like {{name}}
}
