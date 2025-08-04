import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-register',
  standalone : true , 
  imports: [ReactiveFormsModule , CommonModule , HttpClientModule ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;

  roles = [
    { value: 'Patient', label: 'Patient' },
    { value: 'Médecin', label: 'Médecin' },
    { value: 'Secrétaire', label: 'Secrétaire' },
    { value: 'Admin' , label: "Admin"}
  ];

  constructor(private fb: FormBuilder , private router : Router , private http : HttpClient) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password : ['',[Validators.required,Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post("http://localhost:8080/auth/register", this.registerForm.value).subscribe({
        next: (response) => {
          alert('Enregistrement avec succés')
          this.router.navigate(['login'])
        },
        error: (error) => {
          alert(error.error)
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    
    const control = this.registerForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `Le champ ${fieldName === 'firstName' ? 'prénom' : fieldName === 'lastName' ? 'nom' : fieldName === 'email' ? 'email' : fieldName === 'password' ? 'password' : 'rôle'} est requis`;
    }
    
    if (control?.hasError('email')) {
      return 'Veuillez saisir une adresse email valide';
    }
    
    if (control?.hasError('minlength')) {
      return 'Minimum 2 caractères requis';
    }
    
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

}
