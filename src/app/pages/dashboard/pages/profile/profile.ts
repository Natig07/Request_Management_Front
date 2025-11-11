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
  profilePhotoId:number|null=null;
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

  constructor(private userService: UserService,
    private fb:FormBuilder,
    private fileService:FileService
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
        this.profilePhotoId=user.profilePhotoId;
        this.userService.getUserProfilePhotoUrl(user.profilePhotoId).subscribe({
          next: (blob: Blob) => {
            if (this.photoUrl) URL.revokeObjectURL(this.photoUrl); // Cleanup old one
            this.photoUrl = URL.createObjectURL(blob);
          },
          error: (err) => console.error('Failed to load profile photo', err)
        });
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
      next: (response) => {
        this.loading = false;
        this.showAlert('success', 'Profil uğurla yeniləndi.');

        this.userService.setCurrentUser(mergedUser);
        localStorage.setItem('currentUser',JSON.stringify(mergedUser));
        setTimeout(() => {
          this.isChanged=false;
          this.isFocused=false;
          
        }, 1000);
        // console.log("Response:", response);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.showAlert('error', err?.error?.message || 'Yeniləmə zamanı xəta baş verdi.');

      }
    });
  }

  showAlert(messageType: 'success' | 'error', text: string) {
    if (messageType === 'success') this.successMessage = text;
    else this.errorMessage = text;

    setTimeout(() => {
      if (messageType === 'success') this.successMessage = '';
      else this.errorMessage = '';
    }, 4000); // disappears after 4s
  }



  ngOnDestroy() {
    if (this.photoUrl) {
      URL.revokeObjectURL(this.photoUrl);
      this.photoUrl = undefined;
    }
  }


  //File Upload

  selectedFileName:string = "";

  onFileSelected(event:Event){
    const input = event.target as HTMLInputElement;

    if(input.files && input.files.length>0){
      this.selectedFileName = input.files[0].name;
      this.isChanged = true;
      this.formData.append("profilePhoto",input.files[0])

    }else{
      this.selectedFileName='';
    }
  }

  onFileDelete(){
    console.log(this.profilePhotoId)
    this.fileService.DeleteFile(this.profilePhotoId!).subscribe(
      {
        next:()=>{
          this.showAlert("success","Profile photo deleted successfully!");
          this.isChanged=true;
        },
        error:(err)=>{
          this.showAlert("error",err);
        }
      }
    )
  }
}
