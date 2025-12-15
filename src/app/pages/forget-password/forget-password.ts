import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PasswordRenew } from '../../services/Interfaces';
import { UserService } from '../../services/UserService/UserService';
import { AuthService } from '../../services/auth';



@Component({
  selector: 'app-forget-password',
  imports: [RouterModule, ɵInternalFormsSharedModule, ReactiveFormsModule,FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css'
})
export class ForgetPassword {
  loading = false;
  showpasswordCurrent = false;
  showpasswordNew = false;

  togglevisibilityCurrent(){
    this.showpasswordCurrent=!this.showpasswordCurrent;
  }
  togglevisibilityNew(){
    this.showpasswordNew = !this.showpasswordNew;
  }

  RenewPasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService:UserService, private authServices:AuthService) {
    this.RenewPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      repeatNewPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.RenewPasswordForm.invalid){
      this.errorMessage="Invalid input data"
      console.log("Invalid Form");
      setTimeout(() => (this.successMessage = null,
      this.errorMessage=null
    ), 3000);
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const dto:PasswordRenew = this.RenewPasswordForm.value;

    this.userService.renewPassword(dto).subscribe({
      next: () => {
        this.successMessage = 'Şifrə uğurla dəyişdirildi';
        this.RenewPasswordForm.reset();
        this.loading = false;
        

        // hide success message after 3s
        setTimeout(() => (this.successMessage = ''), 3000);
        setTimeout(() => {
          this.authServices.logout();
        }, 4000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Xəta baş verdi!';
        this.loading = false;

        // hide error after 3s
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
    
  }

}
