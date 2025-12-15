import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../../../services/Interfaces';
import { RequestService } from '../../../../../services/RequestServices/RequestService';
 RequestService 
@Component({
  selector: 'app-create-request',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterModule],
  templateUrl: './create-request.html',
  styleUrl: './create-request.css'
})
export class CreateRequest {
  selectedFileName:string = "";
  selectedFile:File|null=null;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  priorityId: number = 0;
  requestTypeId: number = 0;

  // Priorities
  priorities = [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'High' },
    { id: 4, name: 'Critical' }
  ];

  // Request Types

  requestTypes = [
    { id: 1, name: 'App Change' },
    { id: 2, name: 'Bug Fix' },
    { id: 3, name: 'New Feature' },
    { id: 4, name: 'Access Request' }
  ];


  

  requestForm!: FormGroup;

  constructor(
    private fb:FormBuilder,
    private requestServices:RequestService
  ) {}

  ngOnInit() {
    if (this.priorities?.length > 0) {
      this.priorityId = this.priorities[0].id;       
    }

    if (this.requestTypes?.length > 0) {
      this.requestTypeId = this.requestTypes[0].id;  
    }
    this.requestForm = this.fb.group({
      category: [this.categories[0]?.id || '', Validators.required],
      priority: [this.priorityId, Validators.required],
      request_type: [this.requestTypeId, Validators.required],
      Header: ['', Validators.required],
      Text: ['', Validators.required],
      userId: Number,
      File: File,
      Date:new Date().toISOString()
    });


    this.getCategories(); // fetch from API
  }


categories: Category[] = [];

getCategories() {
  this.requestServices.getCategories().subscribe({
    next: (res:Category[]) => {
      this.categories = res;   
      if (this.categories.length > 0) {
        this.requestForm.patchValue({
          category: this.categories[4].id
        });
      }
    },
    error: () => {
      this.showAlert('error', 'Kategoriya yüklənmədi');
    }
  });
}


  // formData = new FormData();

    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.selectedFileName = file.name;
      }
    }

  

  onSubmit() {
    if (this.requestForm.invalid){
      this.errorMessage="Invalid input data"
      console.log("Invalid Form");
      setTimeout(() => (this.successMessage = null,
      this.errorMessage=null
    ), 3000);
      return;
    }

    const formData = new FormData();
    const userId = parseInt(localStorage.getItem('userId')!);

    formData.append("Text", this.requestForm.value.Text);
    formData.append("Header", this.requestForm.value.Header);
    formData.append("ReqCategoryId", this.requestForm.value.category);
    formData.append("ReqPriorityId", this.requestForm.value.priority);
    formData.append("ReqTypeId", this.requestForm.value.request_type);
    formData.append("UserId", userId.toString());
    formData.append("CreatedAt",this.requestForm.value.Date)

    if (this.selectedFile) {
      formData.append("File", this.selectedFile);
    }


    this.requestServices.createRequest(formData).subscribe({
      next: () => {
        this.requestForm.reset();
        this.requestForm.value.category=[this.categories[0]?.id] 
        this.requestForm.value.priority= [this.priorityId]
        this.requestForm.value.request_type= [this.requestTypeId]
        this.showAlert("success", "Sorğu uğurla göndərildi");
      },
      error: (err) => {
        console.error(err);
        this.showAlert("error", "Xəta baş verdi");
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
}
