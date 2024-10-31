import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickDetailComponent } from './quick-detail.component';

describe('QuickDetailComponent', () => {
  let component: QuickDetailComponent;
  let fixture: ComponentFixture<QuickDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
