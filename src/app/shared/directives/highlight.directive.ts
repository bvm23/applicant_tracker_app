import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[atHighlight], at-action-button[atHighlight]',
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
    grey: '#353535',
  };

  viewFor = input<string>('', { alias: 'atHighlight' });
  viewValue = input<string>();
  fontSize = input<string>();

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
      case 'location':
        switch (this.viewValue()) {
          case 'san francisco':
            color = this.colors.blue;
            break;
          case 'new york':
            color = this.colors.green;
            break;
          case 'tokyo':
            color = this.colors.red;
            break;
          default:
            color = '';
        }
        break;
      case 'role':
        switch (this.viewValue()) {
          case 'engineering - front end':
            color = this.colors.blue;
            break;
          case 'vp of marketing':
            color = this.colors.red;
            break;
          case 'design':
            color = this.colors.orange;
            break;
          case 'support lead':
            color = this.colors.grey;
            break;
          case 'engineering - ops':
            color = this.colors.blue;
            break;
          default:
            color = '';
        }
        break;
      case 'skills':
        switch (this.viewValue()) {
          default:
            color = this.colors.grey;
        }
        break;
      default:
        color = '';
    }
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.color = '#c9c5c5';
    this.el.nativeElement.style.padding = [
      'stage',
      'skills',
      'role',
      'location',
    ].includes(this.viewFor())
      ? '0 0.4rem'
      : '0';
    this.el.nativeElement.style.borderRadius = '0.2rem';
    this.el.nativeElement.style.fontWeight =
      this.viewFor() === 'stage' ? '500' : '400';
    this.el.nativeElement.style.fontSize = this.fontSize()
      ? this.fontSize()!
      : this.viewFor() === 'stage'
      ? '1rem'
      : '0.8rem';
  }

  ngOnInit() {
    this.setHighlight();
  }
}
