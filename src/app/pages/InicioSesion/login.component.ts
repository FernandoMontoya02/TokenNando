import { Component,  OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/Usuario.models';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: UsuarioModel = new UsuarioModel();
  recordarme = false;

  constructor(private auth :AuthService, private router:Router){
    this.usuario = new UsuarioModel();
  }
  
  ngOnInit(): void {
    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }
    this.auth.login(this.usuario).subscribe({
      next:(resp) =>{
        console.log(resp);
        if(this.recordarme){
          localStorage.setItem('email', this.usuario.email);
        }
        Swal.close();
      },
      error(err){
        console.log(err.error.error.message)
        Swal.fire({
          allowOutsideClick: false,
          title: 'Error al reconocer al usuario',
          text: err.error.error.message,
          icon: 'error' 
        });
      },
      complete:()=> this.router.navigateByUrl('/home'),
      });
    Swal.fire({
      allowOutsideClick: false,
      text: 'Un momento sea paciente...',
      icon: 'info' 
    });
  }

}
