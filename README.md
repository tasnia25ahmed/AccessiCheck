<div align="center"> <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /> </div>
AccessiCheck - AI Accessibility Scanner

AccessiCheck is an AI-powered tool that analyzes PDFs, images, and HTML content for accessibility compliance according to AODA (Accessibility for Ontarians with Disabilities Act) and WCAG 2.1 AA standards.

It not only identifies accessibility issues but also provides:

A fixed, accessible HTML version

A simplified plain-language version

An audio narration of the content

This project is ideal for improving accessibility in digital content quickly, using AI to save time during audits or hackathons.

Tech Stack

Frontend: React (TypeScript)

Styling: Tailwind CSS

Charts: Recharts

Icons: Lucide React

Markdown rendering: React Markdown

AI Backend: Google Gemini API (for content analysis, fixes, and TTS)

Bundler/Dev Server: Vite

Run Locally

Prerequisites: Node.js

Install dependencies:

npm install


Set your Gemini API key:

Create a .env.local file in the root:

GEMINI_API_KEY=your_gemini_api_key_here


Run the app:

npm run dev


Open your browser at http://localhost:3000.

Features

Upload PDFs, images, or HTML for accessibility scanning

Get detailed issue reports with severity levels

Download fixed HTML for immediate use

View simplified, plain-language content

Listen to the audio narration of the document

Notes

This is a hackathon-ready project with minimal setup.

Do not commit your Gemini API key.

Works best in modern browsers (Chrome, Edge, Firefox)
