import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '../Chemin/routes';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-edit-profil',
  imports: [CommonModule , ReactiveFormsModule , HttpClientModule],
  templateUrl: './edit-profil.html',
  styleUrl: './edit-profil.css'
})
export class EditProfil implements OnInit {

  currentUser: any = null ;
  editForm: FormGroup ;

  constructor(private router : Router , @Inject(PLATFORM_ID) private platformId: Object , private chemin : Routes , private fb : FormBuilder , private http : HttpClient){
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['',[Validators.required,Validators.minLength(2)]],
      lastName: ['',[Validators.required,Validators.minLength(2)]],
      phone:[''],
      adress:[''],
      date_naissance:['']
    });
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  
  }

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const personne = localStorage.getItem('currentUser');
    if (personne) {
      this.currentUser = JSON.parse(personne);

      this.editForm.patchValue({
        firstName: this.currentUser.firstName || '',
        lastName: this.currentUser.lastName || '',
        email: this.currentUser.email || '',
        phone: this.currentUser.phone || '',
        date_naissance: this.currentUser.date_naissance ? this.formatDate(this.currentUser.date_naissance) : '',
        adress: this.currentUser.adress || ''
      });
    }
  }
}

  onSubmit() {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      this.http.post<any>('http://localhost:8080/user/edit', formData).subscribe({
        next: (response) => {
          if(response.user)
          {
            console.log(response)
            localStorage.setItem('currentUser',JSON.stringify(response.user))
            alert("Modification avec succés")
          }else
          {
            alert("Une erreur s'est produite lors de la modification de votre compte")
          }
          this.router.navigate(['profil'])
        },
        error: (error) => {
          alert(error.error)
        }
    });
    }else
    {
      alert("Une erreur s'est produite lors de la modification de votre profil merci de résayer plus tard")
      this.router.navigate(['profil'])
    }
  }

  profil()
  {
    this.chemin.GoProfil();
  }

  

}
