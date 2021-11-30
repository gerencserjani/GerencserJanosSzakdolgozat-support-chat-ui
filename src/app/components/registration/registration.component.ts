import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private apiService: ApiService,private route: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.registration(this.registrationForm.value.name, this.registrationForm.value.password);
  }
  async registration(name,password){
    await this.apiService.post('/registration',{name,password,roles:["support"]}).toPromise();
    this.route.navigate(['/login']);
  }
}
