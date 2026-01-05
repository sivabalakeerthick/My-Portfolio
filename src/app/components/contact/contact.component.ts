import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    const formData = this.contactForm.value;

    // Send to YOU
    emailjs.send('service_cspilad', 'template_dxadctr', formData, 'sSOqcsUjoDSeZJZ8-')
      .then(() => {
        // Then send auto-reply to user
        emailjs.send('service_cspilad', 'template_ubvp7hi', {
          name: formData.name,
          email: formData.email
        }, 'sSOqcsUjoDSeZJZ8-')
          .then(() => {
            this.successMessage = 'Thank you for contacting me! Will get back to you soon.';
            this.contactForm.reset();
            this.submitted = false;
          })
          .catch(error => {
            console.error('Auto-reply error:', error);
            this.errorMessage = 'There was a problem sending your email.';
          });

      })
      .catch(error => {
        console.error('Email to admin error:', error);
        this.errorMessage = 'Something went wrong. Please try again later.';
      });
  }
}
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-contact',
//   templateUrl: './contact.component.html',
//   styleUrls: ['./contact.component.css']
// })
// export class ContactComponent implements OnInit {

//   contactForm!: FormGroup;
//   submitted = false;

//   successMessage = '';
//   errorMessage = '';

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.contactForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       message: ['', [Validators.required, Validators.minLength(10)]]
//     });
//   }

//   get f() {
//     return this.contactForm.controls;
//   }

//   onSubmit(): void {
//     this.submitted = true;

//     if (this.contactForm.invalid) return;

//     this.http.post(`${environment.apiUrl}/contact`, this.contactForm.value)
//       .subscribe({
//         next: () => {
//           this.successMessage =
//             'Thank you for contacting me! Will get back to you soon.';
//           this.errorMessage = '';
//           this.contactForm.reset();
//           this.submitted = false;
//         },
//         error: () => {
//           this.errorMessage =
//             'Something went wrong. Please try again later.';
//           this.successMessage = '';
//         }
//       });
//   }
// }

