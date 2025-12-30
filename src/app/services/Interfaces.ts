export interface User{
  id:number,
  name:string,
  username: string,
  surname: string,
  position: string,
  department:string,
  officeTelNumber:string,
  mobTelNumber:string,
  allowNotification:boolean,
  profilePhotoId: number,
  email:string
}

export interface PhotoFile{
  id: number,
  fileName: string,
  url: string
}

export interface PasswordRenew{
  oldPassword:string,
  newPassword:string,
  repeatNewPassword:string
}

export interface Category{
  id:number,
  name:string
}

export interface Request {
  id:number,
  username:string,
  usersurname:string,
  text: string;
  userId: number;
  ReqCategoryId: number;
  ReqPriorityId: number;
  ReqTypeId: number;
  File?: File;
  header: string;
}

export interface SingleRequestType {
  Reqid:number,
  reqsender:string,
  senderPosition:string,
  text: string;
  userId?: number;
  category: number;
  reqPriority: number;
  reqType: number;
  Reqstatus:{
    id:number,
    name:string
  },
  fileId?: number;
  header: string;
  createdAt:string;
  responses:Response[];
}

export interface Response{
  Resid:number,
  responder:string,
  responderPosition:string,
  text: string;
  userId?: number;
  status:string,
  createdAt:string,
  fileId?: number;
  header: string;
}

export interface Row {
  id: number;
  sender?: string;
  header?: string;
  text?: string;
  category?: string;
  executor?: string;
  date?: string;
  firstOperationDate?: string;
  operationTime?: number;
  closedate?: string;
  status?: string;
  file?: string | null;
}

export interface RequestHistoryItem {
  id: number;
  userName: string;
  userSurname: string;
  userPosition: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface CommentInterface{
  ReqId:number,
  UserId:number,
  text:string,
  createdAt:string,
  user:User,
  attachmentId:number,
  userProfileUrl:string;

}

export interface RequestFilter {
  categoryId?: number;
  statusId?: number;
  priorityId?: number;
  executorId?: number;

  fromDate?: string; // ISO string
  toDate?: string;

  search?: string;

  page?: number;
  pageSize?: number;
  sortField: string | undefined;
  sortDirection:string;
}

export interface PagedResult<T> {
  statusCounts: any;
  filters: any;
  items: T[];
  totalCount: number;
}

export interface CreateReportInterface {
  reqPriority: number;
  reqType: number;
  result?: string;
  solution?: string;
  operationTime?: string;
  plannedOperationTime?: string;
  type: string; 
  requestSender?: string;
  solmanRequestNumber?: string;
  communication: string; 
  isRoutine: boolean;
  code?: string;
  rootCause?: string;
}

export interface ReportFilter {
  categoryId?: number;
  executorId?: number;
  statusId?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
  sortField: string | undefined;
  sortDirection:string;
}

export interface PagedReportResult {
  items: any[];
  totalCount: number;
  page: number;
  pageSize: number;
}


