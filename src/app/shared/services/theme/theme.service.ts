import { Observable, BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Constantes com nomes de classes e arquivos de temas
  private readonly DARK_THEME_CLASS = 'dark';
  private readonly THEME_STORAGE_KEY = 'preferred-theme';
  private readonly DARK_THEME_FILE = 'lara-dark-blue.css';
  private readonly LIGHT_THEME_FILE = 'lara-light-blue.css';

  // BehaviorSubject pra controlar o estado do tema (escuro/claro)
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  // Observable público pra que outros componentes possam se inscrever nas mudanças de tema
  public isDarkMode$ = this.darkModeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Delay curto pra não travar a inicialização do app
    setTimeout(() => this.initializeTheme(), 0);
  }

  // Inicializa o tema baseado no localStorage ou na preferência do usuário no sistema
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Se tem tema salvo, usa ele; se não, verifica a preferência do sistema
    const isDark = savedTheme
      ? savedTheme === 'dark'
      : prefersDark;

    // Atualiza o estado do subject com a decisão do tema
    this.darkModeSubject.next(isDark);
    // Aplica o tema na interface
    this.applyTheme();
  }

  // Método público pra alternar entre tema claro e escuro
  public toggleTheme(): void {
    const newTheme = !this.darkModeSubject.value;
    this.darkModeSubject.next(newTheme);
    this.applyTheme();
  }

  // Aplica o tema atualizando classes do body e href do link do tema
  private applyTheme(): void {
    const isDark = this.darkModeSubject.value;
    // Seleciona o elemento link responsável pelo tema
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (isDark) {
      // Se for tema escuro, adiciona classe dark e muda o arquivo CSS
      this.document.body.classList.add(this.DARK_THEME_CLASS);
      themeLink.href = this.DARK_THEME_FILE;
      localStorage.setItem(this.THEME_STORAGE_KEY, 'dark');
    } else {
      // Se for tema claro, remove classe dark e usa o outro arquivo CSS
      this.document.body.classList.remove(this.DARK_THEME_CLASS);
      themeLink.href = this.LIGHT_THEME_FILE;
      localStorage.setItem(this.THEME_STORAGE_KEY, 'light');
    }
  }

  // Retorna um Observable pra informar qual é o tema atual
  public getCurrentTheme(): Observable<boolean> {
    return this.isDarkMode$;
  }
}
