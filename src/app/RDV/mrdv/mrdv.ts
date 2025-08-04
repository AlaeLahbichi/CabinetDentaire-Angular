import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes } from '../../Chemin/routes';

@Component({
  selector: 'app-mrdv',
  imports: [Sidebar , HttpClientModule , CommonModule , ],
  templateUrl: './mrdv.html',
  styleUrl: './mrdv.css'
})
export class MRDV {

  currentUser: any = null;
  reservations: any = [];
  total_user: number = 0 ; 
  LinkActive : string = "MRDV";

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router : Router , private http : HttpClient , private chemin : Routes , private cdr : ChangeDetectorRef) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
        this.fetchReservations(this.currentUser.id);
      }
    }
  };

  fetchReservations(userId: number): void {
  this.http.post<any>('http://localhost:8080/reservation/getspecific', { id: userId }).subscribe({
    next: (response) => {
      this.reservations = response.reservations;
      this.cdr.detectChanges();
    },
    error: (error) => {
      alert(error.error);
    }
  });
}

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  today = new Date();

  get todayDateString(): string {
    return this.today.toISOString().split('T')[0];
  };

  get TotalRDV(): number {
    return this.reservations.length ; 
  };

  get attente(): number {
    return this.reservations ? this.reservations.filter((a:any)=> a.status === 'pending').length : 0;
  };

  get confirmed(): number {
    return this.reservations ? this.reservations.filter( (a:any) => a.status === 'reserved').length : 0;
  };

  get todayAppointmentsCount(): number {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.reservations ? this.reservations.filter((a:any)=> a.localDate === todayStr && a.status == 'reserved').length : 0;
  };


}
