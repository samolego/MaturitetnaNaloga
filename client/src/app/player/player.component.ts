import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  player;
  now;
  error: boolean;
  showAnswerMessage;
  playerScores = [{"name": "Samo", "time": 5}, {"name": "Gabrijel", "time": 10}];
  settings = {"enableAnswers": true, "time": 5};

  constructor(private http: HttpClient) {
    this.now = new Date();
  }

  ngOnInit(): void {

    this.player = localStorage.getItem("player");
    if(this.player != null) {
      this.player = JSON.parse(this.player);

      if(this.player.expiry > this.now.getTime() + 1) {
        this.player = null;
      }
    }
  }

  async login() {
    // Sending to DB
    const name = (<HTMLInputElement> document.getElementById("nameInput")).value;
    const body = {
      playername: name,
      isMale: (<HTMLInputElement> document.querySelector('input[name = "radioGender"]:checked')).id === "radioGenderMale"
    }
    this.http.post<any>("http://localhost:3000/api/player/create", body).subscribe(data => {      
      if(data.status === "fail") {
        this.player = null;
        this.error = true;
        return;
      }
      this.player = {
        name: name,
        expiry: this.now.getTime() + 1,
      }
      this.error = false;
      localStorage.setItem("player", JSON.stringify(this.player));
    },
    error => {
      console.log(error);
    });
  }

  async postAnswer() {
    this.showAnswerMessage = true;
    setTimeout(() => this.showAnswerMessage = false, 600);
    const answer = (<HTMLInputElement> document.getElementById("answerField"));
    this.http.post<any>("http://localhost:3000/api/player/answer", { answer: answer.value }).subscribe(data => {      
      if(data.status === "fail") {
        this.error = true;
        return;
      }
      console.log(data);
      this.error = false;
    },
    error => {
      console.log(error);
    });

    answer.value = null;
  }
}
