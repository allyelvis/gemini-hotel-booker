import { Injectable, signal } from '@angular/core';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private hotels: Hotel[] = [
    {
      id: 1,
      name: 'The Azure Palace',
      location: 'Paris, France',
      pricePerNight: 350,
      rating: 4.8,
      imageUrl: 'https://picsum.photos/seed/hotel1/800/600',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant']
    },
    {
      id: 2,
      name: 'Serenity Cove Resort',
      location: 'Maldives',
      pricePerNight: 750,
      rating: 4.9,
      imageUrl: 'https://picsum.photos/seed/hotel2/800/600',
      amenities: ['Private Beach', 'Overwater Bungalows', 'Spa', 'Dive Center']
    },
    {
      id: 3,
      name: 'Metropolis Grand',
      location: 'New York, USA',
      pricePerNight: 450,
      rating: 4.7,
      imageUrl: 'https://picsum.photos/seed/hotel3/800/600',
      amenities: ['Rooftop Bar', 'Gym', 'Concierge', 'City View']
    },
    {
      id: 4,
      name: 'Kyoto Heritage Inn',
      location: 'Kyoto, Japan',
      pricePerNight: 280,
      rating: 4.9,
      imageUrl: 'https://picsum.photos/seed/hotel4/800/600',
      amenities: ['Onsen', 'Traditional Garden', 'Tea Ceremony', 'Free WiFi']
    },
    {
      id: 5,
      name: 'Alpine Vista Lodge',
      location: 'Swiss Alps, Switzerland',
      pricePerNight: 420,
      rating: 4.8,
      imageUrl: 'https://picsum.photos/seed/hotel5/800/600',
      amenities: ['Ski-in/Ski-out', 'Sauna', 'Fireplace', 'Mountain View']
    },
    {
      id: 6,
      name: 'Oasis Mirage',
      location: 'Dubai, UAE',
      pricePerNight: 600,
      rating: 4.9,
      imageUrl: 'https://picsum.photos/seed/hotel6/800/600',
      amenities: ['Infinity Pool', 'Luxury Spa', 'Butler Service', 'Desert Safari']
    },
    {
      id: 7,
      name: 'The Roman Pantheon Hotel',
      location: 'Rome, Italy',
      pricePerNight: 380,
      rating: 4.6,
      imageUrl: 'https://picsum.photos/seed/hotel7/800/600',
      amenities: ['Rooftop Terrace', 'Colosseum Views', 'Espresso Bar', 'Free WiFi']
    },
  ];

  getHotels() {
    return signal(this.hotels);
  }

  getHotelById(id: number) {
    return this.hotels.find(h => h.id === id);
  }
}