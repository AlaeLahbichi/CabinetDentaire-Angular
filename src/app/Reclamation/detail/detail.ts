import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Routes } from '../../Chemin/routes';

@Component({
  selector: 'app-detail',
  imports: [CommonModule , HttpClientModule ],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {

  id !: number ;
  reclamation : any = null ; 

  constructor(private route : ActivatedRoute , private http : HttpClient , private chemin : Routes , private cdr : ChangeDetectorRef){}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.post<any>('http://localhost:8080/reclamation/get',{"id" : this.id }).subscribe({
      next : (response) => {
        this.reclamation = response.reclamation
        this.cdr.detectChanges(); 
      },
      error : (error) => {
        alert("Une erreur s'est produite")
        console.log(error.error)
      },
    });
  };

  private padZero(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  formatDate(dateInput: Date | string): string {
    const date = new Date(dateInput); 
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); 
    const year = date.getFullYear();
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  Retour()
  {
    this.chemin.GoReclamationList()
  }
  
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


}
