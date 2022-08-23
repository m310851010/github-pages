import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xxmagic-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly images = ['1', '2', '3'].map(v => this.getImage(v));

  ngOnInit(): void {

  }

  getImage(name: string): string {
    return `./assets/images/backgrounds/${name}.jpg`;
  }

}
