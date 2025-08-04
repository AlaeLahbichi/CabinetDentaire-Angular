import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MRDV } from './mrdv';

describe('MRDV', () => {
  let component: MRDV;
  let fixture: ComponentFixture<MRDV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MRDV]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MRDV);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
