import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExperienceComponent } from './experience.component';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total experience correctly', () => {
    expect(component.totalExperienceMonths).toBeGreaterThan(0);
  });

  it('should cycle carousel slides with prev and next', () => {
    const initialIndex = component.currentIndex;
    component.next();
    expect(component.currentIndex).toBe((initialIndex + 1) % component.experiences.length);
    component.prev();
    expect(component.currentIndex).toBe(initialIndex);
  });
});
