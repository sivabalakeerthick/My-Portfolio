import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationComponent } from './education.component';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render education items', () => {
    expect(component.educationList.length).toBeGreaterThan(0);
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.education-card');
    expect(cards.length).toBe(component.educationList.length);
  });
});
