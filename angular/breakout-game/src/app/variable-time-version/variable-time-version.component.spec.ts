import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableTimeStepVersionComponent } from './rx-js-version.component';

describe('RxJsVersionComponent', () => {
  let component: VariableTimeStepVersionComponent;
  let fixture: ComponentFixture<VariableTimeStepVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableTimeStepVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableTimeStepVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
