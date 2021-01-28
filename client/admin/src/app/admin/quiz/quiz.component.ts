import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {
    const token = localStorage.getItem("ACCESS_TOKEN");
    this.socket = io(SOCKET_ENDPOINT, {query: {token}});
  }

  ngOnInit(): void {

    // Socket connection
    this.socket.on('connect', () => {
      this.socket.emit('refreshPlayersC2S');
    });


    // Socket events
    this.socket.on('refreshPlayersS2C', data => {
      console.log("Refrshing players.");
      this.players = data;
    });

    // Invalidating token
    this.socket.on('invalidTokenS2CAdmin', () => {
      localStorage.setItem('ACCESS_TOKEN', null);
      this.router.navigateByUrl('/login');
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
