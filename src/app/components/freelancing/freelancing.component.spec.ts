import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreelancingComponent } from './freelancing.component';

describe('FreelancingComponent', () => {
  let component: FreelancingComponent;
  let fixture: ComponentFixture<FreelancingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FreelancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render at least one freelance project', () => {
    expect(component.freelanceProjects.length).toBeGreaterThanOrEqual(1);
  });

  it('should open and close the case study modal', () => {
    expect(component.isModalOpen).toBeFalse();
    expect(component.activeModalProject).toBeNull();

    const project = component.freelanceProjects[0];
    component.openModal(project);
    expect(component.isModalOpen).toBeTrue();
    expect(component.activeModalProject).toEqual(project);

    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
    expect(component.activeModalProject).toBeNull();
  });

  it('should close modal on Escape key', () => {
    const project = component.freelanceProjects[0];
    component.openModal(project);
    expect(component.isModalOpen).toBeTrue();

    component.onEscape();
    expect(component.isModalOpen).toBeFalse();
  });
});
