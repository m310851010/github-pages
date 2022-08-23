import { Component, OnInit } from '@angular/core';
import { delay, fromEvent, tap, timer } from 'rxjs';

@Component({
  selector: 'xxmagic-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  /**
   * 是否滚动到顶部
   */
  scrollTop?: boolean;
  /**
   * 是否展开
   */
  expanded = false;
  /**
   * 是否展开中
   */
  collapsing = false;
  /**
   * 是否折叠完成
   */
  collapsed = false;
  /**
   * 是否显示完成
   */
  showdown = false;
  constructor() {}

  ngOnInit(): void {
    fromEvent(window, 'scroll').subscribe(() => (this.scrollTop = window.scrollY > 40));
  }

  /**
   * 切换导航菜单点击事件
   * @param navbarCollapse 菜单dom
   */
  onToggleClick(navbarCollapse: HTMLDivElement) {
    if (this.collapsing) {
      return;
    }

    this.expanded = !this.expanded;
    if (this.expanded) {
      this.collapsing = true;
      timer(0)
        .pipe(
          tap(() => (navbarCollapse.style.height = `${navbarCollapse.scrollHeight}px`)),
          delay(300)
        )
        .subscribe(() => {
          this.collapsing = false;
          this.collapsed = true;
        });
    } else {
      this.collapsing = true;
      this.showdown = true;
      this.collapsed = false;
      timer(0)
        .pipe(
          tap(() => (navbarCollapse.style.height = '0')),
          delay(500)
        )
        .subscribe(() => {
          this.collapsing = false;
          this.showdown = false;
          navbarCollapse.style.height = '';
        });
    }
  }
}
