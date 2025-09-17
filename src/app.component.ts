import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { Hotel } from './models/hotel.model';
import { HotelService } from './services/hotel.service';
import { GeminiService } from './services/gemini.service';

type AppView = 'list' | 'detail' | 'booking' | 'paypal' | 'payment' | 'confirmation';
type PayPalStep = 'login' | 'confirm';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isPast: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgOptimizedImage],
})
export class AppComponent {
  private hotelService = inject(HotelService);
  private geminiService = inject(GeminiService);

  // State Signals
  view = signal<AppView>('list');
  hotels = this.hotelService.getHotels();
  selectedHotel = signal<Hotel | undefined>(undefined);
  searchQuery = signal<string>('');

  // Gemini-powered Content Signals
  geminiDescription = signal<string>('');
  isDescriptionLoading = signal<boolean>(false);
  geminiActivities = signal<string[]>([]);
  isActivitiesLoading = signal<boolean>(false);
  
  // Booking State Signals
  bookingGuests = signal<number>(2);
  paymentProcessingMessage = signal<string>('');
  payPalStep = signal<PayPalStep>('login');
  
  // Calendar State Signals
  calendarDate = signal(new Date()); // The month being displayed
  checkInDate = signal<Date | null>(null);
  checkOutDate = signal<Date | null>(null);

  // Computed Signals
  filteredHotels = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.hotels();
    }
    return this.hotels().filter(hotel => 
      hotel.name.toLowerCase().includes(query) || 
      hotel.location.toLowerCase().includes(query)
    );
  });

  bookingNights = computed(() => {
    const start = this.checkInDate();
    const end = this.checkOutDate();
    if (!start || !end) {
      return 0;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  });

  totalCost = computed(() => {
    const hotel = this.selectedHotel();
    if (!hotel) return 0;
    return hotel.pricePerNight * this.bookingNights();
  });

  calendarDays = computed(() => {
    const currentDate = this.calendarDate();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add days from previous month for padding
    const startDayOfWeek = firstDayOfMonth.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
        const date = new Date(year, month, i - startDayOfWeek + 1);
        days.push({ 
            date, 
            dayOfMonth: date.getDate(), 
            isCurrentMonth: false, 
            isPast: true // Always treat padding days as past
        });
    }

    // Add days of the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const date = new Date(year, month, day);
        days.push({ 
            date, 
            dayOfMonth: day, 
            isCurrentMonth: true, 
            isPast: date < today 
        });
    }
    
    // Add days from next month for padding
    const endDayOfWeek = lastDayOfMonth.getDay();
    if (endDayOfWeek < 6) {
        for (let i = 1; i <= 6 - endDayOfWeek; i++) {
            const date = new Date(year, month + 1, i);
            days.push({ 
                date, 
                dayOfMonth: i, 
                isCurrentMonth: false, 
                isPast: true // Always treat padding days as past
            });
        }
    }

    return days;
  });
  
  // View Selectors
  selectHotel(hotelId: number): void {
    const hotel = this.hotelService.getHotelById(hotelId);
    if (hotel) {
      this.selectedHotel.set(hotel);
      this.view.set('detail');
      this.fetchGeminiContent(hotel.name, hotel.location);
    }
  }
  
  goBackToList(): void {
    this.selectedHotel.set(undefined);
    this.geminiDescription.set('');
    this.geminiActivities.set([]);
    this.view.set('list');
  }

  goToBooking(): void {
    this.checkInDate.set(null);
    this.checkOutDate.set(null);
    this.bookingGuests.set(2);
    this.view.set('booking');
  }

  goBackToBooking(): void {
    this.view.set('booking');
  }
  
  // Input Actions
  updateSearchQuery(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
  
  updateGuests(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.bookingGuests.set(Number(value));
  }
  
  // Calendar Actions
  selectDate(day: CalendarDay): void {
    if (day.isPast) return;
    const selectedDate = day.date;
    
    const checkIn = this.checkInDate();
    const checkOut = this.checkOutDate();

    if (!checkIn || (checkIn && checkOut)) {
      this.checkInDate.set(selectedDate);
      this.checkOutDate.set(null);
    } else if (checkIn && !checkOut) {
      if (selectedDate > checkIn) {
        this.checkOutDate.set(selectedDate);
      } else {
        // If they select a date before the check-in, start over
        this.checkInDate.set(selectedDate);
        this.checkOutDate.set(null);
      }
    }
  }

  previousMonth(): void {
    this.calendarDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(d.getMonth() - 1);
      return newDate;
    });
  }

  nextMonth(): void {
    this.calendarDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(d.getMonth() + 1);
      return newDate;
    });
  }
  
  // Calendar state helpers for styling
  isCheckIn(date: Date): boolean {
    const checkIn = this.checkInDate();
    return !!checkIn && date.getTime() === checkIn.getTime();
  }

  isCheckOut(date: Date): boolean {
    const checkOut = this.checkOutDate();
    return !!checkOut && date.getTime() === checkOut.getTime();
  }

  isInRange(date: Date): boolean {
    const checkIn = this.checkInDate();
    const checkOut = this.checkOutDate();
    return !!checkIn && !!checkOut && date > checkIn && date < checkOut;
  }

  // Payment Flow Actions
  startPaymentProcess(): void {
    this.payPalStep.set('login');
    this.view.set('paypal');
  }

  simulatePayPalLogin(): void {
    this.payPalStep.set('confirm');
  }

  confirmPayPalPayment(): void {
    this.view.set('payment');
    const messages = [
      'Connecting to PayPal secure server...',
      'Authorizing payment...',
      'Finalizing your booking...',
      'Success! Your room is booked.'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        this.paymentProcessingMessage.set(messages[i]);
        i++;
      } else {
        clearInterval(interval);
        this.view.set('confirmation');
      }
    }, 1500);
  }

  startNewBooking(): void {
    this.goBackToList(); // Resets all state and returns to the list view
  }

  // Private helpers
  private fetchGeminiContent(hotelName: string, location: string): void {
    this.isDescriptionLoading.set(true);
    this.isActivitiesLoading.set(true);
    this.geminiDescription.set('');
    this.geminiActivities.set([]);

    this.geminiService.generateHotelDescription(hotelName, location)
      .then(desc => this.geminiDescription.set(desc))
      .finally(() => this.isDescriptionLoading.set(false));
      
    this.geminiService.generateLocalActivities(hotelName, location)
      .then(activities => this.geminiActivities.set(activities))
      .finally(() => this.isActivitiesLoading.set(false));
  }
}