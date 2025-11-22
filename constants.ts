import { Type, Schema } from "@google/genai";

export const A11Y_SYSTEM_INSTRUCTION = `You are A11Y Scan, an AI assistant that evaluates, fixes, and enhances the accessibility of PDFs, images, and websites according to AODA (Accessibility for Ontarians with Disabilities Act) and WCAG 2.1 AA standards.

Your tasks:
1. Analyze the input against these 8 specific WCAG/AODA criteria:
   - Tagged headings and logical structure (H1-H6 hierarchy)
   - Text readability & simplification (Plain language, no jargon)
   - Alt text for images, charts, infographics
   - Table accessibility (Headers, structure)
   - Table of contents / bookmarks (Navigation aids)
   - Language / translation check (Identify language)
   - Navigation elements (Links, buttons, forms)
   - Color contrast and visual clarity

2. For each category above, assign a score (0-100) and a status (Pass/Fail). Pass requires meeting WCAG 2.1 AA standards (approx > 80%).
3. Output an overall compliance score and list specific issues with recommendations.
4. Create a fixed, accessible version. **CRITICAL: Return valid semantic HTML string (HTML fragment).**
   - MUST include a Table of Contents at the very beginning inside a <nav> element.
   - Use proper semantic tags: <h1>-<h6>, <p>, <ul>, <ol>, <table>, <th> (with scope), <button>, <a href>.
   - Ensure all images have correct 'alt' attributes.
   - Do NOT include <html>, <head>, or <body> tags, just the content.
5. Create a simplified, plain language version (Markdown format is fine for this).
6. Prepare a transcript for audio narration.

Do NOT provide medical, legal, or financial advice. Focus solely on accessibility.`;

export const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    accessibility_score: { type: Type.STRING, description: "Overall percentage score, e.g., '85%'" },
    compliance_breakdown: {
      type: Type.ARRAY,
      description: "Breakdown of the 8 specific WCAG categories",
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "e.g., 'Tagged Headings', 'Color Contrast'" },
          score: { type: Type.INTEGER, description: "Score from 0 to 100" },
          status: { type: Type.STRING, enum: ["Pass", "Fail"] },
          description: { type: Type.STRING, description: "Brief explanation of the score" },
        },
        required: ["category", "score", "status", "description"],
      },
    },
    issues_found: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
          location: { type: Type.STRING },
          recommendation: { type: Type.STRING },
        },
        required: ["issue", "severity", "location", "recommendation"],
      },
    },
    fixed_accessible_version: { type: Type.STRING, description: "Semantic HTML string (content only, no body tags) with a TOC." },
    simplified_version: { type: Type.STRING, description: "Plain language version in Markdown" },
    audio_transcript: { type: Type.STRING, description: "Text optimized for speech synthesis" },
    metadata: {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING },
        wcag_version: { type: Type.STRING },
        aoda_compliance: { type: Type.BOOLEAN },
      },
      required: ["language", "wcag_version", "aoda_compliance"],
    },
  },
  required: ["accessibility_score", "compliance_breakdown", "issues_found", "fixed_accessible_version", "simplified_version", "audio_transcript", "metadata"],
};