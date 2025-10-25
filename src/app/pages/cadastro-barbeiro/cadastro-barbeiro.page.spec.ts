import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroBarbeiroPage } from './cadastro-barbeiro.page';

describe('CadastroBarbeiroPage', () => {
  let component: CadastroBarbeiroPage;
  let fixture: ComponentFixture<CadastroBarbeiroPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CadastroBarbeiroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
