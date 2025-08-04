import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-avis',
  imports: [Sidebar , CommonModule , ReactiveFormsModule , FormsModule , HttpClientModule ],
  templateUrl: './avis.html',
  styleUrl: './avis.css'
})
export class Avis implements OnInit {

  LinkActive : string = "avis" ; 
  currentUser : any = null ;
  avisForm!: FormGroup;
  avis : any = null ; 

  constructor(private fb : FormBuilder ,  private http : HttpClient , private cdr : ChangeDetectorRef){
    this.avisForm = this.fb.group({
      email : ['' , [Validators.required , Validators.email]] , 
      texte : ['' , [Validators.required]] ,
      note : ['', [Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.avisForm.patchValue({
      note : 0 ,
    });
    this.http.get<any>("http://localhost:8080/avis/getall").subscribe({
      next : (response) => {
        this.avis = response ;
        this.cdr.detectChanges();
      },
    });
  };

  envoyerAvis() {
    if (this.avisForm.valid) {
      const formData = this.avisForm.value ;
      this.http.post<any>("http://localhost:8080/avis/enregistrer" , formData).subscribe({
        next : (response) => {
          alert('Avis enregistré avec succés');
          location.reload();       
        },
        error : (error) => {
          alert('Une erreur est servenue merci de réssayer plus tard')
        }
      })
    }
  };

  getTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);
  const months  = Math.floor(days / 30);
  const years   = Math.floor(days / 365);

  if (seconds < 60) {
    return `il y a ${seconds <= 1 ? 'quelques secondes' : `${seconds} secondes`}`;
  } else if (minutes < 60) {
    return `il y a ${minutes === 1 ? '1 minute' : `${minutes} minutes`}`;
  } else if (hours < 24) {
    return `il y a ${hours === 1 ? '1 heure' : `${hours} heures`}`;
  } else if (days < 30) {
    return `il y a ${days === 1 ? '1 jour' : `${days} jours`}`;
  } else if (months < 12) {
    return `il y a ${months === 1 ? '1 mois' : `${months} mois`}`;
  } else {
    return `il y a ${years === 1 ? '1 an' : `${years} ans`}`;
  }
}
}
