import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'localhost:4444';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass']
})
export class QuizComponent implements OnInit {
  showAnswers;
  players;
  socket: any;

  constructor() {
    this.socket = io(SOCKET_ENDPOINT);
  }

  ngOnInit(): void {

    this.socket.on('connect', () => {
      this.socket.emit('refreshPlayersC2S');
    });


    this.socket.on('refreshPlayersS2C', data => {
      console.log("Refrshing players.");
      this.players = data;
    });
  }

  async toggleAnswers() {
    this.showAnswers = !this.showAnswers;
  }

  async addPoints(index, points) {
    this.players[index].points += points;

    if(this.socket.connected) {
      this.socket.emit('pointsC2S', {"id": this.players[index].id, "points": points});
    }
    else {
      alert("Data couldn't be sent!")
    }
  }


  async sortByScore() {
    this.players.sort((a, b) => {
      return b.points - a.points;
    });
  }

  async clearAnswers() {
    if(this.socket.connected) {
      console.log(this.players);

      for(let i = 0; i < this.players.length; ++i) {
        this.players[i].answerValue = null;
      }
      this.socket.emit('clearAnswersC2S');
    }
    else {
      alert("Data couldn't be sent!")
    }
  }
}
