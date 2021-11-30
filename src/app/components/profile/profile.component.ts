import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {IMessage} from '../chat-inbox/chat-inbox.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  activate = "activate";
  available = true;
  name= "asd123";
  rooms = [];
  displayedColumns: string[] = ['name','newMessages','participants','important','helpNeeded', 'createdAt', 'Action1','Action2'];
  changeRoomEvent : EventEmitter<any> = new EventEmitter<any>();
  newRoomEvent : EventEmitter<any> = new EventEmitter<any>();
  newMessage: number;
  participants: number;
  important = false;
  assistanceNeeded = false;

  constructor(private apiService: ApiService,  private route: Router) {
    this.getRooms();
  }

  ngOnInit(): void {
    this.subscribeUpdate();
  }

  subscribeUpdate(){
    this.newRoomEvent.subscribe(param=>{
      setTimeout(()=>{this.getRooms()},100);
    })
  }

  getRooms(){
    this.apiService.get('/rooms').toPromise().then(res=>{
      this.rooms = res;
    })
  }

  async changeActivation() {
    this.available = !this.available
    await this.apiService.post('/users/'+this.name, {isAvailable:this.available}).toPromise();
  }

  logout() {
    localStorage.setItem("token","");
    this.route.navigate(['/login'])
  }

  async joinRoom(socketId: any) {
    this.changeRoomEvent.emit(socketId);
  }

  closeRoom(socketId: any) {
    this.apiService.put('/rooms/'+socketId,{isActive:false}).toPromise().then(param=>{
      this.getRooms();
    });
  }

  async changeStatus(roomName:string){
    this.important = !this.important
    await this.apiService.put('/importantRooms/'+roomName, {isImportant:this.important}).toPromise();
    this.getRooms();
  }

  async changeAssistanceStatus(roomName:string){
    this.assistanceNeeded = !this.assistanceNeeded
    await this.apiService.put('/assistanceRooms/'+roomName, {assistanceNeeded:this.assistanceNeeded}).toPromise();
    this.getRooms();
  }


}
