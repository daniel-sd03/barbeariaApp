import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CadastroUsuarioPage } from './cadastro-usuario.page';

describe('CadastroUsuarioPage', () => {
  let component: CadastroUsuarioPage;
  let fixture: ComponentFixture<CadastroUsuarioPage>;

beforeEach(waitForAsync(() => {
  fixture = TestBed.createComponent(CadastroUsuarioPage);
  component = fixture.componentInstance;
  fixture.detectChanges();
}));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
