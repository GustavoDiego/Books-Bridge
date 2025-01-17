import { MessageService } from 'primeng/api';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastModule],
      declarations: [AppComponent],
      providers:[MessageService]
    }).compileComponents();
  });

  it('deve criar a aplicação', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve ter "BooksBridge" como título', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('BooksBridge');
  });

  
});
