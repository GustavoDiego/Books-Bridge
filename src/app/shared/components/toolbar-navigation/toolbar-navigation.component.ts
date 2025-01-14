import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {
   constructor(private router:Router){}
   isCollapsed = false;
   private lastScrollTop = 0;

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
  @HostListener('window:scroll', [])
  onWindowScroll() {

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;


    if (currentScroll > this.lastScrollTop) {
      this.isCollapsed = true;
    } else {

      if (currentScroll <= 0) {
        this.isCollapsed = false;
      }
    }


    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }


  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
