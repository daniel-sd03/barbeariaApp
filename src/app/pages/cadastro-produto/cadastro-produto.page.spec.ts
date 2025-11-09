import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CadastroProdutoPage } from './cadastro-produto.page';

describe('CadastroProdutoPage', () => {
  let component: CadastroProdutoPage;
  let fixture: ComponentFixture<CadastroProdutoPage>;

beforeEach(waitForAsync(() => {
  fixture = TestBed.createComponent(CadastroProdutoPage);
  component = fixture.componentInstance;
  fixture.detectChanges();
}));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
