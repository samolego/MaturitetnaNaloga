import { ViewChildren } from '@angular/core';
import { QueryList } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { Avatar } from 'src/app/player/Avatar';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass']
})
export class QuizComponent implements OnInit {
  showAnswers;
  players;
  wisePlayers; // Players who have answered :)
  socket: any;

  @ViewChildren("avatarCanvas") 
  avatarCanvases: QueryList<HTMLCanvasElement>;
  @ViewChildren("avatarCanvasWise") 
  avatarCanvasesWise: QueryList<HTMLCanvasElement>;	

  constructor(private router: Router) {
    const token = localStorage.getItem("ACCESS_TOKEN");
    this.socket = io(AppComponent.getSocketAddress(), {query: {token}});
  }

  ngOnInit(): void {

    // Socket connection
    this.socket.on('connect', () => {
      this.socket.emit('refreshPlayersC2SAdmin');
      this.socket.emit('wisePlayersC2SPlayer');
    });


    // Socket events
    this.socket.on('refreshPlayersS2CAdmin', data => {
      this.players = data;
    });

    // Invalidating token
    this.socket.on('invalidTokenS2CAdmin', () => {
      localStorage.setItem('ACCESS_TOKEN', null);
      this.router.navigateByUrl('/login');
    });

    this.socket.on('wisePlayersS2CPlayer', (data) => {
      this.wisePlayers = data;
    });
  }

  ngAfterViewInit() {
    this.avatarCanvases.changes.subscribe(c => {
      c.toArray().forEach((item, i) => {
        let parsed = JSON.parse(this.players[i].avatarString);
        let avatar: Avatar = new Avatar(parsed.baseColor, parsed.eyesType, parsed.mouthType, parsed.decoration);
        avatar.draw(item.nativeElement);
      });      
    });

    this.avatarCanvasesWise.changes.subscribe(c => {
      c.toArray().forEach((item, i) => {
        let parsed = JSON.parse(this.wisePlayers[i].avatarString);
        let avatar: Avatar = new Avatar(parsed.baseColor, parsed.eyesType, parsed.mouthType, parsed.decoration);
        avatar.draw(item.nativeElement);
      });      
    });
  }

  async toggleAnswers() {
    this.showAnswers = !this.showAnswers;
  }

  async addPoints(index, points) {
    this.players[index].points += points;

    if(this.socket.connected) {
      this.socket.emit('pointsC2SAdmin', {"id": this.players[index].id, "points": points});
    }
    else {
      alert("Data couldn't be sent!")
    }
  }


  async sortByScore() {
    this.players.sort((a, b) => {
      return b.points - a.points;
    });

    this.socket.emit("sortPlayersC2SAdmin");
  }

  async clearAnswers() {
    if(this.socket.connected) {
      this.showAnswers = false;
      (<HTMLInputElement> document.getElementById("answersSwitch")).checked = false;
      console.log(this.players);

      for(let i = 0; i < this.players.length; ++i) {
        this.players[i].answerValue = null;
      }
      this.socket.emit('clearAnswersC2SAdmin');
    }
    else {
      alert("Data couldn't be sent!")
    }
  }



  getDate(stringDate) {
    let otherDate = new Date(stringDate);
    if(this.wisePlayers[0].answerDate == null) {
      return null;
    }
    let timeDelta = otherDate.getTime() - new Date(this.wisePlayers[0].answerDate).getTime();
    if(timeDelta == 0) {
      return "";
    }

    return "(" + timeDelta / 1000 + "s)";
  }
}
