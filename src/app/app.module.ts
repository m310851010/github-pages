import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackstretchComponent } from './backstretch/backstretch.component';
import { BirdComponent } from './bird/bird.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [AppComponent, BackstretchComponent, BirdComponent, NavComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
