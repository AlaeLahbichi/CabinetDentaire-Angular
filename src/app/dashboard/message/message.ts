import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  imports: [CommonModule , Sidebar , HttpClientModule , FormsModule ],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Message implements OnInit {

  LinkActive : string = "reclamations" ; 
  reclamations : any = [] ; 
  currentUser : any = null ; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http : HttpClient , private router : Router) {}

  private padZero(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
    this.http.get<any>('http://localhost:8080/reclamation/getall').subscribe({
      next : (response) => {
        this.reclamations = response.reclamations;
      },
      error : (error) => {
        alert("Une errer s'est produite");
      }
    });
  };

  formatDate(dateInput: Date | string): string {
    const date = new Date(dateInput); 
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); 
    const year = date.getFullYear();
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  searchText: string = '';
  statusFilter: string = 'Not Defined';
  get filteredReclamations(): any[] {
    return this.reclamations.filter((r: any) => {
    const searchMatch =
      !this.searchText ||
      r.id.toString().includes(this.searchText.toLowerCase()) ||
      r.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      r.firstName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      r.lastName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      r.objet?.toLowerCase().includes(this.searchText.toLowerCase());

    const statusMatch =
      this.statusFilter === 'Not Defined' || r.status === this.statusFilter;

    return searchMatch && statusMatch;
  });
  };

  Canceled(id : number )
  {
    this.http.post<any>('http://localhost:8080/reclamation/canceled',{"id" : id }).subscribe({
      next : (response) => {
        alert("La réclamation d'id " + id + " a été annulée avec succés");
        location.reload();
      },
      error : (error) => {
        alert("Une erreur est survenue lors du traitement de cette requête");
      },
    });
  };

  Resolved(id : number )
  {
    this.http.post<any>('http://localhost:8080/reclamation/resolved',{"id" : id }).subscribe({
      next : (response) => {
        alert("La réclamation d'id " + id + " a été résolue avec succés");
        location.reload();
      },
      error : (error) => {
        alert("Une erreur est survenue lors du traitement de cette requête");
      },
    });
  };

  GetDetail(id : number )
  {
    this.router.navigate(['reclamation_detail' , id]);
  }

}
