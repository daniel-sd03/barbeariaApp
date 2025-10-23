import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrinhoPage } from './carrinho.page';

describe('CarrinhoDeCompraPage', () => {
  let component: CarrinhoPage;
  let fixture: ComponentFixture<CarrinhoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarrinhoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
