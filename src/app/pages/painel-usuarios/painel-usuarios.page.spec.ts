import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PainelUsuariosPage } from './painel-usuarios.page';

describe('PainelUsuariosPage', () => {
  let component: PainelUsuariosPage;
  let fixture: ComponentFixture<PainelUsuariosPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PainelUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});