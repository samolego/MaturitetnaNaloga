import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizComponent } from './admin/quiz/quiz.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { StatsComponent } from './admin/stats/stats.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'quiz', redirectTo: "quiz/main" },
  { path: 'quiz/main', component: QuizComponent },
  { path: 'quiz/settings', component: SettingsComponent },
  { path: 'quiz/stats', component: StatsComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'quiz/main'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
