import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroServicoPage } from './cadastro-servico.page';

describe('CadastroServicoPage', () => {
  let component: CadastroServicoPage;
  let fixture: ComponentFixture<CadastroServicoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CadastroServicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
