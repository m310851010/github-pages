import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, fromEvent, Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'xxmagic-backstretch',
  templateUrl: './backstretch.component.html',
  styleUrls: ['./backstretch.component.scss']
})
export class BackstretchComponent implements OnInit, OnDestroy {
  /**
   * 所有图片地址
   */
  @Input() images: string[] = [];
  /**
   * 播放时间间隔(单位:ms), 默认 3000
   */
  @Input() duration?: number;
  /**
   * 动画过渡时长(单位:ms), 默认 750
   */
  @Input() fade?: number;

  /**
   * 当前播放图片索引
   */
  @Input() index = 0;

  /**
   * 动画播放速度
   * @private
   */
  private get fadeIfy(): number {
    return this.fade || 750;
  }

  /**
   * 动画样式
   */
  get transitionStyle() {
    return `opacity ${this.fadeIfy / 1000}s linear`;
  }

  /**
   * 显示的图片列表
   */
  list: BackstretchInfo[] = [];
  /**
   * 容器样式
   */
  wrapStyle: Record<string, any> = {};
  /**
   * 当前显示的图片信息
   */
  current?: BackstretchInfo;

  private subject$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.subject$),
        filter(() => !!this.current)
      )
      .subscribe(() => this.resize(this.current!));

    timer(0, this.duration || 3000)
      .pipe(takeUntil(this.subject$))
      .subscribe(this.nextImage.bind(this));
  }

  /**
   * 切换到下一张图片
   */
  nextImage() {
    if (this.index === this.images.length) {
      this.index = 0;
    }
    this.current = { image: this.images[this.index++], ratio: 0, imageStyle: null };
    this.list.push(this.current);
  }

  /**
   * resize 修改图片样式
   * @param info BackstretchInfo
   */
  resize(info: BackstretchInfo): void {
    const bgCSS = { left: '0', top: '0' };
    const rootWidth = window.innerWidth;
    const rootHeight = window.innerHeight;
    let bgOffset: number;
    let bgWidth = rootWidth;
    let bgHeight = bgWidth / info.ratio;

    if (bgHeight >= rootHeight) {
      bgOffset = (bgHeight - rootHeight) / 2;
      bgCSS.top = `-${bgOffset}px`;
    } else {
      bgHeight = rootHeight;
      bgWidth = bgHeight * info.ratio;
      bgOffset = (bgWidth - rootWidth) / 2;
      bgCSS.left = `-${bgOffset}px`;
    }

    this.wrapStyle = { width: `${rootWidth}px`, height: `${rootHeight}px` };
    info.imageStyle = { width: `${bgWidth}px`, height: `${bgHeight}px`, ...bgCSS };
  }

  /**
   * 图片加载完成
   * @param img image dom
   * @param info 当前信息
   */
  onImageLoad(img: HTMLImageElement, info: BackstretchInfo) {
    info.ratio = img.width / img.height;
    info.show = true;
    this.resize(info);

    timer(this.fadeIfy)
      .pipe(filter(() => this.list.length > 1))
      .subscribe(() => this.list.shift());
  }

  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }
}

export interface BackstretchInfo {
  /**
   * 图片地址
   */
  image?: string;
  /**
   * 图片样式
   */
  imageStyle: Record<string, any> | null;
  /**
   * 高和宽比例
   */
  ratio: number;
  /**
   * 是否显示
   */
  show?: boolean;
}
