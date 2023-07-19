import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/InicioSesion/login.component';
import { RegistroComponent } from './pages/Registarme/registro.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'home', component:HomeComponent, canActivate : [AuthGuard]},
  {path:'login', component:LoginComponent },
  {path:'registro', component:RegistroComponent},
  {path:'**', pathMatch:'full', redirectTo:'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
