import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'localhost:4444';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.sass']
})
export class PlayerComponent implements OnInit {
  socket;
  player;
  now;
  playerScores;
  settings;
  error: boolean;
  showAnswerMessage: boolean;
  answerFailed: boolean;

  constructor() {
    this.socket = io(SOCKET_ENDPOINT);
    this.now = new Date();

    // Default settings
    this.settings = {
      enableAnswers: true
    }
  }

  ngOnInit(): void {

    this.player = localStorage.getItem("player");
    if(this.player != null) {
      this.player = JSON.parse(this.player);

      if(this.player.expiry > this.now.getTime() + 1) {
        this.player = null;
      }
    }

    this.socket.on('playerAnswersS2C', (data) => {
      this.playerScores = data;
    });


    
    this.socket.on('clientSettingsS2C', (data) => {
      this.settings = data;
    });

    this.socket.on('createPlayerS2CPlayer', (status) => {
      if(status === "fail") {
        this.player = {};
        this.error = true;
        return;
      }
      this.player.expiry = this.now.getTime() + 1;
      this.error = false;
      localStorage.setItem("player", JSON.stringify(this.player));
    });



    this.socket.on('writeAnswerS2CPlayer', (status) => {
      if(status === "fail") {
        this.answerFailed = true;
        setTimeout(() => this.answerFailed = false, 600);
        return;
      }
      this.error = false;
      this.showAnswerMessage = true;
      setTimeout(() => this.showAnswerMessage = false, 600);
    });
  }

  async login() {
    // Sending to DB
    this.player = {};
    this.player.name = (<HTMLInputElement> document.getElementById("nameInput")).value;
    const body = {
      playername: this.player.name,
      isMale: (<HTMLInputElement> document.querySelector('input[name = "radioGender"]:checked')).id === "radioGenderMale"
    }
    this.socket.emit('createPlayerC2SPlayer', body);
  }



  async postAnswer() {
    const answer = (<HTMLInputElement> document.getElementById("answerField"));

        /*this.http.post<any>("http://localhost:3000/api/player/answer", { answer: answer.value }).subscribe(data => {      
      console.log(data);
      if(data.status === "fail") {
        this.answerFailed = true;
        setTimeout(() => this.answerFailed = false, 600);
        return;
      }
      this.error = false;
      this.showAnswerMessage = true;
      setTimeout(() => this.showAnswerMessage = false, 600);
    },
    error => {
      console.log(error);
    });*/
    this.socket.emit('writeAnswerC2SPlayer', answer.value);
    answer.value = null;
  }
}
