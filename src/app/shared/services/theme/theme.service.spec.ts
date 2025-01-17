import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';
import { BehaviorSubject } from 'rxjs';

describe('ThemeService', () => {
  let service: ThemeService;
  let documentMock: Document;
  let bodyClassList: DOMTokenList;
  let themeLinkElement: HTMLLinkElement;
  let matchMediaSpy: jasmine.Spy;
  let localStorageGetItemSpy: jasmine.Spy;
  let localStorageSetItemSpy: jasmine.Spy;

  function createFakeMediaQueryList(matches: boolean): MediaQueryList {
    return {
      matches,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    };
  }

  beforeEach(() => {
    bodyClassList = {
      add: jasmine.createSpy('add'),
      remove: jasmine.createSpy('remove'),
      contains: jasmine.createSpy('contains').and.returnValue(false),
      toggle: jasmine.createSpy('toggle'),
      replace: jasmine.createSpy('replace'),
      value: '',
      toString: () => ''
    } as unknown as DOMTokenList;

    themeLinkElement = {
      id: 'app-theme',
      href: ''
    } as HTMLLinkElement;

    documentMock = {
      body: { classList: bodyClassList } as unknown as HTMLElement,
      getElementById: jasmine.createSpy('getElementById').and.returnValue(themeLinkElement),
      querySelector: jasmine.createSpy('querySelector'),
      querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([])
    } as unknown as Document;

    matchMediaSpy = spyOn(window, 'matchMedia').and.returnValue(createFakeMediaQueryList(false));
    localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    localStorageSetItemSpy = spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: documentMock }
      ]
    });
  });

  it('deve ser criado', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  describe('initializeTheme', () => {
    it('deve usar o tema do localStorage se disponível', fakeAsync(() => {
      localStorageGetItemSpy.and.returnValue('dark');
      service = TestBed.inject(ThemeService);

      tick(); // Wait for setTimeout

      service.getCurrentTheme().subscribe(isDark => {
        expect(isDark).toBeTrue();
      });
    }));

    it('deve usar a preferência do sistema se localStorage não estiver definido', fakeAsync(() => {
      matchMediaSpy.and.returnValue(createFakeMediaQueryList(true));
      localStorageGetItemSpy.and.returnValue(null);

      service = TestBed.inject(ThemeService);
      tick(); // Wait for setTimeout

      service.getCurrentTheme().subscribe(isDark => {
        expect(isDark).toBeTrue();
      });
    }));
  });

  describe('toggleTheme', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('deve alternar de claro para escuro', fakeAsync(() => {
      service['darkModeSubject'].next(false);
      tick();

      let actualTheme: boolean | undefined;
      service.toggleTheme();

      service.getCurrentTheme().subscribe(isDark => {
        actualTheme = isDark;
      });
      tick();

      expect(actualTheme).toBeTrue();
      expect(bodyClassList.add).toHaveBeenCalledWith('dark');
      expect(themeLinkElement.href).toBe('lara-dark-blue.css');
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('preferred-theme', 'dark');
      ;
    }));

    it('deve alternar de escuro para claro', fakeAsync(() => {
      service['darkModeSubject'].next(true);
      tick();

      service.toggleTheme();

      service.getCurrentTheme().subscribe(isDark => {
        expect(isDark).toBeFalse();
        expect(bodyClassList.remove).toHaveBeenCalledWith('dark');
        expect(themeLinkElement.href).toBe('lara-light-blue.css');
        expect(localStorageSetItemSpy).toHaveBeenCalledWith('preferred-theme', 'light');
      });
    }));
  });
});
