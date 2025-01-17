import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {
  // Injeta o Router pra navegação entre páginas se precisar
  constructor(private router:Router){}

  // Controla o estado de colapso do menu
  isCollapsed = false;
  // Guarda a última posição de scroll pra comparação
  private lastScrollTop = 0;

  // Método que cria um efeito ripple no botão clicado
  onRipple(event: MouseEvent): void {
    // Pega o elemento alvo do clique
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    // Cria um elemento span que será o ripple
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    // Determina o diâmetro baseado no maior tamanho do alvo
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;

    // Define tamanho do ripple
    ripple.style.width = ripple.style.height = `${diameter}px`;

    // Calcula a posição do clique pra centralizar o efeito
    const rect = target.getBoundingClientRect();
    ripple.style.left = `${event.clientX - (rect.left + radius)}px`;
    ripple.style.top = `${event.clientY - (rect.top + radius)}px`;

    // Remove ripple existente se houver pra evitar múltiplos
    const existingRipple = target.getElementsByClassName('ripple')[0];
    if (existingRipple) {
      existingRipple.remove();
    }

    // Adiciona o ripple ao elemento clicado
    target.appendChild(ripple);
  }

  // Acompanha o evento de scroll na janela
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Pega a posição atual do scroll
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Se scrolou pra baixo, cola o menu
    if (currentScroll > this.lastScrollTop) {
      this.isCollapsed = true;
    } else {
      // Se tá no topo, descola o menu
      if (currentScroll <= 0) {
        this.isCollapsed = false;
      }
    }

    // Atualiza a posição do último scroll
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  // Alterna o estado do menu e rola a página pro topo
  toggleMenu() {
    // Inverte o estado de colapso
    this.isCollapsed = !this.isCollapsed;
    // Rola pro topo suavemente
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
