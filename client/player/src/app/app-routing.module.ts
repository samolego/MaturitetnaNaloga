import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerComponent } from './player/player.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game'},
  { path: 'game', component: PlayerComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'game'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
