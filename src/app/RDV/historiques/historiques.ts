import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-historiques',
  imports: [FormsModule , CommonModule , HttpClientModule , Sidebar ],
  templateUrl: './historiques.html',
  styleUrl: './historiques.css'
})
export class Historiques {

  LinkActive : string = "HMRDV";
  reservations : any = null ; 
  searchText: string = '';
  subjectFilter: string = 'Not Defined';
  statusFilter: string = 'Not Defined';
  originalReservations: any[] = [];
  currentUser : any = null ;

  constructor(private http : HttpClient , private cdr : ChangeDetectorRef , @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
        this.cdr.detectChanges();
      }
    }
    this.http.post<any>('http://localhost:8080/reservation/historique',{"id" : this.currentUser?.id}).subscribe({
      next : (response) => {
        this.reservations = response;
        this.originalReservations = response ; 
        this.cdr.detectChanges();
      },
      error : (error) => {
        console.error("Une erreur est servenue merci de réssayer plus tard");
      },
    });
  };

applyFilters() {
  const search = this.searchText.toLowerCase();

  this.reservations = this.originalReservations.filter(res => {
    const matchesSearch =
      res.id.toString().includes(search) ||
      (res.user?.firstName?.toLowerCase().includes(search) || '') ||
      (res.user?.lastName?.toLowerCase().includes(search) || '');

    const matchesSubject = this.subjectFilter && this.subjectFilter !== 'Not Defined'
      ? res.typeVisite === this.subjectFilter
      : true;

    const matchesStatus = this.statusFilter && this.statusFilter !== 'Not Defined'
      ? res.status === this.statusFilter
      : true;

    return matchesSearch && matchesSubject && matchesStatus;
  });

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.style.display = this.reservations.length === 0 ? 'block' : 'none';
  }
}



  resetFilters() {
  this.searchText = '';
  this.subjectFilter = 'Not Defined';
  this.statusFilter = 'Not Defined';
  this.reservations = [...this.originalReservations];

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.style.display = 'none';
  }
  }


}
