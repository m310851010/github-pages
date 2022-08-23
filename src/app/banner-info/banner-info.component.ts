import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xxmagic-banner-info',
  templateUrl: './banner-info.component.html',
  styleUrls: ['./banner-info.component.scss'],
  host: {
    '[class.banner-info-container]': 'true'
  }
})
export class BannerInfoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
