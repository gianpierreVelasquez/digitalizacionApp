import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AseguradoComponent } from './asegurado.component';

describe('AseguradoComponent', () => {
  let component: AseguradoComponent;
  let fixture: ComponentFixture<AseguradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AseguradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AseguradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
