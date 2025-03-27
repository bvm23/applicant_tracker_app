import { Directive, ElementRef, inject, input } from '@angular/core';
import { Stages } from '../../core/constants/data.constants';

@Directive({
  selector: '[atHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef) as ElementRef<
    HTMLParagraphElement | HTMLSpanElement
  >;

  colors = {
    green: '#13814a',
    blue: '#22648d',
    red: '#792223',
    orange: '#965218',
    yellow: '#8a6d0d',
  };

  viewFor = input('', { alias: 'atHighlight' });
  viewValue = input();

  setHighlight() {
    let color = '';
    switch (this.viewFor()) {
      case 'stage':
        switch (this.viewValue()) {
          case 'lead':
            color = this.colors.orange;
            break;
          case 'screen':
            color = this.colors.red;
            break;
          case 'interview':
            color = this.colors.yellow;
            break;
          case 'offer':
            color = this.colors.blue;
            break;
          case 'hired':
            color = this.colors.green;
            break;
          default:
            color = '';
        }
        break;
      default:
        color = '';
    }
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.color = '#c9c5c5';
    this.el.nativeElement.style.padding = '0 0.4rem';
    this.el.nativeElement.style.borderRadius = '0.2rem';
    this.el.nativeElement.style.fontWeight =
      this.viewFor() === 'stage' ? '500' : '400';
    this.el.nativeElement.style.fontSize =
      this.viewFor() === 'stage' ? '1rem' : '0.8rem';
  }

  ngOnInit() {
    this.setHighlight();
  }
}
