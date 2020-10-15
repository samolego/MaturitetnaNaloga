import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass']
})
export class QuizComponent implements OnInit {
  showAnswers;
  players = [{"name": "Eno zelo dolgo ime ...", "time": 5, "points": 5, "answer": "Krava Milka"}, {"name": "Gabrijel", "time": 10, "points": 15,  "answer": "Sovica Oka"}];

  constructor() { }

  ngOnInit(): void {
  }

  async toggleAnswers() {
    this.showAnswers = !this.showAnswers;
  }

  async addPoints(index, points) {
    this.players[index].points += points;
  }
  async sortByScore() {
    this.players.sort((a, b) => {
      return b.points - a.points;
    });
  }
}
