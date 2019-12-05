import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PureAngularVersionComponent } from './pure-angular-version.component';

describe('PureAngularVersionComponent', () => {
  let component: PureAngularVersionComponent;
  let fixture: ComponentFixture<PureAngularVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PureAngularVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PureAngularVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
