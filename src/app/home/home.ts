import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../components/navbar/navbar';


@Component({
  selector: 'app-home',
  imports: [CommonModule , Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  sidebarActive = false;
  currentUser : any = null

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


}
