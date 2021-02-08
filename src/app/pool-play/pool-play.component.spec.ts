import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolPlayComponent } from './pool-play.component';

describe('PoolPlayComponent', () => {
  let component: PoolPlayComponent;
  let fixture: ComponentFixture<PoolPlayComponent>;

  beforeEach(async(() => {
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
