import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-membres',
  imports: [Sidebar , CommonModule , HttpClientModule , FormsModule ],
  templateUrl: './membres.html',
  styleUrl: './membres.css'
})
export class Membres implements OnInit {

  constructor(private http : HttpClient , private cdr : ChangeDetectorRef){}

  LinkActive : string = "membres"  ;
  Users : any = null ; 
  filteredUsers: any[] = [];   
  searchText: string = '';
  selectedRole: string = 'Not Defined';

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8080/user/getallspecific').subscribe({
      next : (response) => {
        this.Users = response.users
        this.filteredUsers = [...this.Users];
        this.cdr.detectChanges(); 
      },
      error : (error) => {
        console.log("Une erreur s'est survenue merci de réssayer une nouvelle fois")
      },
    });
  };

  Activer(id : number )
  {
    this.http.post<any>('http://localhost:8080/user/activer',{"id" : id }).subscribe({
      next : (response) => {
        alert("Utilisateur d'id " + id + " a été activé avec succés");
        location.reload();
      },
      error : (error) => {
        alert("Une erreur a été déclenchée merci de réssayer encore une fois");
      },
    });
  };

  Delete(email : String)
  {
    this.http.post<any>('http://localhost:8080/user/delete',{"email" : email }).subscribe({
      next : (response) => {
        alert("Utilisateur d'email " + email + " a été supprimé avec succés");
        location.reload();
      },
      error : (error) => {
        alert("Une erreur a été déclenchée merci de réssayer encore une fois");
      },
    });
  };

  filterUsers() {
    const search = this.searchText.toLowerCase().trim();
    this.filteredUsers = this.Users.filter((user:any) => {
      const nameMatch =
        user.firstName?.toLowerCase().includes(search) ||
        user.lastName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search);

      const roleMatch =
        this.selectedRole === 'Not Defined' || user.role === this.selectedRole;

      return nameMatch && roleMatch;
    });
  };

  clearFilters() {
    this.searchText = '';
    this.selectedRole = 'Not Defined';
    this.filteredUsers = [...this.Users];
  };

  get TotalUser():number
  {
    return this.Users ? this.Users.length : 0 ; 
  }

  get ActifUser():number
  {
    return this.Users ? this.Users.filter((user:any)=>user.status == true).length : 0 ; 
  }

  get InActifUser():number
  {
    return this.Users ? this.Users.filter((user:any)=>user.status == false).length : 0 ; 
  }

  get PatientUser():number
  {
    return this.Users ? this.Users.filter((user:any)=>user.role == "Patient").length : 0 ; 
  }
}
