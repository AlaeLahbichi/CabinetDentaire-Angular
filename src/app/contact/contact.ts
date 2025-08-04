import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component } from '@angular/core';
import { Navbar } from '../components/navbar/navbar';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { response } from 'express';


@Component({
  selector: 'app-contact',
  imports: [CommonModule , Navbar , ReactiveFormsModule , HttpClientModule ],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

  currentUser : any = null ;
  contactForm : FormGroup ; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object , protected fb : FormBuilder , private http : HttpClient){
    this.contactForm = this.fb.group({
      lastName : [ '' ,[Validators.required , Validators.minLength(2)]],
      firstName : [ '' , [Validators.required , Validators.minLength(2)]],
      email : ['' , [Validators.required , Validators.email]] , 
      objet : ['Not defined',[Validators.required]] , 
      message : ['',[Validators.required]]
    })
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
    if(this.currentUser)
    {
      this.contactForm.patchValue({
        firstName : this.currentUser.firstName || '' , 
        lastName : this.currentUser.lastName || '' ,
        email : this.currentUser.email || ''
      });
    }
  }

  onSubmit()
  {
    if(this.contactForm.valid)
    {
      const formData = this.contactForm.value;
      this.http.post<any>('http://localhost:8080/reclamation/enregistrer',formData).subscribe({
        next : (response)=>{
          alert(response.message)
        },
        error : (error)=>{
          console.log(error)
          alert(error.error)
        }
      })

    }else
    {
      alert("Formulaire invalide");
    }
  }
}
