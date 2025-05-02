import { Directive, ElementRef, inject, input } from '@angular/core';
import { StageColors, Colors } from '../../core/constants/data.constants';

type colorData = { value: string; color: string }[];

@Directive({
  selector: '[atHighlight], at-action-button[atHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef) as ElementRef<
    HTMLParagraphElement | HTMLSpanElement
  >;

  stageColors = StageColors;
  colors = Colors;

  viewFor = input<string>('', { alias: 'atHighlight' });
  viewValue = input<string>('');
  fontSize = input<string>();
  padding = input<string>();
  textTransform = input<string>();

  /*
   * generate unique color for the values passed to the function
   */
  generateColor(key: string, value: string) {
    if (!key) return;
    if (['name', 'email', 'hiringManager', 'website', 'added'].includes(key)) {
      return '';
    }
    const savedColorData = localStorage.getItem('colors');
    const parsedColorData: colorData = savedColorData
      ? (JSON.parse(savedColorData) as colorData)
      : [];

    let valueExist = parsedColorData?.find((data) => data.value === value);

    if (valueExist && Object.entries(valueExist).length > 0) {
      const savedColor = valueExist.color;
      return savedColor;
    }

    const random = Math.floor(Math.random() * Object.keys(this.colors).length);
    let color = Object.values(this.colors)[random];
    let newData: colorData = [
      ...parsedColorData,
      { value, color },
    ] as colorData;

    localStorage.setItem('colors', JSON.stringify(newData));
    return color;
  }

  /*
   * set the color and styles to the component based on the key
   */
  setHighlight(key: string, value: string, color: string) {
    let generatedColor = '';
    switch (key) {
      case 'stage':
        switch (value) {
          case 'lead':
            generatedColor = this.stageColors.orange;
            break;
          case 'screen':
            generatedColor = this.stageColors.red;
            break;
          case 'interview':
            generatedColor = this.stageColors.yellow;
            break;
          case 'offer':
            generatedColor = this.stageColors.blue;
            break;
          case 'hired':
            generatedColor = this.stageColors.green;
            break;
          default:
            generatedColor = '';
        }
        break;
      case 'skills':
        generatedColor = this.stageColors.grey;
        break;
      case 'source':
        generatedColor = this.stageColors.grey;
        break;
      default:
        generatedColor = color;
    }
    this.el.nativeElement.style.backgroundColor = generatedColor;
    this.el.nativeElement.style.color = '#c9c5c5';
    this.el.nativeElement.style.padding = generatedColor
      ? this.padding()
        ? this.padding() || ''
        : '0 0.4rem'
      : '';

    this.el.nativeElement.style.borderRadius = '0.2rem';
    this.el.nativeElement.style.fontWeight =
      this.viewFor() === 'stage' ? '500' : '400';
    this.el.nativeElement.style.fontSize = this.fontSize()
      ? this.fontSize()!
      : this.viewFor() === 'stage'
      ? '1rem'
      : '0.8rem';
    this.el.nativeElement.style.textTransform = this.textTransform() || 'none';
  }

  ngOnInit() {
    const color = this.generateColor(this.viewFor(), this.viewValue());
    this.setHighlight(this.viewFor(), this.viewValue(), color || '');
  }
}
