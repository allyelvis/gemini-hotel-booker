# Gemini Hotel Booker

A modern hotel booking application that uses the Google Gemini API to provide rich, AI-generated hotel descriptions and local recommendations. This project showcases a seamless user experience from hotel discovery to a simulated booking and payment confirmation.

## ✨ Features

-   **Dynamic Hotel Listings**: Browse and search a curated list of hotels.
-   **AI-Powered Content**: Utilizes the Gemini API to generate captivating hotel descriptions and unique local activity suggestions for each hotel.
-   **Interactive Calendar**: A user-friendly calendar component for easy selection of check-in and check-out dates.
-   **Detailed Views**: View comprehensive details for each hotel, including ratings, amenities, and AI-generated content.
-   **Realistic Booking Flow**: An intuitive, multi-step booking process.
-   **Simulated PayPal Payment**: An enhanced, multi-step PayPal modal that simulates a realistic login and payment confirmation flow.
-   **Responsive Design**: A clean and modern UI built with Tailwind CSS, fully responsive for desktop and mobile devices.
-   **Performant Architecture**: Built with modern Angular using standalone components and zoneless change detection for optimal performance.

## 🛠️ Tech Stack

-   **Frontend**: [Angular](https://angular.dev/) (v20+)
    -   Standalone Components & Zoneless Change Detection
    -   Signals for State Management
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google Gemini API](https://ai.google.dev/) via `@google/genai`
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

This application is designed to run in an environment where the Google Gemini API key is securely managed.

### Prerequisites

You must have a Google Gemini API key.

### Configuration

The application requires the Gemini API key to be available as an environment variable named `API_KEY`. The `GeminiService` (`src/services/gemini.service.ts`) is configured to read this key directly from `process.env.API_KEY`.

```typescript
// From src/services/gemini.service.ts
constructor() {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}
```

Ensure this environment variable is set in your deployment or development environment before running the application.
