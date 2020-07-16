import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  playername

  constructor() { }

  ngOnInit(): void {
    this.playername = localStorage.getItem("playername");
  }

  async login() {
    this.playername = (<HTMLInputElement> document.getElementById("nameInput")).value;
    console.log(this.playername);
    localStorage.setItem("playername", this.playername);
  }

}
