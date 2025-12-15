import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { CommentInterface, RequestHistoryItem, Row, SingleRequestType, User } from '../../../../../services/Interfaces';
import { RequestService } from '../../../../../services/RequestServices/RequestService';
import { FileService } from '../../../../../services/FileService';
import { UserService } from '../../../../../services/UserService/UserService';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-single-request',
  imports: [RouterModule,ReactiveFormsModule,CommonModule,],
  templateUrl: './single-request.html',
  styleUrl: './single-request.css'
})
export class SingleRequest implements OnInit {
  Reqid:number=0;
  UserId:number=0
  ReqCategory="3E-Agis";
  LogUserId:number=0;
  
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




  constructor(
    private route:ActivatedRoute, 
    private userService:UserService,
    private ReqService:RequestService,
    private Fileserv:FileService
  ) {}

  ngOnInit():void {
    this.Reqid=Number(this.route.snapshot.paramMap.get('id'));
    this.LogUserId=parseInt(localStorage.getItem('userId')!);
    this.loadRequest();
    // console.log(this.singleReq)

  }

  changeReqStatus(newstatus:string){
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
        reqType: res.reqType.name,
        reqPriority: res.reqPriority.level,
        createdAt: new Date(res.createdAt+"Z").toLocaleString('en-GB', {
          timeZone:'Asia/Baku',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replaceAll('/', '.'),
        status: res.reqStatus?.name == 'New' ? 'açıq' :
                res.reqStatus?.name == 'Waiting' ? 'gözləmədə' :
                res.reqStatus?.name == 'Completed' ? 'təsdiqləndi' :
                res.reqStatus?.name == 'Denied' ? 'imtina' :
                res.reqStatus?.name == 'InProgress' ? 'icrada' : 'qapalı',
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


      
      // console.log(this.ReqComments)

      // Update comment count in filters
      this.filters.find(f => f.status === 'comment')!.count = this.singleReq.responses?.length || 0;
    },
    error: (err) => console.error(err),
    complete: () => this.loading = false
  });
  }

  loadRequestHistory() {
    this.ReqService.getRequestHistory(this.Reqid).subscribe({
      next: (res: any[]) => {
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

  alertFunc(text:string){
    alert(`Say ${text}`);
  }


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

  getCommments(Reqid:number){
    this.ReqService.getComments(Reqid).subscribe({
      next:(res:any[])=>{
        console.log(res)
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
    
  

}
