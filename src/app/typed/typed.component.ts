import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'xxmagic-typed',
  templateUrl: './typed.component.html',
  styleUrls: ['./typed.component.scss']
})
export class TypedComponent implements OnInit {
  // List of sentences
  _CONTENT = [
    'Twinkle, twinkle, little star',
    'How I wonder what you are',
    'Up above the world so high',
    'Like a diamond in the sky'
  ];

  // Current sentence being processed
  _PART = 0;

  // Character number of the current sentence being processed
  _PART_INDEX = 0;

  // Holds the handle returned from setInterval
  _INTERVAL_VAL = 0;

  @ViewChild('typedContainer', { static: true }) private typedContainer!: ElementRef<HTMLDivElement>;
  private _ELEMENT!: HTMLDivElement;
  private _CURSOR!: HTMLDivElement;

  constructor() {}

  ngOnInit(): void {
    const element = this.typedContainer.nativeElement;
    this._ELEMENT = element.querySelector('.text')!;
    this._CURSOR = element.querySelector('.cursor')!;
    this._INTERVAL_VAL = setInterval(this.Type.bind(this), 100);
  }

  // Implements typing effect
  Type() {
    // Get substring with 1 characater added
    var text = this._CONTENT[this._PART].substring(0, this._PART_INDEX + 1);
    this._ELEMENT.innerHTML = text;
    this._PART_INDEX++;

    // If full sentence has been displayed then start to delete the sentence after some time
    if (text === this._CONTENT[this._PART]) {
      // Hide the cursor
      this._CURSOR.style.display = 'none';

      clearInterval(this._INTERVAL_VAL);
      setTimeout(() => {
        this._INTERVAL_VAL = setInterval(this.Delete.bind(this), 50);
      }, 1000);
    }
  }

  // Implements deleting effect
  Delete() {
    // Get substring with 1 characater deleted
    const text = this._CONTENT[this._PART].substring(0, this._PART_INDEX - 1);
    this._ELEMENT.innerHTML = text;
    this._PART_INDEX--;

    // If sentence has been deleted then start to display the next sentence
    // tslint:disable-next-line:triple-equals
    if (text == '') {
      clearInterval(this._INTERVAL_VAL);

      // If current sentence was last then display the first one, else move to the next
      if (this._PART === this._CONTENT.length - 1) this._PART = 0;
      else this._PART++;

      this._PART_INDEX = 0;

      // Start to display the next sentence after some time
      setTimeout(() => {
        this._CURSOR.style.display = 'inline-block';
        this._INTERVAL_VAL = setInterval(this.Type.bind(this), 100);
      }, 200);
    }
  }
}
