import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { animationRoute } from './router.animations';

@Component({
  selector: 'xxmagic-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [animationRoute]
})
export class AppComponent implements OnInit {
  readonly images = ['1', '2', '3'].map(v => this.getImage(v));

  routerState = true;
  routerStateCode = 'active';

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // 每次路由跳转改变状态
        this.routerState = !this.routerState;
        this.routerStateCode = this.routerState ? 'active' : 'inactive';
      }
    });
  }

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet.activatedRouteData);
    return outlet.activatedRouteData['animation'];
  }

  getImage(name: string): string {
    return `./assets/images/backgrounds/${name}.jpg`;
  }
}
