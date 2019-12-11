import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedTimeStepVersionComponent } from './pure-angular-version.component';

describe('PureAngularVersionComponent', () => {
  let component: FixedTimeStepVersionComponent;
  let fixture: ComponentFixture<FixedTimeStepVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedTimeStepVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedTimeStepVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
