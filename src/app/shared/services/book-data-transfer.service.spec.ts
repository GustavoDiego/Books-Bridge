import { TestBed } from '@angular/core/testing';

import { BookDataTransferService } from './book-data-transfer.service';

describe('BookDataTransferService', () => {
  let service: BookDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
