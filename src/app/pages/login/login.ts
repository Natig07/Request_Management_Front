import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  showpassword=false;
  loginData = { username: '', password: '' };
  errorMessage = '';

  togglePasswordVisibility() {
    this.showpassword = !this.showpassword;
    
  }


  constructor(private authService: AuthService, private router: Router) {}

  loading = false;
  onLogin() {
    this.loading = true;

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard'])
      }, 
      error: err => {
        this.loading = false;
        console.error('Login error:', err);
        if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message; // backend sent JSON with {message:"..."}
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error; // backend sent plain string
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }

    });
  }

}
