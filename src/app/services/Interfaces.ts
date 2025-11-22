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
  text: string;
  userId: number;
  ReqCategoryId: number;
  ReqPriorityId: number;
  ReqTypeId: number;
  File?: File;
  header: string;
}

export interface Row {
  id: number;
  sender: string;
  header: string;
  text: string;
  category: string;
  executor: string;
  date: string;
  status: string;
  file?: string; // optional
}
