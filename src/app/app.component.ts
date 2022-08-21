import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'xxmagic-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly images = ['1', '2', '3'].map(v => this.getImage(v));
  scrollTop?: boolean;
  expanded = false;
  collapsing = false;
  ngOnInit(): void {
    fromEvent(window, 'scroll').subscribe(() => {
      this.scrollTop = window.scrollY > 30;
    });
  }

  getImage(name: string): string {
    return `./assets/images/backgrounds/${name}.jpg`;
  }

  onToggleClick(navbarCollapse: HTMLDivElement) {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.collapsing = true;
      const height = navbarCollapse.clientHeight;
      setTimeout(() => {
        this.collapsing = false;
      }, 300);
    }
  }
}
