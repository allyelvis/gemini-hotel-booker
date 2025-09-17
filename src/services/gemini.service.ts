
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateHotelDescription(hotelName: string, location: string): Promise<string> {
    const prompt = `Create a captivating, one-paragraph hotel description for "${hotelName}" in ${location}. Highlight its unique charm, luxury, and key features. Make it sound appealing for a traveler looking for a memorable stay.`;
    
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error generating content:', error);
      return 'Could not generate a description at this time. Please try again later.';
    }
  }

   async generateLocalActivities(hotelName: string, location: string): Promise<string[]> {
    const prompt = `List three unique and interesting local activities or attractions near a hotel like "${hotelName}" in ${location}. For each, provide a short, enticing one-sentence description. Format the response as a numbered list.`;
    
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.6,
        }
      });
      
      return response.text.split('\n').filter(line => line.trim().length > 0 && /^\d+\./.test(line.trim()));
    } catch (error) {
      console.error('Error generating activities:', error);
      return ['Could not fetch local activities at this time.'];
    }
  }
}
