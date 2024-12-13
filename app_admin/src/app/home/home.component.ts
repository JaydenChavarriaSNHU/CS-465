import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class HomeComponent {
    constructor(private authService: AuthenticationService) {}

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}