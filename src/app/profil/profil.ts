import { Component, OnInit , HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Routes } from '../Chemin/routes';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Sidebar } from '../components/sidebar/sidebar';


@Component({
  selector: 'app-profil',
  imports: [CommonModule , HttpClientModule , Sidebar ],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class Profil implements OnInit {

  currentUser : any = null ;
  LinkActive : string = "profil";


  constructor (private router : Router , @Inject(PLATFORM_ID) private platformId: Object , private chemin : Routes , private http : HttpClient){}

    ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
    };

  logout()
  {
    this.chemin.GoLogout()
  }

  editProfile() {
    this.chemin.GoEdit();
  }

  editPassword()
  {
    this.chemin.GoEditPassword();
  }

  home()
  {
    this.chemin.GoHome()
  }

  delete()
  {
    const personne = localStorage.getItem('currentUser') 
    if(personne)
    {
      this.http.post<any>('http://localhost:8080/user/delete', { email : this.currentUser.email }).subscribe({
      next: (response) => {
        alert('Suppression avec succés')
        this.router.navigate(['login'])
      },
      error: (error) => {
        alert('Une erreur est servenu : ' + error.error )
      }
    });
    }else
    {
      alert('Impossible de supprimer votre compte merci de réssayer plus tard')
      this.router.navigate(['profil'])
    }
  }

}
