import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {io} from 'socket.io-client';
import {ApiService} from '../../services/api.service';
import {HttpClient} from "@angular/common/http";
import { v4 as uuidv4 } from 'uuid';



export interface ISentMessage{
  text:string,
  audioId?:string
}

export interface IMessage {
  username: string,
  text: string,
  audioId?:string,
  time?: Date
}

@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})

export class ChatInboxComponent implements OnInit {

  SOCKET_ENDPOINT = 'localhost:3000';
  socket;
  messageInput;

  myCounter = 0;
  otherCounter = 10000;

  recording = false;

  @Input()
  changeRoomEvent : EventEmitter<any>

  @Input()
  newRoomEvent: EventEmitter<any>

  @Input()
  username = "support";

  @Input()
  isSupport = false;

  roomName:string

  constructor(private apiService: ApiService,
              private http: HttpClient) {
  }

  async ngOnInit() {
    this.socket = io(this.SOCKET_ENDPOINT);
    this.updateNewRoom();
    if(!this.isSupport){
      this.setupSocketConnection();
    }else{
      this.changeRoomEvent.subscribe(event=>{
        this.socket.disconnect();
        this.socket.close();
        this.socket = io(this.SOCKET_ENDPOINT);
        this.setupSocketConnection(event);
        this.showMessages(event);
        this.updateNewRoom();
        setTimeout(()=>{this.newRoomEvent.emit()}, 100)
      });
    }
  }

  recorder() {
    if(this.recording === true) {
      this.stopRecording();
  this.recording = false;
    } else {
      this.startRecording();
      this.recording = true;
    }
  }

  updateNewRoom(){
    this.socket.on("newRoom", param=>{
      if(this.isSupport){
        this.newRoomEvent.emit();
      }
    })
  }

  SendMessage(audioId?:string) {
      this.socket.emit('chatMessage', {text:this.messageInput,audioId:audioId});
      this.messageInput = '';
  }

  showMyMessage(data: IMessage){
    let element = document.createElement('li');
    if(!data.text){
      element.innerHTML="";
    }else{
      element.innerHTML =  data.text;
    }
    if(data.audioId){
      this.myCounter+=1;
      let audio = document.createElement("audio");
      let source = document.createElement("source");
      source.setAttribute('src','http://localhost:3000/api/assets/'+data.audioId)
      audio.setAttribute("id","audio"+this.myCounter)
      audio.appendChild(source)
      audio.setAttribute("controls","controls")
      audio.style.width= "160px";
      element.appendChild(audio)
    }
    element.style.background = '#0F5298';
    element.style.color = "white";
    element.style.padding =  '15px 44px';
    element.style.margin = '10px';
    element.style.textAlign = 'right';
    element.style.borderRadius = "10px";
    element.style.float ="right";
    element.style.wordBreak = "break-word";
    const time = document.createElement('div');
    element.addEventListener("mouseenter", function(event){

      time.innerHTML = new Date(data.time).getHours().toString()+":"+new Date(data.time).getMinutes().toString();
      time.style.background = '#b0b0b0';
      time.style.color = "white";
      time.style.fontSize = "12px";
      time.style.padding =  '3px 8px';
      time.style.margin = '13px';
      time.style.opacity = "0.8";
      time.style.textAlign = 'right';
      time.style.borderRadius = "0px 0px 10px 10px";
      time.style.position = "absolute";
      time.style.right = "43px";
      time.style.wordBreak = "break-word";
      element.appendChild(time);
    },false);

    element.addEventListener("mouseout", function( event ) {
      // element.removeChild(time);

    }, false);
    element.style.display = "inline-block"
    document.getElementById('message-list').appendChild(element);
  }

  showOthersMessage(data: IMessage){
    const element = document.createElement('li');
    if(!data.text){
      element.innerHTML="";
    }else{
      element.innerHTML =  data.text;
    }
    if(data.audioId){
      this.otherCounter+=1
      let audio = document.createElement("audio");
      let source = document.createElement("source");
      source.setAttribute('src','http://localhost:3000/api/assets/'+data.audioId)
      audio.appendChild(source)
      audio.setAttribute("id","audio"+this.otherCounter)
      audio.setAttribute("controls","controls")
      audio.style.width= "160px";
      element.appendChild(audio)
    }
    element.style.background = "#E8E8E8";
    element.style.padding =  '15px 30px';
    element.style.margin = '10px';
    element.style.borderRadius = "10px";
    element.style.textAlign = 'left';
    element.style.float ="left";
    element.style.wordBreak = "break-word";
    const time = document.createElement('div');
    element.addEventListener("mouseenter", function(event){

      time.innerHTML = new Date(data.time).getHours().toString()+":"+new Date(data.time).getMinutes().toString();
      time.style.background = '#b0b0b0';
      time.style.color = "white";
      time.style.fontSize = "12px";
      time.style.padding =  '3px 15px';
      time.style.margin = '10px';
      time.style.opacity = "0.8";
      time.style.textAlign = 'left';
      time.style.borderRadius = "0px 0px 10px 10px";
      time.style.position = "absolute";
      time.style.left = "43px";
      time.style.wordBreak = "break-word";
      element.appendChild(time);
    },false);

    element.addEventListener("mouseout", function( event ) {
      // element.removeChild(time);

    }, false);
    document.getElementById('message-list').appendChild(element);
  }

  setupSocketConnection(roomName?:string) {
    document.getElementById('message-list').innerHTML = "";

    if(this.isSupport){
      this.socket.emit('joinRoom', { username: this.username, room: roomName , isSupport:this.isSupport,supportId: localStorage.getItem("supportId")});
    }else{
      this.socket.emit('joinRoom', { username: this.username , isSupport:this.isSupport});
    }
    this.socket.on('message', (data: IMessage) => {
      if (this.username == data.username) {
        this.showMyMessage(data)
      }else {
        this.showOthersMessage(data);
      }
    });
  }

  isShown:boolean = false;
  showOrHide() {
    this.isShown = !this.isShown;
    if(this.isShown){
      [].forEach.call(document.querySelectorAll('.chat-messages'), function (el) {
        el.style.display = 'none';
      });
    }else{
      [].forEach.call(document.querySelectorAll('.chat-messages'), function (el) {
        el.style.display = '';
      });
    }
  }

    leave(){
      this.socket.disconnect();
    }

  async showMessages(roomName:string){
    const messages:any[] = await this.getRoomMessages(roomName) || [];
    messages.forEach((message)=>{
      if(message.messages.username == "guest"){
        this.showOthersMessage(message.messages)
      }else{
        this.showMyMessage(message.messages)
      }
    })
  }

  async getRoomMessages(roomName:string){
    return await this.apiService.get('/chatmessage/'+roomName).toPromise();
  }


  // @ts-ignore
  mediaRecorder: MediaRecorder|null = null;
  dataAvailableEvent = (ev) => this.handleDataAvailable(ev);

  async startRecording() {
    if(this.mediaRecorder != null) {
      this.mediaRecorder.removeEventListener("dataavailable", this.dataAvailableEvent);
      this.mediaRecorder = null;
    }

    let mediaStream = await navigator.mediaDevices.getUserMedia({audio:true});
      let localAudio:HTMLAudioElement = document.getElementById('local_audio') as HTMLAudioElement;
      localAudio.srcObject = mediaStream;
      const options = { mimeType: "audio/webm;"};
      // @ts-ignore
      this.mediaRecorder = new MediaRecorder(mediaStream, options);
      this.mediaRecorder.ondataavailable = this.dataAvailableEvent;
      this.mediaRecorder.start();

  }
  stopRecording() {
    if(this.mediaRecorder == null) {
      return;
    }
    this.mediaRecorder.stop();
  }

  private handleDataAvailable(ev) {
    if (ev.data.size <= 0) {
      return;
    }
    this.download(ev.data);
  }
  async download(blob: Blob) {
   let file:any =  await this.uploadFile(blob)
    this.SendMessage(file.gridFsId)
  }

  async uploadFile(blob: Blob){
    const formData = new FormData();
    formData.append('file', blob,uuidv4())
    const urlUpload = "http://localhost:3000/chatmessage/"+this.socket.id;
    return await this.http.post(urlUpload,formData).toPromise();
  }
}
