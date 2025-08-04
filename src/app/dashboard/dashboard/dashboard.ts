import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes } from '../../Chemin/routes';



@Component({
  selector: 'app-appointments',
  imports: [CommonModule , Sidebar , ReactiveFormsModule , FormsModule  ,  HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {
  currentUser: any = null;
  reservations: any = [];
  total_user: number = 0 ; 
  LinkActive : string = "RDV";

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router : Router , private http : HttpClient , private chemin : Routes) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
    this.http.get<any>('http://localhost:8080/reservation/getall').subscribe({
      next: (response) => {
        this.reservations = response.reservations
      },
      error: (error) => {
        alert(error.error)
    }
    });
    this.http.get<any>('http://localhost:8080/user/total').subscribe({
      next : (response) => {
        this.total_user = response.total
      },
      error : (error) => {
        alert(error.error)
      }
    });
  }

  Cancel_Reservation(id:number)
  {
    this.http.post<any>('http://localhost:8080/reservation/cancel',{"id":id}).subscribe({
      next : (response) => {
        alert('La réservation numéro ' + id + ' a été annulée avec succés')
        location.reload()
      },
      error : (error) => {
        alert(error.error)
      }
    })
  };

  Finaliser_Reservation(id:number)
  {
    this.http.post<any>('http://localhost:8080/reservation/finaliser',{"id":id}).subscribe({
      next : (response) => {
        alert('La réservation numéro ' + id + ' a été finalisée avec succés')
        location.reload()
      },
      error : (error) => {
        alert(error.error)
      }
    })
  };
  
  Confirm_Reservation(id:number)
  {
    this.http.post<any>('http://localhost:8080/reservation/confirmer',{"id":id}).subscribe({
      next : (response) => {
        alert('La réservation numéro ' + id + ' a été confirmée avec succés')
        location.reload()
      },
      error : (error) => {
        alert(error.error)
      }
    })
  };

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  today = new Date();

  get todayDateString(): string {
    return this.today.toISOString().split('T')[0];
  };

  get countTodayConfirmed(): number {
    let x : number =  this.reservations.filter( (a:any)=> a.status == "reserved").length;
    return x ;
  };

  get caceled(): number {
    return this.reservations ? this.reservations.filter((a:any)=> a.status === 'canceled').length : 0;
  };

  get passed(): number {
    return this.reservations ? this.reservations.filter( (a:any) => a.status === 'passed').length : 0;
  };

  get todayAppointmentsCount(): number {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.reservations ? this.reservations.filter((a:any)=> a.localDate === todayStr && a.status == 'reserved').length : 0;
  };

}
