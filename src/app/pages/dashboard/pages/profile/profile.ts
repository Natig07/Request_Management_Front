import { Component, NgModule, OnInit } from '@angular/core';
import { UserService } from '../../../../services/UserService/UserService';
import { User } from '../../../../services/Interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FileService,  } from '../../../../services/FileService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [ReactiveFormsModule, NgbModule, FormsModule, NgClass, RouterLink],
})
export class Profile implements OnInit {
  photoUrl: string | undefined;
  profilePhotoId: number | null = null;
  currentUser: User | null = null;

  isFocused = false;
  isChanged = false;

  onBlur(){
    if(!this.isChanged){
      this.isFocused = false;
    }
  }

  get isActive():boolean{
    return this.isFocused || this.isChanged;
  }

  profileForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      department: [''],
      position: [''],
      officeTelNumber: [''],
      mobTelNumber: [''],
      allowNotification: [Boolean]
    });

    this.userService.currrentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        
        // Fill the form with existing user data
        this.profileForm.patchValue({
          department: user.department || '',
          position: user.position || '',
          officeTelNumber: user.officeTelNumber || '',
          mobTelNumber: user.mobTelNumber || '',
          allowNotification: user.allowNotification
        });

        // Load profile photo if available
        if (user.profilePhotoId) {
          this.profilePhotoId = user.profilePhotoId;
          this.loadProfilePhoto(user.profilePhotoId);
        }
      }
    });
  }

  formData = new FormData();
  
  onUpdate() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updatedData = this.profileForm.value;
    const currentUser = this.userService.getCurrrentUser();

    if (!currentUser) {
      this.errorMessage = 'İstifadəçi məlumatı tapılmadı.';
      this.loading = false;
      return;
    }

    const userId = parseInt(localStorage.getItem('userId')!);

    // Merge current user with updated form values
    const mergedUser = { ...currentUser, ...updatedData };

    // Build FormData to match [FromForm] backend binding
    for (const [key, value] of Object.entries(updatedData)) {
      if (value !== null && value !== undefined && value !== currentUser[key as keyof User]) {
        this.formData.append(key, value as any);
      }
    }

    this.userService.updateUser(userId, this.formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        
        // Fetch updated user data from server
      this.userService.getUserInfo(userId).subscribe({
        next: (updatedUser: User) => {
          if (updatedUser.profilePhotoId) {
            this.profilePhotoId = updatedUser.profilePhotoId;
            
            // Load the new profile photo
            setTimeout(() => {
              this.loadProfilePhoto(updatedUser.profilePhotoId!);
            }, 500);
          }
          
          this.userService.setCurrentUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      });
      
      this.showAlert('success', 'Profil uğurla yeniləndi.');
        
        // Clear the FormData for next update
        this.formData = new FormData();
        this.selectedFileName = '';
        
        setTimeout(() => {
          this.isChanged = false;
          this.isFocused = false;
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Update error:', err);
        this.showAlert('error', err?.error?.message || 'Yeniləmə zamanı xəta baş verdi.');
        
        // Clear FormData on error too
        this.formData = new FormData();
      }
    });
  }

  // Extract photo loading into a separate method for reuse
  private loadProfilePhoto(photoId: number) {
    this.userService.getUserProfilePhotoUrl(photoId).subscribe({
      next: (blob: Blob) => {
        if (this.photoUrl) {
          URL.revokeObjectURL(this.photoUrl); // Cleanup old one
        }
        this.photoUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        console.error('Failed to load profile photo', err);
        this.photoUrl = undefined; // Fall back to default
      }
    });
  }

  showAlert(messageType: 'success' | 'error', text: string) {
    if (messageType === 'success') this.successMessage = text;
    else this.errorMessage = text;

    setTimeout(() => {
      if (messageType === 'success') this.successMessage = '';
      else this.errorMessage = '';
    }, 4000);
  }

  ngOnDestroy() {
    if (this.photoUrl) {
      URL.revokeObjectURL(this.photoUrl);
      this.photoUrl = undefined;
    }
  }

  // File Upload
  selectedFileName: string = "";
  private selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.isChanged = true;
      
      // Clear any existing photo in FormData
      this.formData = new FormData();
      this.formData.append("profilePhoto", this.selectedFile);
      
      // Preview the selected image immediately
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.photoUrl) {
          URL.revokeObjectURL(this.photoUrl);
        }
        this.photoUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFileName = '';
      this.selectedFile = null;
    }
  }

  onFileDelete() {
    console.log('Deleting photo with ID:', this.profilePhotoId);
    
    if (!this.profilePhotoId) {
      this.showAlert("error", "Profil şəkli tapılmadı");
      return;
    }

    this.fileService.DeleteFile(this.profilePhotoId).subscribe({
      next: () => {
        this.showAlert("success", "Profil şəkli uğurla silindi!");
        
        // Clear the photo from UI
        if (this.photoUrl) {
          URL.revokeObjectURL(this.photoUrl);
          this.photoUrl = undefined;
        }
        
        this.profilePhotoId = null;
        this.selectedFileName = '';
        this.selectedFile = null;
        
        // Update user data
        const currentUser = this.userService.getCurrrentUser();
        if (currentUser) {
          currentUser.profilePhotoId = 0;
          this.userService.setCurrentUser(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        this.isChanged = false;
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.showAlert("error", err?.error?.message || "Silmə zamanı xəta baş verdi");
      }
    });
  }
}