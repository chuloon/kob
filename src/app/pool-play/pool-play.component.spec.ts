import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoolPlayComponent } from './pool-play.component';

describe('PoolPlayComponent', () => {
  let component: PoolPlayComponent;
  let fixture: ComponentFixture<PoolPlayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PoolPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
