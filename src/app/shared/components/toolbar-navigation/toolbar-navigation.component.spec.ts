import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarNavigationComponent } from './toolbar-navigation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ToolbarNavigationComponent', () => {
  let component: ToolbarNavigationComponent;
  let fixture: ComponentFixture<ToolbarNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ToolbarNavigationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    console.log('Componente ToolbarNavigationComponent criado para testes.');
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
    console.log('Teste de criação do componente passou.');
  });

  describe('onRipple', () => {
    it('deve criar um ripple ao chamar onRipple', () => {
      const div = document.createElement('div');
      div.style.width = '100px';
      div.style.height = '100px';
      div.classList.add('ripple-container');

      spyOn(div, 'getBoundingClientRect').and.returnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => {}
      } as DOMRect);

      const event = new MouseEvent('click', { clientX: 50, clientY: 50, bubbles: true });
      Object.defineProperty(event, 'currentTarget', { value: div });

      component.onRipple(event);

      const ripple = div.querySelector('span.ripple');
      expect(ripple).toBeTruthy();
      console.log('Ripple criado e adicionado corretamente ao elemento.');
    });
  });

  describe('onWindowScroll', () => {
    it('deve ajustar isCollapsed em onWindowScroll ao rolar para baixo', () => {
      (component as any)['lastScrollTop'] = 0;
      component.isCollapsed = false;

      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(100);
      component.onWindowScroll();

      expect(component.isCollapsed).toBeTrue();
      console.log('isCollapsed definido como verdadeiro ao rolar para baixo.');
    });

    it('não deve definir isCollapsed como verdadeiro quando no topo da página', () => {
      (component as any)['lastScrollTop'] = 50;
      component.isCollapsed = true;

      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(0);
      component.onWindowScroll();

      expect(component.isCollapsed).toBeFalse();
      console.log('isCollapsed definido como falso no topo da página.');
    });
  });

  describe('toggleMenu', () => {
    it('deve alternar isCollapsed e chamar scrollTo', () => {
      component.isCollapsed = false;

      const scrollToSpy = spyOn(window as any, 'scrollTo');

      component.toggleMenu();

      expect(component.isCollapsed).toBeTrue();
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      console.log('toggleMenu alternou isCollapsed e chamou scrollTo corretamente.');
    });
  });
});
