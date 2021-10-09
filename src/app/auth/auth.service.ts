
import {Injectable} from "@angular/core"
import {HttpClient, HttpErrorResponse} from "@angular/common/http"
import { catchError ,tap } from "rxjs/operators"
import { Subject, throwError } from "rxjs"
import { user } from "./user.model"


export interface AuthResponse {
idToken:string;
email:string;
refreshToken:string;
expiresIn :string;
localId:string;
inscrit? :boolean 
}
@Injectable({providedIn:'root'})
export class authService {

    user=new Subject<user>();
constructor(private http: HttpClient){
}
signup(email:string ,password :string){
 return   this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDTLHGg79j34LO-yhoF3zqec1tLvxEdWuE',
    {email :email,password:password,returnSecureToken:true}).pipe(catchError(this.handleError),tap(resData=>{
        this.handleAuthentification(resData.email,resData.localId,resData.idToken,+resData.expiresIn)}))
}
login(email :string , password :string){
    return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDTLHGg79j34LO-yhoF3zqec1tLvxEdWuE',
    {email :email,password:password,returnSecureToken:true}).pipe(catchError(this.handleError), tap(resData=>{
        this.handleAuthentification(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
    })
    )
}


private handleAuthentification(email:string ,id:string ,token:string ,expireDate:number ){
    const expirationDate =new Date(new Date().getTime() + expireDate*1000) ;
    const User = new user(email ,id ,token ,expirationDate);
    this.user.next(User);
}
    


private handleError(errorRes :HttpErrorResponse){
    
        let error='unknown error is occured!!'
        if (!errorRes.error || !errorRes.error.error){
            return throwError(error)
        }
        switch(errorRes.error.error.message){
            case  'EMAIL_EXISTS' :
                error="this Email is existing !!" ;break;
            case 'EMAIL_NOT_FOUND' :
                error='Emain not Found.';break;
            case 'INVALID_PASSWORD' :
                error='invalid password.';break;
        }
        return throwError(error);
        
}
}