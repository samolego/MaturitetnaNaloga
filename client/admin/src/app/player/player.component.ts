import { ViewChild } from '@angular/core';
import { QueryList } from '@angular/core';
import { ViewChildren } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { Avatar } from './Avatar';
import { MouthType } from './Avatar';
import { EyeType } from './Avatar';
import { Decoration } from './Avatar';
import { AppComponent } from '../app.component';

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
  avatar: Avatar;
  EyeType = EyeType;
  MouthType = MouthType;
  Decoration = Decoration;
  @ViewChildren("avatarPlayerCanvas")
  avatarPlayerCanvases: QueryList<ElementRef<HTMLCanvasElement>>;

  @ViewChildren("avatarCanvasWise") 
  avatarCanvasesWise: QueryList<ElementRef<HTMLCanvasElement>>;

  constructor() {
    this.socket = io(AppComponent.getSocketAddress());
    this.now = new Date();

    // Default settings
    this.settings = {
      enableAnswers: true
    }
  }

  ngAfterViewInit() {
    this.avatarPlayerCanvases.forEach(item => {
      console.log(item.nativeElement);
      this.avatar.draw(item.nativeElement);
    });

    this.avatarPlayerCanvases.changes.subscribe(c => {
      c.toArray().forEach(item => {
        console.log(item.nativeElement);
        this.avatar.draw(item.nativeElement);
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

  ngOnInit(): void {
    this.player = localStorage.getItem("player");
    if(this.player != null) {
      this.player = JSON.parse(this.player);
      this.avatar = new Avatar(this.player.avatar.baseColor, this.player.avatar.eyesType, this.player.avatar.mouthType, this.player.avatar.decoration);

      if(this.player.expiry > this.now.getTime() + 1) {
        this.player = null;
      }
    } else {
      this.avatar = new Avatar("#e66465", EyeType.SMALL, MouthType.DEFAULT, Decoration.DEFAULT);
    }



    // Socket events
    this.socket.on('wisePlayersS2CPlayer', (data) => {
      this.wisePlayers = data;
    });


    
    this.socket.on('clientSettingsS2CPlayer', (data) => {
      this.settings = data;
    });


    this.socket.on('createPlayerS2CPlayer', (status) => {
      if(status === "fail") {
        this.player = null;
        this.error = true;
        return;
      }
      this.player = {}
      this.player.name = (<HTMLInputElement> document.getElementById("nameInput")).value;
      this.player.expiry = this.now.getTime() + 1;
      this.player.avatar = this.avatar;
      this.error = false;
      localStorage.setItem("player", JSON.stringify(this.player));
      
      this.avatarPlayerCanvases.forEach(item => {
        this.avatar.draw(item.nativeElement);
      });
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
    const name = (<HTMLInputElement> document.getElementById("nameInput")).value;
    console.log(JSON.stringify(this.avatar));
    if(name != null && name != "") {
          const body = {
          playername: name,
          avatar: JSON.stringify(this.avatar)
        }
        this.socket.emit('createPlayerC2SPlayer', body);
    }
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

  changeColor(newColor) {
    this.avatar.baseColor = newColor;
    this.avatarPlayerCanvases.forEach(item => {
      this.avatar.draw(item.nativeElement);
    });
  }

  changeEyes(newEyes) {
    this.avatar.eyesType = newEyes;
    this.avatarPlayerCanvases.forEach(item => {
      this.avatar.draw(item.nativeElement);
    });
  }

  changeMouth(newMouth) {
    this.avatar.mouthType = newMouth;
    this.avatarPlayerCanvases.forEach(item => {
      this.avatar.draw(item.nativeElement);
    });
  }

  changeDecoration(newDecoration) {
    this.avatar.decoration = newDecoration;
    this.avatarPlayerCanvases.forEach(item => {
      this.avatar.draw(item.nativeElement);
    });
  }
}
