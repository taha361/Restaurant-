import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import{HttpClient} from "@angular/common/http"
import { authService ,AuthResponse } from "./auth.service";
import {Observable} from "rxjs"
import { Router } from "@angular/router";


@Component({
    selector: 'auth-app',
    templateUrl:'./auth.component.html'
})
export class authComponent{

isLoginMode=true;
isLoading= false ;
error =null;



constructor(private http :HttpClient , private authService :authService ,private router :Router){}

onSwitchMode(){
    this.isLoginMode=!this.isLoginMode;
}

onSubmit(f:NgForm){
 const email= f.value.email;
 const password=f.value.password;
 this.isLoading =true ;

 let AuthObs : Observable<AuthResponse>;


  
if(this.isLoginMode){
    this.authService.login(email ,password).subscribe(userData=>{
        console.log(userData)
        this.isLoading= false;
        this.router.navigate(['/recipes']);
    },error=>{
        console.log(error)
        this.error=error ; 
        this.isLoading=false;
    }); 

}
else{
  this.authService.signup(email,password).subscribe(userData=>{
    console.log(userData)
    this.isLoading= false;
    this.router.navigate(['/recipes']);
},error=>{
    console.log(error)
    this.error=error ; 
    this.isLoading=false;
}); 
  }
;

f.reset();
}
 
}