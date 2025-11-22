import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from "@angular/router";
import { Row } from '../../../../../services/Interfaces';

@Component({
  selector: 'app-single-request',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './single-request.html',
  styleUrl: './single-request.css'
})
export class SingleRequest {
  Reqid=12324;
  ReqCategory="3E-Agis";
  
  Comments: Row[] = []
  loading=false;

  selectedFileName:string = "";
  selectedFile:File|null=null;
  successMessage: string | null = null;
  errorMessage: string | null = null;


  filters = [
    { label: 'Sorğu', status: 'request',  },
    { label: 'Şərh', status: 'comment', count: 0 },
    { label: 'Tarixçə', status: 'history',  },
    { label: 'Sorğu məlumatlar', status: 'requestİnfo',  },
  ];


  updateFilterCounts() {
    this.filters.forEach(filter => {
      if (filter.status === 'all') {
        filter.count = this.Comments.length;
      } else {
        filter.count = this.Comments.filter(row => row.status === filter.status).length;
      }
    });
  }
  activeFilter = 'request';

  setActiveFilter(filterStatus: string) {
    const filter = this.filters.find(f => f.status === filterStatus);
    this.activeFilter = filter ? filter.status : 'all';
  }

  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.selectedFileName = file.name;
      }
  }

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

  //Status change
  reqStatus="açıq";
  changeReqStatus(newstatus:string){
    this.reqStatus=newstatus;
  }
  
}
