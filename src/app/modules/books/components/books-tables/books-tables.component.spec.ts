import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksTablesComponent } from './books-tables.component';

describe('BooksTablesComponent', () => {
  let component: BooksTablesComponent;
  let fixture: ComponentFixture<BooksTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksTablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
