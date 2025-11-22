import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRequest } from './single-request';

describe('SingleRequest', () => {
  let component: SingleRequest;
  let fixture: ComponentFixture<SingleRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
