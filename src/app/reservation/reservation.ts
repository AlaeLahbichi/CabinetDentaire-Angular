import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Routes } from '../Chemin/routes';
import { Navbar } from '../components/navbar/navbar';

@Component({
  selector: 'app-reservation',
  imports: [HttpClientModule , ReactiveFormsModule , CommonModule , Navbar ] , 
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css']
})
export class Reservation implements OnInit {

  reservationForm: FormGroup;
  sidebarOpen = false;
  confirmationVisible = false;
  currentUser: any = null ; 

  minDate: string = new Date().toISOString().split('T')[0];

  timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30','12:00','12:30','13:00','13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  unavailableTimes: string[] = ['12:00', '13:00' , '12:30'];
  selectedTime: string | null = null;

  constructor(private fb: FormBuilder , private http : HttpClient , @Inject(PLATFORM_ID) private platformId: Object , private chemin : Routes ) {
    this.reservationForm = this.fb.group({
      patientName: ['', Validators.required],
      patientPhone: ['', Validators.required],
      patientEmail: ['', [Validators.required, Validators.email]],
      visitType: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      consultationReason: ['']
    });
  }

  ngOnInit() {
    this.updateUnavailableTimes(this.minDate);
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
    if(this.currentUser)
    this.reservationForm.patchValue({
        patientName: this.currentUser.firstName + " " + this.currentUser.lastName || '',
        patientPhone: this.currentUser.lastName || '',
        patientEmail: this.currentUser.email || '',
      });
  }

  selectTimeSlot(time: string) {
    if (this.unavailableTimes.includes(time)) {
      return; 
    }
    this.selectedTime = time;
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value;
    this.http.get<string[]>(`http://localhost:8080/reservation/verify?date=${selectedDate}`)
      .subscribe((reservedTimes: string[]) => {
        this.unavailableTimes = reservedTimes;
        if (this.selectedTime && this.unavailableTimes.includes(this.selectedTime)) {
          this.selectedTime = null;
       }
      });
  }

  updateUnavailableTimes(dateStr: string) {
    this.http.get<string[]>(`http://localhost:8080/reservation/verify?date=${dateStr}`)
      .subscribe((reservedTimes: string[]) => {
        this.unavailableTimes = reservedTimes;
        if (this.selectedTime && this.unavailableTimes.includes(this.selectedTime)) {
          this.selectedTime = null;
        }
      });
  }

  onSubmit() {
    if (!this.selectedTime) {
      alert('Veuillez sélectionner un créneau horaire.');
      return;
    }
    if (this.reservationForm.valid) {
      const formData = {
        ...this.reservationForm.value,
        appointmentTime: this.selectedTime , 
        user_id : this.currentUser.id ,
      };
    this.http.post<any>('http://localhost:8080/reservation/enregistrer', formData).subscribe({
      next: (response) => {
        alert("yes")
      },
      error: (error) => {
        alert(error.error)
      }
    });
      console.log('Données envoyées:', formData);
      this.confirmationVisible = true;
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.reservationForm.reset();
    this.selectedTime = null;
    this.confirmationVisible = false;
  }
}
