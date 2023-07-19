import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/Usuario.models';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit{
  usuario: UsuarioModel = new UsuarioModel();
  recordarme = false;

  constructor(private auth :AuthService,
              private router : Router){
    this.usuario = new UsuarioModel();
  }

  ngOnInit(): void {
      this.usuario.email='';
      this.recordarme = true;
    }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }
    this.auth.nuevoUsuario(this.usuario).subscribe({
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

    
    
 