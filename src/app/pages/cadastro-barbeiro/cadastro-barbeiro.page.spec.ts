import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CadastroBarbeiroPage } from './cadastro-barbeiro.page';

describe('CadastroBarbeiroPage', () => {
  let component: CadastroBarbeiroPage;
  let fixture: ComponentFixture<CadastroBarbeiroPage>;

beforeEach(waitForAsync(() => {
  fixture = TestBed.createComponent(CadastroBarbeiroPage);
  component = fixture.componentInstance;
  fixture.detectChanges();
}));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
