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
  collapsed = false;
  showdown = false;
  ngOnInit(): void {
    fromEvent(window, 'scroll').subscribe(() => {
      this.scrollTop = window.scrollY > 30;
    });
  }

  getImage(name: string): string {
    return `./assets/images/backgrounds/${name}.jpg`;
  }

  onToggleClick(navbarCollapse: HTMLDivElement) {
    if (this.collapsing) {
      return;
    }

    this.expanded = !this.expanded;
    if (this.expanded) {
      this.collapsing = true;
      setTimeout(() => (navbarCollapse.style.height = `${navbarCollapse.scrollHeight}px`));
      setTimeout(() => ((this.collapsing = false), (this.collapsed = true)), 300);
    } else {
      this.collapsing = true;
      this.showdown = true;
      this.collapsed = false;
      setTimeout(() => (navbarCollapse.style.height = '0'));
      setTimeout(() => ((this.collapsing = false), (this.showdown = false), (navbarCollapse.style.height = '')), 500);
    }
  }
}
