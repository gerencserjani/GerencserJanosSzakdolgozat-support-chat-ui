import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private apiService: ApiService, private route: Router) { }

  ngOnInit(): void {
  }


  onSubmit() {
    this.login(this.loginForm.value.username, this.loginForm.value.password);

  }
  async login(name,password){
    await this.apiService.post('/login',{name,password}).toPromise().then((result)=>{
      if(result?.token){

        localStorage.setItem("token",result?.token);
        localStorage.setItem("supportId",result?.supportId);
        this.route.navigate(['/profile'])
      }
      console.log(result)
    });

  }


}
