import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Home } from './home/home';
import { Profil } from './profil/profil';
import { EditProfil } from './edit-profil/edit-profil';
import { EditPassword } from './edit-password/edit-password';
import { Reservation } from './reservation/reservation';
import { Sidebar } from './components/sidebar/sidebar';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { Navbar } from './components/navbar/navbar';
import { Contact } from './contact/contact';
import { Message } from './dashboard/message/message';
import { Detail } from './Reclamation/detail/detail';
import { Membres } from './dashboard/membres/membres';
import { Archive } from './RDV/archive/archive';
import { Historiques } from './RDV/historiques/historiques';
import { MRDV } from './RDV/mrdv/mrdv';
import { Avis } from './dashboard/avis/avis';

export const routes: Routes = [
    {path : '', redirectTo: 'login', pathMatch: 'full' }, 
    {path : "register",component : Register },
    {path : "login" , component : Login },
    {path : "home" , component : Home },
    {path : "profil" , component : Profil },
    {path : "editprofil" , component : EditProfil },
    {path : "editpassword" , component : EditPassword },
    {path : "reservation" , component : Reservation },
    {path : "sidebar", component : Sidebar},
    {path : "dashboard", component : Dashboard},
    {path : "navbar", component : Navbar},
    {path : "contact" , component : Contact},
    {path : "reclamation" , component : Message},
    {path : "reclamation_detail/:id" , component : Detail},
    {path : "membres" , component : Membres},
    {path : "archive_RDV" , component : Archive} , 
    {path : "historique_RDV" , component : Historiques},
    {path : "mes_rendez_vous" , component : MRDV},
    {path : "avis" , component : Avis , data : { renderMode : 'direct' }},
];
