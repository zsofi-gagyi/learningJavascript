import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxJsWithAngularVersionComponent } from './rx-js-with-angular-version.component';

describe('RxJsWithAngularVersionComponent', () => {
  let component: RxJsWithAngularVersionComponent;
  let fixture: ComponentFixture<RxJsWithAngularVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxJsWithAngularVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxJsWithAngularVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
