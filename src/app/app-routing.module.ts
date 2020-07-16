import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerComponent } from './player/player.component';

import { AuthComponent } from './admin/auth/auth.component';
import { AdminComponent } from './admin/admin.component';

import { AuthGuard } from './admin/auth/auth.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'player'},
  { path: 'player', component: PlayerComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'player'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
