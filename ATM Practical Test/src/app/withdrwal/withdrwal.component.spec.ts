import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrwalComponent } from './withdrwal.component';

describe('WithdrwalComponent', () => {
  let component: WithdrwalComponent;
  let fixture: ComponentFixture<WithdrwalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrwalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
