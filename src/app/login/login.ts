import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { HttpClient , HttpClientModule } from '@angular/common/http';
import { Auth } from '../auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule , CommonModule , HttpClientModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  rememberMe = false;
  loginError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder , private http: HttpClient , private auth: Auth , private router : Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }


onSubmit() {
  if (this.loginForm.valid) {
    this.isSubmitting = true;
    this.loginError = false;

    const formData = this.loginForm.value;

    this.http.post<any>('http://localhost:8080/auth/login', formData).subscribe({
      next: (response) => {
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        this.router.navigate(['home'])
      },
      error: (error) => {
        alert(error.error)
        this.isSubmitting = false;
        this.loginError = true;
      }
    });

  } else {
    this.markFormGroupTouched();
  }
}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `Le champ ${fieldName === 'email' ? 'email' : 'mot de passe'} est requis`;
    }
    
    if (control?.hasError('email')) {
      return 'Veuillez saisir une adresse email valide';
    }
    
    if (control?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  dismissError() {
    this.loginError = false;
    this.errorMessage = '';
  }

  quickLogin(role: string) {
    console.log(`Connexion rapide en tant que ${role}`);
    alert(`Connexion en tant que ${role} - Fonctionnalité à implémenter`);
  }

}
