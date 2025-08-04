import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '../../Chemin/routes';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  isSidebarOpen = false;
  currentUser : any = null ; 

  @Input() animation!: string;

  constructor(private router : Router , private chemin : Routes ,  @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
  }

  Home()
  {
    this.chemin.GoHome();
  }

  LogOut()
  {
    this.chemin.GoLogout();
  }

  Profil()
  {
    this.chemin.GoProfil();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (window.innerWidth <= 768 && sidebar && menuBtn) {
      const clickedInsideSidebar = sidebar.contains(event.target as Node);
      const clickedMenuBtn = menuBtn.contains(event.target as Node);

      if (!clickedInsideSidebar && !clickedMenuBtn && this.isSidebarOpen) {
        this.isSidebarOpen = false;
      }
    }
  }

}
