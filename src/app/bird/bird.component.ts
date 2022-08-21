import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xxmagic-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})
export class BirdComponent implements OnInit {
  @Input() @HostBinding('style.height') height = '400px';
  @HostBinding('class.container-box') containerBox = true;

  constructor() {}

  ngOnInit(): void {}
}
