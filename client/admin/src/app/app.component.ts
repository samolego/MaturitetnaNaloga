import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './admin/auth/auth.service';


const SOCKET_ENDPOINT = new URL(window.location.href).hostname + ":4444";//'localhost:4444';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService, router: Router) { }

  
  isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  public static getSocketAddress() {
    return SOCKET_ENDPOINT;
  }
}
