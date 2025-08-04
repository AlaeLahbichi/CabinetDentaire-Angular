import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { response } from 'express';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-archive',
  imports: [Sidebar , CommonModule , HttpClientModule , FormsModule ],
  templateUrl: './archive.html',
  styleUrl: './archive.css'
})
export class Archive implements OnInit {

  LinkActive : string = "HRDV";
  reservations : any = null ; 
  searchText: string = '';
  subjectFilter: string = 'Not Defined';
  statusFilter: string = 'Not Defined';
  originalReservations: any[] = [];

  constructor(private http : HttpClient , private cdr : ChangeDetectorRef){}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8080/reservation/archive').subscribe({
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
