import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Siva Bala Keerthick G | Portfolio'`, () => {
    expect(component.title).toEqual('Siva Bala Keerthick G | Portfolio');
  });

  it('should toggle scroll to top button based on scroll position', () => {
    expect(component.showScrollButton).toBeFalse();
    // Simulate scroll past 300px
    Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
    component.onWindowScroll();
    expect(component.showScrollButton).toBeTrue();

    // Simulate scroll back to top
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    component.onWindowScroll();
    expect(component.showScrollButton).toBeFalse();
  });

  it('should call scrollTo on window when scrollToTop is called', () => {
    spyOn(window, 'scrollTo');
    component.scrollToTop();
    (expect(window.scrollTo) as any).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
