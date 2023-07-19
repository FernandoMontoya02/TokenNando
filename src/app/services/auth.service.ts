import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/Usuario.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string;
  private apiKey: string;
  private inactivityTimeout: number;
  private inactivityTimer: number | null = null;
  userToken: string;

  constructor(private http: HttpClient) {
    this.url = 'https://identitytoolkit.googleapis.com/v1';
    this.apiKey = 'AIzaSyD8TyIMWsq2fQGKgGhblTc_5s65-mD71Wg';
    this.leerToken();
    this.inactivityTimeout = 60000;
    this.iniciarTemporizadorInactividad();
  }

  logout() {
    localStorage.removeItem('token');
    this.detenerTemporizadorInactividad();
  }
  
  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`, authData
    ).pipe(
      map(
        resp => {
          this.guardarToken(resp['idToken']);
          this.reiniciarTemporizadorInactividad();
        }
      )
    );
  }
  
  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}/accounts:signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        this.guardarToken(resp['idToken']);
        this.reiniciarTemporizadorInactividad();
      })
    );
  }
  
  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(hoy.getSeconds() + 3600); 
    localStorage.setItem('expira', hoy.getTime().toString());
  }
  
  private leerToken() {
    this.userToken = localStorage.getItem('token') || '';
  }
  
  estaAutenticado(): boolean {
    this.leerToken();
  
    if (this.userToken.length < 2) {
      return false;
    }
  
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
  
    return expiraDate > new Date();
  }

  private iniciarTemporizadorInactividad() {
    this.detenerTemporizadorInactividad();

    this.inactivityTimer = window.setTimeout(() => {
      this.cerrarSesionPorInactividad();
    }, this.inactivityTimeout);
  }

  private detenerTemporizadorInactividad() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  private reiniciarTemporizadorInactividad() {
    this.detenerTemporizadorInactividad();
    this.iniciarTemporizadorInactividad();
  }

  private cerrarSesionPorInactividad() {
    this.logout();
  }
}
