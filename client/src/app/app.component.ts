import { Component } from '@angular/core';
import { AuthService } from './admin/auth/auth.service';


const SOCKET_ENDPOINT = new URL(window.location.href).hostname + ":4444";//'localhost:4444';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService) { }

  
  isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  public static getSocketAddress() {
    return SOCKET_ENDPOINT;
  }
}
