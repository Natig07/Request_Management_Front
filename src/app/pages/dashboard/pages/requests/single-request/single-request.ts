import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterLink, Router } from '@angular/router';
import { CommentInterface, RequestHistoryItem, Row, SingleRequestType, User } from '../../../../../services/Interfaces';
import { RequestService } from '../../../../../services/RequestServices/RequestService';
import { FileService } from '../../../../../services/FileService';
import { UserService } from '../../../../../services/UserService/UserService';
import { firstValueFrom, map } from 'rxjs';
import { ReportService } from '../../../../../services/ReportServices/ReportService';

@Component({
  selector: 'app-single-request',
  imports: [RouterModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './single-request.html',
  styleUrl: './single-request.css'
})
export class SingleRequest implements OnInit {
  Reqid:number=0;
  UserId:number=0
  ReqCategoryId:number=0;
  LogUserId:number=0;
  
  loading=false;

  selectedFileName:string = "";
  selectedFile:File|null=null;
  successMessage: string | null = null;
  errorMessage: string | null = null;


  existingReport: any = null;
  reportSubmitted: boolean = false;



  filters = [
    { label: 'Sorğu', status: 'request',  },
    { label: 'Şərh', status: 'comment', count: 0 },
    { label: 'Tarixçə', status: 'history',  },
    { label: 'Sorğu məlumatlar', status: 'requestİnfo',  },
  ];


  activeFilter = 'request';

  setActiveFilter(filterStatus: string) {
    const filter = this.filters.find(f => f.status === filterStatus);
    this.activeFilter = filter ? filter.status : 'all';

    this.loadFilteredData(filterStatus);

  }

  loadFilteredData(section: string) {
    this.loading = true;
    
    switch(section) {
      case 'request':
        this.loadRequestSection();
        break;
      case 'comment':
        this.loadCommentsSection();
        break;
      case 'history':
        this.loadHistorySection();
        break;
      case 'requestİnfo':
        this.loadRequestInfoSection();
        break;
    }
  }

  loadRequestSection() {
    this.ReqService.getRequestBySection(this.Reqid, 'request').subscribe({
      next: (res: any) => {
        // Update singleReq with responses
        this.updateSingleReqFromResponse(res);
        this.ReqComments = this.mapComments(res.responses || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading request section:', err);
        this.loading = false;
      }
    });
  }
  loadCommentsSection() {
    this.getCommments(this.Reqid);
  }
  loadHistorySection() {
    this.loadRequestHistory();
  }

  loadRequestInfoSection() {
    // Request info is already loaded, just check for existing report
    this.loadExistingReport();
    this.loading = false;
  }

  mapComments(responses: any[]): CommentInterface[] {
    return responses.map(h => {
      const comment: CommentInterface = {
        ReqId: h.id,
        text: h.text,
        createdAt: new Date(h.createdAt + "Z").toLocaleString('en-GB', {
          timeZone: 'Asia/Baku',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replaceAll('/', '.'),
        UserId: h.userId,
        user: h.user,
        attachmentId: h.attachmentId ?? null,
        userProfileUrl: ''
      };

      if (h.user?.profilePhotoId) {
        this.loadprofilePhoto(h.user.profilePhotoId).subscribe(url => {
          comment.userProfileUrl = url;
        });
      }

      return comment;
    });
  }

  updateSingleReqFromResponse(res: any) {
    this.singleReq = {
      Reqid: res.id,
      reqsender: res.user?.name + " " + res.user?.surname,
      senderPosition: res.user.position,
      header: res.header ?? '',
      text: res.text ?? '',
      category: res.reqCategory.name,
      reqType: res.reqType.id,
      reqPriority: res.reqPriority.id,
      createdAt: new Date(res.createdAt+"Z").toLocaleString('en-GB', {
        timeZone:'Asia/Baku',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '').replaceAll('/', '.'),
      Reqstatus:{
        id:res.reqStatus?.id,
        name : res.reqStatus?.name == 'New' ? 'açıq' :
              res.reqStatus?.name == 'Waiting' ? 'gözləmədə' :
              res.reqStatus?.name == 'Completed' ? 'təsdiqləndi' :
              res.reqStatus?.name == 'Denied' ? 'imtina' :
              res.reqStatus?.name == 'InProgress' ? 'icrada' : 'qapalı',
      },
      fileId: res.file?.id ?? null,
      responses: res.responses?.map((r: any) => ({
        id: r.id,
        responder: r.username + ' ' + r.usersurname,
        responderPosition: r.position,
        text: r.text,
        createdAt: new Date(r.createdAt+"Z").toLocaleString('en-GB', {
          timeZone:'Asia/Baku',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replaceAll('/', '.'),
        fileId: r.fileId ?? null
      })) ?? [],
    };
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

  stats=[
    {id:1, name:"New"},
    {id:2, name:"InProgress"},
    {id:3, name:"Completed"},
    {id:4, name:"Denied"},
    {id:5, name:"Waiting"},
    {id:6, name:"Closed"},
  ]

  //Status change
  

  
  

  singleReq:SingleRequestType|null=null;
  senderName:string='';
  createdAt:string='';

  requestHistory: RequestHistoryItem[] = [];

  userphotoUrl:string='';
  userphotoId:number=0;

  reportForm = {
    reqPriorityId: null as number | null,
    reqTypeId: null as number | null,
    reqStatusId: 1, // Default status
    executorId: null as number | null,
    createdAt: new Date(),
    firstOperationDate: null as Date | null,
    closeDate: null as Date | null,
    result: '',
    solution: '',
    operationTime: null as number | null,
    plannedOperationTime: null as number | null,
    type: 'ApplicationMaintenance',
    requestSender: '',
    solmanReqNumber: null as number | null,
    communication: 'Email',
    isRoutine: false,
    code: '',
    rootCause: ''
  };




  constructor(
    private route:ActivatedRoute, 
    private userService:UserService,
    private ReqService:RequestService,
    private Fileserv:FileService,
    private RepService:ReportService,
    private Router:Router,
  ) {}

  ngOnInit():void {
    this.Reqid=Number(this.route.snapshot.paramMap.get('id'));
    this.LogUserId=parseInt(localStorage.getItem('userId')!);
    this.loadRequest();
    // console.log(this.singleReq)

  }

  // Check if request is in progress (icrada)
  isRequestInProgress(): boolean {
    return this.singleReq?.Reqstatus?.name === 'icrada';
  }

  // Check if form can be filled
  canFillReportForm(): boolean {
    return this.isRequestInProgress();
  }

  // Check if close button should be enabled
  canCloseRequest(): boolean {
    return this.isRequestInProgress() && this.reportSubmitted;
  }

  // Check if report form is valid and complete
  isReportFormValid(): boolean {
    return !!(
      this.reportForm.result?.trim() &&
      this.reportForm.solution?.trim() &&
      this.reportForm.operationTime &&
      this.reportForm.plannedOperationTime
    );
  }

  changeReqStatus(newstatus:string){
    if (newstatus === 'qapalı' && !this.canCloseRequest()) {
      this.showAlert('error', 'Report formu doldurulmalıdır və göndərilməlidir');
      return;
    }
    const newStatusid=newstatus=='açıq'? 1 : newstatus=='icrada'? 2: newstatus=='gözləmədə'? 5 : newstatus=='imtina'? 4: 6;
    // console.log(this.Reqid,newStatusid)
    this.ReqService.changeReqStatus(this.Reqid,newStatusid,this.LogUserId).subscribe({
      next:()=>{
        this.loadRequest();
        this.loadRequestHistory();
        this.showAlert('success', 'Status uğurla yeniləndi.');
      },
      error:(err)=>{
        
        this.showAlert('error', err?.error?.message || 'Yeniləmə zamanı xəta baş verdi.');      
      }
    });
  }

  loadRequest() {
  this.loading = true;
  this.ReqService.getRequestById(this.Reqid).subscribe({
    next: (res: any) => {
      console.log(res);
      this.singleReq = {
        Reqid: res.id,
        reqsender: res.user?.name + " " + res.user?.surname,
        senderPosition: res.user.position,
        header: res.header ?? '',
        text: res.text ?? '',
        category: res.reqCategory.name,
        reqType: res.reqType.id,
        reqPriority: res.reqPriority.id,
        createdAt: new Date(res.createdAt+"Z").toLocaleString('en-GB', {
          timeZone:'Asia/Baku',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replaceAll('/', '.'),
        Reqstatus:{
          id:res.reqStatus?.id,
          name : res.reqStatus?.name == 'New' ? 'açıq' :
                res.reqStatus?.name == 'Waiting' ? 'gözləmədə' :
                res.reqStatus?.name == 'Completed' ? 'təsdiqləndi' :
                res.reqStatus?.name == 'Denied' ? 'imtina' :
                res.reqStatus?.name == 'InProgress' ? 'icrada' : 'qapalı',
        },
        fileId: res.file?.id ?? null,
        responses: res.responses?.map((r: any) => ({
          id: r.id,
          responder: r.username + ' ' + r.usersurname,
          responderPosition: r.position,
          text: r.text,
          createdAt: new Date(r.createdAt+"Z").toLocaleString('en-GB', {
            timeZone:'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.'),
          fileId: r.fileId ?? null
        })) ?? [],
      };
      this.UserId=res.userId;
      this.userphotoId = res.user?.profilePhoto?.id ?? 0;

      this.reportForm.reqTypeId = this.singleReq!.reqType;
      this.reportForm.reqPriorityId = this.singleReq!.reqPriority;
      this.ReqCategoryId = res.reqCategory.id;
      this.reportForm.reqStatusId=this.singleReq!.Reqstatus.id;
      this.reportForm.createdAt=res.createdAt;
      this.reportForm.executorId=res.executorId;
      this.reportForm.firstOperationDate=res.firstOperationDate;

      if (this.userphotoId) {
        this.loadprofilePhoto(res.user.profilePhoto.id).subscribe(url => {
          this.userphotoUrl =  url;
        });
        
      } else {
        this.userphotoUrl = '';
      }

      

      this.loadRequestHistory();
      this.getCommments(this.Reqid);
      // this.loadprofilePhoto()

      //existing Report 
      this.loadExistingReport();

      // console.log(this.singleReq)
      
      // console.log(this.ReqComments)

      // Update comment count in filters
      this.filters.find(f => f.status === 'comment')!.count = this.singleReq!.responses?.length || 0;
    },
    error: (err) => console.error(err),
    complete: () => this.loading = false
  });
  }

  loadExistingReport() {
    this.RepService.getReportByRequestId(this.Reqid).subscribe({
      next: (report: any) => {
        if (report) {
          this.existingReport = report;
          this.reportSubmitted = true; // Report exists, so it was submitted
          
          if (report.firstOperationDate) {
            this.reportForm.firstOperationDate = new Date(report.firstOperationDate);
          }
          
          console.log('Existing report loaded:', this.existingReport);
        } else {
          // Response is null or empty
          this.reportSubmitted = false;
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.reportSubmitted = false;
          
        } else if (err.status === 500) {
          
          this.reportSubmitted = false;
          console.warn('Report check returned 500 - treating as no report exists');
        } else {
         
          console.error('Unexpected error loading report:', err);
        }
      }
    });
  }

  loadRequestHistory() {
    this.ReqService.getRequestHistory(this.Reqid).subscribe({
      next: (res: any[]) => {
        this.loading=false;
        this.requestHistory = res.map(h => ({
          id: h.id,
          userName: h.userName,
          userSurname: h.userSurname,
          userPosition: h.userPosition,
          action: h.action,
          description: h.description,
          createdAt: new Date(h.createdAt+"Z"
          ).toLocaleString('en-GB', {
            timeZone:'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.')
        }));
      },
      error: (err) => console.error('Error loading history', err)
    });
  }

  loadprofilePhoto(FileId: number) {
    return this.userService.getUserProfilePhotoUrl(FileId).pipe(
      map((blob: Blob) => URL.createObjectURL(blob))
    );
  }


  takeRequest(reqId: number) {
  if (!reqId || !this.LogUserId) {
    console.error('Invalid IDs:', reqId, this.LogUserId);
    this.showAlert('error', 'User ID or Request ID is missing');
    return;
  }

  console.log('Taking request:', reqId, 'by user:', this.LogUserId);

  this.ReqService.takeRequest(this.LogUserId, reqId).subscribe({
    next: () => {
      this.loadRequest();
      this.loadRequestHistory();
      this.showAlert('success', 'Sorğu lock edildi.');
    },
    error: (err) => {
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


  photoUrl:string='';

  getFile(fileId:number){
    console.log(fileId);
    this.Fileserv.downloadFile(fileId).subscribe({
          next: (response) => {

            const mimeType= response.headers.get("Content-Type")||'application/octet-stream';

            const blob = new Blob([response.body!],{
              type:mimeType
            });

            const contentDisposition = response.headers.get('Content-Disposition');

            let filename  =`Qosma${this.Reqid}`;

            if(contentDisposition && contentDisposition.includes('filename')){
              const match = contentDisposition.match(/filename="?(.+)"?/);
              if(match && match[1]){
                filename=match[1]
              }
              
            }

            const url= window.URL.createObjectURL(blob);

            const a=document.createElement('a');
            a.href=url;
            a.download=filename;

            a.click();
            window.URL.revokeObjectURL(url);
           
            this.showAlert("success","Qoşma file yüklendi")
          },
          error: (err) =>{ 
            console.error('Failed to load profile photo', err)
            this.showAlert("error","File yüklənərkən xəta baş verdi")
          }
          
        });
  }

  // alertFunc(text:string){
  //   alert(`Say ${text}`);
  // }

  

  ReqComments:CommentInterface[]=[];

  addComment(commentText:HTMLTextAreaElement) {
    if (!commentText.value.trim()) return;
    // console.log(commentText)

    const formData = new FormData();
    formData.append("Text", commentText.value);
    formData.append("RequestId",this.Reqid.toString())
    formData.append("UserId",this.LogUserId.toString());
    if (this.selectedFile) formData.append('file', this.selectedFile);

    // console.log(...formData)

    this.loading = true;
    this.ReqService.addComment(formData).subscribe({
      next: (res: any) => {
        this.showAlert('success', 'Şərh əlavə edildi.');
        this.selectedFile = null;
        this.selectedFileName = '';
        this.loadRequest(); // reload request with updated responses
      },
      error: (err:any) => {this.showAlert('error', err?.error?.message || 'Xəta baş verdi.')
        console.error(err.error.message);
        this.loading=false
        // console.log(formData)
      },
      
      complete: () => {
        this.loading = false
        commentText.value=''
      }
    });
  }

  getRequestTypeName(typeId: number | undefined): string {
    if (!typeId) return 'N/A';
    return this.requestTypes.find(type => type.id === typeId)?.name || 'Unknown';
  }

  getRequestPrioritypeName(priId: number | undefined): string {
    if (!priId) return 'N/A';
    return this.priorities.find(pri => pri.id === priId)?.name || 'Unknown';
  }

  getCommments(Reqid:number){
    this.ReqService.getComments(Reqid).subscribe({
      next:(res:any[])=>{
        this.loading=false;
        // console.log(res)
        this.ReqComments = res.map(h => {
        const comment = {
          ReqId: h.id,
          text: h.text,
          createdAt: new Date(h.createdAt + "Z").toLocaleString('en-GB', {
            timeZone: 'Asia/Baku',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '').replaceAll('/', '.'),
          UserId: h.userId,
          user: h.user,
          attachmentId: h.attachmentId ?? null,
          userProfileUrl: ''
        };

        if (h.user?.profilePhotoId) {
          this.loadprofilePhoto(h.user.profilePhotoId).subscribe(url => {
            comment.userProfileUrl = url;
          });
        }

        return comment;
      });

       
        this.filters.map((filter)=>{
          if(filter.label=='Şərh'){
            filter.count=res.length
            // console.log(filter.count)
          }
    })
      }

        
    })
  }

    


  createReport(event: Event) {
    event.preventDefault();

    if (!this.canFillReportForm()) {
      this.showAlert('error', 'Report yalnız "icrada" statusunda olan sorğular üçün yaradıla bilər');
      return;
    }

    if (!this.isReportFormValid()) {
      this.showAlert('error', 'Nəticə, Həll yolu, İcra müddəti və Planlaşdırılmış icra müddəti məcburidir');
      return;
    }

    const payload = {
      userId: this.UserId,
      reqCategoryId: this.ReqCategoryId,
      reqPriorityId: this.reportForm.reqPriorityId,
      reqTypeId: this.reportForm.reqTypeId,
      reqStatusId: this.reportForm.reqStatusId,
      createdAt: this.reportForm.createdAt,
      firstOperationDate: this.reportForm.firstOperationDate,
      operationTime: this.reportForm.operationTime,
      plannedOperationTime: this.reportForm.plannedOperationTime,
      result: this.reportForm.result || null,
      solution: this.reportForm.solution || null,
      executorId: this.reportForm.executorId,
      closeDate: this.reportForm.closeDate,
      requestId: this.Reqid,
      // Additional fields
      type: this.reportForm.type,
      requestSender: this.reportForm.requestSender,
      solmanReqNumber: this.reportForm.solmanReqNumber,
      communication: this.reportForm.communication,
      isRoutine: this.reportForm.isRoutine,
      code: this.reportForm.code || null,
      rootCause: this.reportForm.rootCause || null
    };

    //console.log('Report Payload:', payload); // For debugging

    this.loading = true;

    this.RepService.createReport(payload).subscribe({
      next: () => {
        this.showAlert('success', 'Report uğurla yaradıldı');
        this.reportSubmitted = true;
        // this.changeReqStatus('qapalı');
        // this.resetReportForm();
      },
      error: (err) => {
        console.error('Error creating report:', err);
        this.showAlert('error', err?.error?.message || 'Report yaradılarkən xəta baş verdi');
        this.loading = false;
      },
      complete: () => {
        this.Router.navigate([`dashboard/requests/singleRequest/${this.singleReq?.Reqid}`]);
        this.loading = false;
      }
    });
  }

  // Updated resetReportForm
  // resetReportForm() {
  //   this.reportForm = {
  //     reqPriorityId: null,
  //     reqTypeId: null,
  //     reqStatusId: 1,
  //     executorId: null,
  //     createdAt: new Date(),
  //     firstOperationDate: null,
  //     closeDate: new Date(),
  //     result: '',
  //     solution: '',
  //     operationTime: null,
  //     plannedOperationTime: null,
  //     type: 'ApplicationMaintenance',
  //     requestSender: '',
  //     solmanReqNumber: null,
  //     communication: 'Email',
  //     isRoutine: false,
  //     code: '',
  //     rootCause: ''
  //   };
      
    

  // }

  printPage(){
    window.print()
  }
}
