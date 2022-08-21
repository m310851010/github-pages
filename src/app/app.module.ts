import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackstretchComponent } from './backstretch/backstretch.component';
import { BirdComponent } from './bird/bird.component';
import { TypedComponent } from './typed/typed.component';
import { BannerInfoComponent } from './banner-info/banner-info.component';

@NgModule({
  declarations: [AppComponent, BackstretchComponent, BackstretchComponent, BirdComponent, TypedComponent, BannerInfoComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
