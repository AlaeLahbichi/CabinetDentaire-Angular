import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Routes } from '../Chemin/routes';

@Component({
  selector: 'app-edit-password',
  imports: [CommonModule , ReactiveFormsModule , HttpClientModule ],
  templateUrl: './edit-password.html',
  styleUrls: ['./edit-password.css']
})
export class EditPassword implements OnInit {
  passwordForm: FormGroup;
  currentUser: any = null ; 
  isLoading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  showSuccess = false;

  passwordStrength = {
    score: 0,
    text: '',
    percentage: 0,
    class: '',
    color: '#CED4DA'
  };

  constructor(private fb: FormBuilder , private router : Router , private http : HttpClient , @Inject(PLATFORM_ID) private platformId: Object , private chemin : Routes) {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordStrength();
    });
    if (isPlatformBrowser(this.platformId)){
      const personne = localStorage.getItem('currentUser');
      if(personne)
      {
        this.currentUser = JSON.parse(personne);
      }
    }
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  checkPasswordStrength() {
    const password = this.passwordForm.get('newPassword')?.value || '';
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    this.passwordStrength.score = score;

    if (score <= 2) {
      this.passwordStrength.text = 'Faible';
      this.passwordStrength.percentage = 33;
      this.passwordStrength.class = 'weak';
      this.passwordStrength.color = '#FF6B6B';
    } else if (score <= 3) {
      this.passwordStrength.text = 'Moyenne';
      this.passwordStrength.percentage = 66;
      this.passwordStrength.class = 'medium';
      this.passwordStrength.color = '#FFA94D';
    } else {
      this.passwordStrength.text = 'Forte';
      this.passwordStrength.percentage = 100;
      this.passwordStrength.class = 'strong';
      this.passwordStrength.color = '#51CF66';
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    else if (field === 'new') this.showNewPassword = !this.showNewPassword;
    else if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.passwordForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.passwordForm.get(fieldName);

    if (!control) return '';

    if (control.hasError('required')) {
      return `Le champ ${fieldName === 'currentPassword' ? 'mot de passe actuel' : fieldName === 'newPassword' ? 'nouveau mot de passe' : 'confirmation du mot de passe'} est requis`;
    }

    if (fieldName === 'newPassword' && control.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (fieldName === 'confirmPassword' && this.passwordForm.hasError('mismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }

    return '';
  }

onSubmit() {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    this.currentUser = JSON.parse(userData);
  } else {
    this.currentUser = null;
  }
  if (this.passwordForm.valid && userData && this.http ) {
    const formData = this.passwordForm.value;
    formData['email'] = this.currentUser.email;

    this.isLoading = true;
    this.http.post('http://localhost:8080/user/editpassword', formData).subscribe({
      next: (response) => {
        alert('Modification du mot de passe avec succès');
        this.isLoading = false;
        this.chemin.GoLogout();
      },
      error: (error) => {
        alert("Une erreur est survenue : " + error.error);
        this.isLoading = false;
      }
    });
  } else {
    alert("Le formulaire n'est pas valide merci de réessayer.");
  }
}
}
