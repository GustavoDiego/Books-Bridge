import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {
 constructor(private router:Router){}

  onRipple(event: MouseEvent): void {

    const target = event.currentTarget as HTMLElement;
    if (!target) return;


    const ripple = document.createElement('span');
    ripple.className = 'ripple';


    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;


    ripple.style.width = ripple.style.height = `${diameter}px`;


    const rect = target.getBoundingClientRect();
    ripple.style.left = `${event.clientX - (rect.left + radius)}px`;
    ripple.style.top = `${event.clientY - (rect.top + radius)}px`;


    const existingRipple = target.getElementsByClassName('ripple')[0];
    if (existingRipple) {
      existingRipple.remove();
    }

    
    target.appendChild(ripple);
  }
}
