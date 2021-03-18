import { Injectable } from '@angular/core';
import { Admin } from '../admin';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';


const SOCKET_ENDPOINT = new URL(window.location.href).hostname + ":4444";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  socket;

  constructor(private router: Router) {
  }

  public signIn(admin: Admin) {
    this.socket = io(SOCKET_ENDPOINT, {query: {username: admin.username, password: admin.password}});
    this.socket.on("tokenSecretS2CAdmin", token => {
      localStorage.setItem('ACCESS_TOKEN', token);
      this.router.navigateByUrl('/quiz/main');
    });
  }

  public isLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  
  public logout() {
    localStorage.removeItem('ACCESS_TOKEN');
  }
}
