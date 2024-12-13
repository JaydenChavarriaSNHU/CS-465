import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    imports: [CommonModule, RouterModule, RouterLink],
    standalone: true
})
export class NavbarComponent implements OnInit {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router  // Add router
    ) { }

    ngOnInit() { }

    public isLoggedIn(): boolean {
        return this.authenticationService.isLoggedIn();
    }

    public onLogout(): void {
        this.authenticationService.logout();
        this.router.navigateByUrl('/login');  // Navigate to login page after logout
    }
}