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