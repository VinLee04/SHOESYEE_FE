import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGHNComponent } from './test-ghn.component';

describe('TestGHNComponent', () => {
  let component: TestGHNComponent;
  let fixture: ComponentFixture<TestGHNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGHNComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestGHNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
