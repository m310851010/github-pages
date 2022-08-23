import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TypedComponent } from '../../typed/typed.component';
import { BannerInfoComponent } from '../../banner-info/banner-info.component';

@NgModule({
  declarations: [HomeComponent, TypedComponent, BannerInfoComponent],
  imports: [CommonModule, HomeRoutingModule]
})
export class HomeModule {}
