import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PainelServicosPage } from './painel-servicos.page';

describe('PainelServicosPage', () => {
  let component: PainelServicosPage;
  let fixture: ComponentFixture<PainelServicosPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PainelServicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});