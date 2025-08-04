import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  sidebarActive = false;
  currentUser : any = null ; 

  constructor(private router : Router , @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  closeSidebar() {
    this.sidebarActive = false;
  }

  logout()
  {
    if ( localStorage.getItem('currentUser') )
    {
      localStorage.removeItem('currentUser')
      this.router.navigate(['login'])
    }
  }

  profil()
  {
    if (localStorage.getItem('currentUser'))
    {
      this.router.navigate(['profil'])
    }
  }

}
