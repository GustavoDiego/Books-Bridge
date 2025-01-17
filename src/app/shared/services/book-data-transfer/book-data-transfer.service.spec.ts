import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { BookDataTransferService } from './book-data-transfer.service';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';  

describe('BookDataTransferService', () => {
  let service: BookDataTransferService;


  const dummyBooks: SimplifiedBook[] = [
    { id: '1', title: 'Livro de Teste', authors: 'Autor Teste', saleability:'free' },
    { id: '2', title: 'Outro Livro', authors: 'Outro Autor', saleability:'for_sale' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookDataTransferService);
    console.log('Serviço BookDataTransferService criado para testes.');
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
    console.log('Teste de criação do serviço passado.');
  });

  it('deve definir e obter cache corretamente', (done: DoneFn) => {
    service.setCache(dummyBooks);
    service.getCache().pipe(take(1)).subscribe((cache) => {
      expect(cache).toEqual(dummyBooks);
      console.log('Cache definido e obtido corretamente.');
      done();
    });
  });

  it('deve retornar true em hasCache() quando houver cache', () => {
    service.setCache(dummyBooks);
    expect(service.hasCache()).toBeTrue();
    console.log('hasCache() retorna true após setCache.');
  });

  it('deve retornar false em hasCache() quando não houver cache', () => {
    service.clearCache();
    expect(service.hasCache()).toBeFalse();
    console.log('hasCache() retorna false após clearCache.');
  });

  it('deve limpar o cache com clearCache()', (done: DoneFn) => {
    service.setCache(dummyBooks);
    expect(service.hasCache()).toBeTrue();

    service.clearCache();
    expect(service.hasCache()).toBeFalse();

    service.getCache().pipe(take(1)).subscribe((cache) => {
      expect(cache).toBeNull();
      console.log('Cache limpo corretamente com clearCache.');
      done();
    });
  });
});
