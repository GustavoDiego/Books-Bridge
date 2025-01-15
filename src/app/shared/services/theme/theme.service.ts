import { Observable, BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_THEME_CLASS = 'dark';
  private readonly THEME_STORAGE_KEY = 'preferred-theme';
  private readonly DARK_THEME_FILE = 'lara-dark-blue.css';
  private readonly LIGHT_THEME_FILE = 'lara-light-blue.css';

  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.darkModeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = savedTheme
      ? savedTheme === 'dark'
      : prefersDark;

    this.darkModeSubject.next(isDark);
    this.applyTheme();
  }

  public toggleTheme(): void {
    this.darkModeSubject.next(!this.darkModeSubject.value);
    this.applyTheme();
  }

  private applyTheme(): void {
    const isDark = this.darkModeSubject.value;
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;



    if (isDark) {
      this.document.body.classList.add(this.DARK_THEME_CLASS);
      themeLink.href = this.DARK_THEME_FILE;
    } else {
      this.document.body.classList.remove(this.DARK_THEME_CLASS);
      themeLink.href = this.LIGHT_THEME_FILE;
    }

    localStorage.setItem(this.THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  public getCurrentTheme(): Observable<boolean> {
    return this.isDarkMode$;
  }
}
