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
  wisePlayers;
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

    this.socket.on('wisePlayersS2CPlayer', (data) => {
      console.log("wisePlayersS2CPlayer");
      this.wisePlayers = data;
    });


    
    this.socket.on('clientSettingsS2CPlayer', (data) => {
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
    this.socket.emit('writeAnswerC2SPlayer', answer.value);
    answer.value = null;
  }

  getDate(stringDate) {
    let otherDate = new Date(stringDate);
    if(this.wisePlayers[0].answerDate == null) {
      return null;
    }
    let timeDelta = otherDate.getTime() - new Date(this.wisePlayers[0].answerDate).getTime();
    if(timeDelta == 0) {
      return "first";
    }

    return timeDelta / 1000 + "s";
  }
}
