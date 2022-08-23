import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'xxmagic-typed',
  templateUrl: './typed.component.html',
  styleUrls: ['./typed.component.scss']
})
export class TypedComponent implements OnInit {
  @Input() strings: string[] = ['xxxxxx', 'fasdfsd'];
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
  @Input() loopCount!: number;
  @Input() fadeOutDelay = 500;

  /**
   * 用fadeOut动画代替退格
   */
  @Input() fadeOut?: boolean;
  @Input() attr?: string;
  @Input() isInput?: boolean;
  @Input() loop?: boolean;
  @Input() fadeOutClass = 'typed-fade-out';
  @Input() stringsElement?: HTMLElement;
  @Output() stringTyped = new EventEmitter<number>();
  @Output() callback = new EventEmitter<void>();
  @Output() preStringTyped = new EventEmitter<number>();

  @ViewChild('typedText', { static: true }) private typedTextRef!: ElementRef<HTMLDivElement>;
  @ViewChild('typedCursor', { static: true }) private typedCursorRef!: ElementRef<HTMLDivElement>;

  private typedText!: HTMLDivElement;
  private typedCursor!: HTMLDivElement;

  private timeout$ = new Subject<void>();
  private sequence: number[] = [];
  private arrayPos = 0;
  private stopNum = 0;
  private strPos = 0;
  private curLoop = 0;
  private stop = false;

  constructor() {}

  ngOnInit(): void {
    this.typedText = this.typedTextRef.nativeElement;
    this.typedCursor = this.typedCursorRef.nativeElement;

    if (this.stringsElement) {
      this.strings = [];
      this.stringsElement.style.display = 'none';

      const children = this.stringsElement.children;
      const length = children.length;
      for (let i = 0; i < length; i++) {
        this.strings.push(children[i].innerHTML);
      }
    }

    this.init();
  }

  typewrite(curString: string, curStrPos: number) {
    if (this.stop === true) {
      return;
    }

    if (this.fadeOut && this.typedText.classList.contains(this.fadeOutClass)) {
      this.typedText.classList.remove(this.fadeOutClass);
      this.typedCursor.classList.remove(this.fadeOutClass);
    }

    const humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
    // contain typing function in a timeout humanize'd delay
    timer(humanize)
      .pipe(takeUntil(this.timeout$))
      .subscribe(() => {
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
            charPause = parseInt(substr, 10);
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
        timer(charPause)
          .pipe(takeUntil(this.timeout$))
          .subscribe(() => {
            if (curStrPos === curString.length) {
              // fires callback function
              this.stringTyped.emit(this.arrayPos);

              // is this the final string
              if (this.arrayPos === this.strings.length - 1) {
                // animation that occurs on the last typed string
                this.callback.emit();

                this.curLoop++;

                // quit if we wont loop back
                if (this.loop === false || this.curLoop === this.loopCount) return;
              }

              timer(this.backDelay)
                .pipe(takeUntil(this.timeout$))
                .subscribe(() => this.backspace(curString, curStrPos));
            } else {
              /* call before functions if applicable */
              if (curStrPos === 0) {
                this.preStringTyped.emit(this.arrayPos);
              }

              // start typing each new char into existing string
              // curString: arg, this.el.html: original text inside element
              const nextString = curString.substring(0, curStrPos + 1);
              if (this.attr) {
                this.typedText.setAttribute(this.attr, nextString);
              } else {
                if (this.isInput) {
                  (this.typedText as HTMLInputElement).value = nextString;
                } else if (this.contentType === 'html') {
                  this.typedText.innerHTML = nextString;
                } else {
                  this.typedText.textContent = nextString;
                }
              }

              // add characters one by one
              curStrPos++;
              // loop the function
              this.typewrite(curString, curStrPos);
            }
            // end of character pause
          });

        // humanized value for typing
      });
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

    timer(humanize)
      .pipe(takeUntil(this.timeout$))
      .subscribe(() => {
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
      });
  }

  init() {
    timer(this.startDelay)
      .pipe(takeUntil(this.timeout$))
      .subscribe(() => {
        for (let i = 0; i < this.strings.length; i++) {
          this.sequence[i] = i;
        }

        this.typewrite(this.strings[this.sequence[this.arrayPos]], this.strPos);
      });
  }

  // Adds a CSS class to fade out current string
  initFadeOut() {
    this.typedText.classList.add(this.fadeOutClass);
    this.typedCursor.classList.add(this.fadeOutClass);

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
      (this.typedText as HTMLInputElement).value = str;
    } else if (this.contentType === 'html') {
      this.typedText.innerHTML = str;
    } else {
      this.typedText.textContent = str;
    }
  }

  reset() {
    this.timeout$.next();
    this.timeout$.complete();
    this.typedText.textContent = '';
    this.strPos = 0;
    this.arrayPos = 0;
    this.curLoop = 0;
  }
}
