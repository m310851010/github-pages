import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'xxmagic-typed',
  templateUrl: './typed.component.html',
  styleUrls: ['./typed.component.scss']
})
export class TypedComponent implements OnInit {
  /**
   * 内容类型, 默认html带格式打印
   */
  @Input() contentType: 'html' | 'text' = 'html';
  /**
   * 打印速速
   */
  @Input() typeSpeed = 0;
  @Input() startDelay = 0;
  /**
   * 删除的速速
   */
  @Input() backSpeed = 0;
  @Input() backDelay = 500;
  @Input() cursorChar = '|';

  @ViewChild('typedText', { static: true }) private _ELEMENTRef!: ElementRef<HTMLDivElement>;
  @ViewChild('typedCursor', { static: true }) private typedCursor!: ElementRef<HTMLDivElement>;
  private el!: HTMLDivElement;
  private cursor!: HTMLDivElement;

  constructor() {}

  strings: string[] = [
    'These are the default values...',
    'You know what you should do?',
    'Use your own!',
    'Have a great day!'
  ];
  sequence: number[] = [];
  @Input() loopCount!: number;
  @Input() fadeOutDelay = 500;
  arrayPos = 0;
  stopNum = 0;
  strPos = 0;
  curLoop = 0;
  stop = false;
  /**
   * 用fadeOut动画代替退格
   */
  @Input() fadeOut?: boolean;
  @Input() attr?: string;
  @Input() isInput?: boolean;
  @Input() loop?: boolean;
  fadeOutClass = 'typed-fade-out';
  onStringTyped = new EventEmitter<number>();
  callback = new EventEmitter<void>();
  preStringTyped = new EventEmitter<number>();

  stringsElement?: HTMLElement;

  ngOnInit(): void {
    this.el = this._ELEMENTRef.nativeElement;
    this.cursor = this.typedCursor.nativeElement;

    if (this.stringsElement) {
      this.strings = [];
      this.stringsElement.style.display = 'none';
      const strings = Array.prototype.slice.apply(this.stringsElement.children);
      strings.forEach(stringElement => this.strings.push(stringElement.innerHTML));
    }

    this.init();
  }

  timeout = 0;
  typewrite(curString: string, curStrPos: number) {
    if (this.stop === true) {
      return;
    }

    if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
      this.el.classList.remove(this.fadeOutClass);
      this.cursor.classList.remove(this.fadeOutClass);
    }

    const humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;

    // contain typing function in a timeout humanize'd delay
    this.timeout = setTimeout(() => {
      // check for an escape character before a pause value
      // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
      // single ^ are removed from string
      let charPause = 0;
      let substr = curString.substring(curStrPos);
      if (substr.charAt(0) === '^') {
        let skip = 1; // skip atleast 1
        if (/^\^\d+/.test(substr)) {
          substr = /\d+/.exec(substr)![0];
          skip += substr.length;
          charPause = parseInt(substr);
        }

        // strip out the escape character and pause value so they're not printed
        curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
      }

      if (this.contentType === 'html') {
        // skip over html tags while typing
        const curChar = curString.substring(curStrPos).charAt(0);
        if (curChar === '<' || curChar === '&') {
          let endTag = '';
          if (curChar === '<') {
            endTag = '>';
          } else {
            endTag = ';';
          }
          while (curString.substring(curStrPos + 1).charAt(0) !== endTag) {
            curStrPos++;
            if (curStrPos + 1 > curString.length) {
              break;
            }
          }
          curStrPos++;
        }
      }

      // timeout for any pause after a character
      this.timeout = setTimeout(() => {
        if (curStrPos === curString.length) {
          // fires callback function
          this.onStringTyped.emit(this.arrayPos);

          // is this the final string
          if (this.arrayPos === this.strings.length - 1) {
            // animation that occurs on the last typed string
            this.callback.emit();

            this.curLoop++;

            // quit if we wont loop back
            if (this.loop === false || this.curLoop === this.loopCount) return;
          }

          this.timeout = setTimeout(() => {
            this.backspace(curString, curStrPos);
          }, this.backDelay);
        } else {
          /* call before functions if applicable */
          if (curStrPos === 0) {
            this.preStringTyped.emit(this.arrayPos);
          }

          // start typing each new char into existing string
          // curString: arg, this.el.html: original text inside element
          const nextString = curString.substring(0, curStrPos + 1);
          if (this.attr) {
            this.el.setAttribute(this.attr, nextString);
          } else {
            if (this.isInput) {
              (this.el as HTMLInputElement).value = nextString;
            } else if (this.contentType === 'html') {
              this.el.innerHTML = nextString;
            } else {
              this.el.textContent = nextString;
            }
          }

          // add characters one by one
          curStrPos++;
          // loop the function
          this.typewrite(curString, curStrPos);
        }
        // end of character pause
      }, charPause);

      // humanized value for typing
    }, humanize);
  }

  backspace(curString: string, curStrPos: number) {
    if (this.stop === true) {
      return;
    }

    if (this.fadeOut) {
      this.initFadeOut();
      return;
    }

    // varying values for setTimeout during typing
    // can't be global since number changes each time loop is executed
    const humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;

    this.timeout = setTimeout(() => {
      if (this.contentType === 'html') {
        // skip over html tags while backspacing
        if (curString.substring(curStrPos).charAt(0) === '>') {
          // let tag = '';
          while (curString.substring(curStrPos - 1).charAt(0) !== '<') {
            // tag -= curString.substring(curStrPos).charAt(0);
            curStrPos--;
            if (curStrPos < 0) {
              break;
            }
          }
          curStrPos--;
          // tag += '<';
        }
      }

      // ----- continue important stuff ----- //
      // replace text with base text + typed characters
      this.replaceText(curString.substring(0, curStrPos));

      // if the number (id of character in current string) is
      // less than the stop number, keep going
      if (curStrPos > this.stopNum) {
        // subtract characters one by one
        curStrPos--;
        // loop the function
        this.backspace(curString, curStrPos);
      }
      // if the stop number has been reached, increase
      // array position to next string
      else if (curStrPos <= this.stopNum) {
        this.arrayPos++;

        if (this.arrayPos === this.strings.length) {
          this.arrayPos = 0;

          this.init();
        } else this.typewrite(this.strings[this.sequence[this.arrayPos]], curStrPos);
      }

      // humanized value for typing
    }, humanize);
  }

  init() {
    this.timeout = setTimeout(() => {
      for (let i = 0; i < this.strings.length; i++) {
        this.sequence[i] = i;
      }

        this.typewrite(this.strings[this.sequence[this.arrayPos]], this.strPos);
    }, this.startDelay);
  }

  // Adds a CSS class to fade out current string
  initFadeOut() {
    this.el.classList.add(this.fadeOutClass);
    this.cursor.classList.add(this.fadeOutClass);

    return setTimeout(() => {
      this.arrayPos++;
      if (this.arrayPos === this.strings.length) {
        this.arrayPos = 0;
      }
      this.replaceText('');
      this.typewrite(this.strings[this.sequence[this.arrayPos]], 0);
    }, this.fadeOutDelay);
  }

  // Replaces current text in the HTML element
  replaceText(str: string) {
    if (this.isInput) {
      (this.el as HTMLInputElement).value = str;
    } else if (this.contentType === 'html') {
      this.el.innerHTML = str;
    } else {
      this.el.textContent = str;
    }
  }
}
