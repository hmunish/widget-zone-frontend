import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth.service';
import { HttpStatusCode } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import moment from 'moment';

enum AuthMode {
  SignUp = 'signup',
  SignIn = 'signin',
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  authModeEnum = AuthMode;
  mode = this.authModeEnum.SignIn;
  today = moment().format('YYYY-MM-DD');

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private notifyService: NotificationService
  ) {
    this.authForm = fb.group({});
  }

  ngOnInit(): void {
    this.initMode();

    this.route.queryParamMap.subscribe((params) => {
      const message = params.get('message');
      if (message) {
        this.notifyService.openSnackBar(message);
      }
    });
  }

  initMode() {
    const currentPath = this.route.snapshot.url[0]?.path;
    if (currentPath === this.authModeEnum.SignUp) {
      this.mode = this.authModeEnum.SignUp;
      this.addSignUpFields();
    } else {
      this.addSignInFields();
    }
  }

  addSignInFields() {
    this.authForm.addControl(
      'emailId',
      this.fb.control(null, Validators.required)
    );
    this.authForm.addControl(
      'password',
      this.fb.control(null, Validators.required)
    );
  }

  addSignUpFields() {
    this.authForm.addControl(
      'firstName',
      this.fb.control(null, Validators.required)
    );
    this.authForm.addControl(
      'lastName',
      this.fb.control(null, Validators.required)
    );
    this.authForm.addControl(
      'gender',
      this.fb.control('male', Validators.required)
    );
    this.authForm.addControl('dob', this.fb.control(null, Validators.required));
    this.authForm.addControl(
      'confirmPassword',
      this.fb.control(null, Validators.required)
    );
    this.authForm.addControl(
      'emailId',
      this.fb.control(null, [Validators.required, Validators.email])
    );
    this.authForm.addControl(
      'password',
      this.fb.control(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ])
    );
  }

  signIn() {
    if (this.mode === this.authModeEnum.SignIn) {
      this.authService.signin(this.authForm.value).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err) => {
          this.notifyService.openSnackBar(
            err.status === HttpStatusCode.Unauthorized
              ? 'Invalid credentials'
              : err.status === HttpStatusCode.Forbidden
              ? 'Your email is not verified. Please check your inbox for the verification link before logging in.'
              : 'An unexpected error occurred. Please try again later.'
          );
        },
      });
    } else {
      this.router.navigate(['/signin']);
    }
  }

  signUp() {
    if (this.mode === this.authModeEnum.SignUp) {
      this.authService.signup(this.authForm.value).subscribe({
        next: () => {
          this.notifyService.openSnackBar(
            'Account created successfully! A verification link has been sent to your email. Please verify your account before signing in.'
          );
          setTimeout(() => {
            this.router.navigate(['/signin']);
          }, 2000);
        },
        error: (error) => {
          this.notifyService.openSnackBar(
            error.status === HttpStatusCode.UnprocessableEntity
              ? 'Email Id already exist'
              : 'Failed to create user account. Please try again later.'
          );
        },
      });
    } else {
      this.router.navigate(['/signup']);
    }
  }
}
