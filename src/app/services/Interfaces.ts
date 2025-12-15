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
  status:string,
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

