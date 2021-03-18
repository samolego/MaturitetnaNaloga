import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerComponent } from './player/player.component';
import { AuthComponent } from './admin/auth/auth.component';
import { AuthGuard } from './admin/auth/auth.guard';
import { QuizComponent } from './admin/quiz/quiz.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { StatsComponent } from './admin/stats/stats.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'player'},
  { path: 'player', component: PlayerComponent },
  { path: 'quiz', redirectTo: "quiz/main", canActivate: [AuthGuard] },
  { path: 'quiz/main', component: QuizComponent, canActivate: [AuthGuard] },
  { path: 'quiz/settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'quiz/stats', component: StatsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'player'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
