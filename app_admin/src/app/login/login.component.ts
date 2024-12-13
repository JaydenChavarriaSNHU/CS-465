import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
    public formError: string = '';
    public credentials = {
        email: '',
        password: ''
    };

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {}

    public onLoginSubmit(): void {
        this.formError = '';
        if (!this.credentials.email || !this.credentials.password) {
            this.formError = 'All fields are required, please try again';
        } else {
            this.doLogin();
        }
    }

    private doLogin(): void {
        this.authenticationService.login(this.credentials)
            .then(() => {
                console.log('Login successful, navigating...');
                this.router.navigateByUrl('/list-trips');  // Make sure the slash is here
            })
            .catch((error) => {
                console.error('Login error:', error);
                if (error.status === 401) {
                    this.formError = 'Invalid email or password';
                } else {
                    this.formError = 'An unexpected error occurred. Please try again later.';
                }
            });
}   }
