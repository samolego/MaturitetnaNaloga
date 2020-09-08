import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './admin/auth/auth.component';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { QuizComponent } from './admin/quiz/quiz.component';
import { StatsComponent } from './admin/stats/stats.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AdminComponent,
    PlayerComponent,
    SettingsComponent,
    QuizComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
