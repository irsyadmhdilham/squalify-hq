import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { Colors } from "../../functions/colors";

@Directive({
  selector: '[header-button]'
})
export class HeaderButtonDirective implements OnChanges {

  @Input() activeButton: boolean;

  constructor(private el: ElementRef) {
    const elem = this.el.nativeElement.style;
    elem.padding = '0.6em';
    elem.borderRadius = '5px';
    elem.fontSize = '1.3rem';
  }

  ngOnChanges() {
    const elem = this.el.nativeElement.style;
    if (this.activeButton) {
      elem.border = 'solid 0.55px transparent';
      elem.background = Colors.primary;
    } else {
      elem.border = `solid 0.55px ${Colors.grey}`;
      elem.background = 'transparent';
    }
  }

}
