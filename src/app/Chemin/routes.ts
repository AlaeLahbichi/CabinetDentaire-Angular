import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Routes {

  personne: any = null;

  constructor(private router: Router , @Inject(PLATFORM_ID) private platformId: Object) {

    if (isPlatformBrowser(this.platformId)) {
      this.personne = localStorage.getItem('currentUser');
    }
  }

  GoHome() {
    if (this.personne) {
      this.router.navigate(['home']);
    }
  }

  GoProfil() {
    if (this.personne) {
      this.router.navigate(['profil']);
    }
  }

  GoLogout()
  {
    if(this.personne)
    {
      localStorage.removeItem('currentUser')
      this.router.navigate(['login'])
    }
  }

  GoEdit()
  {
    if(this.personne)
    {
      this.router.navigate(['editprofil']);
    }
  }

  GoEditPassword()
  {
    if(this.personne)
    {
      this.router.navigate(['editpassword'])
    }
  }

  GoReclamationList()
  {
    window.location.href = '/reclamation';
  }

}
