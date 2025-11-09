import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PainelBarbeirosPage } from './painel-barbeiros.page';

describe('PainelBarbeirosPage', () => {
  let component: PainelBarbeirosPage;
  let fixture: ComponentFixture<PainelBarbeirosPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PainelBarbeirosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});