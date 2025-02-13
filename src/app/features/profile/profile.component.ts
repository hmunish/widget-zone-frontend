import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/interfaces/user.interface';
import { NotificationService } from '../../core/services/notification.service';
import { AuthenticationService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileFormGroup!: FormGroup;
  today = moment().format('YYYY-MM-DD');
  userProfile: User | undefined;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notifyService: NotificationService,
    private authService: AuthenticationService
  ) {
    this.initProfileForm();
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  initProfileForm() {
    this.profileFormGroup = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      emailId: [{ value: null, disabled: true }, [Validators.required]],
      dob: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      password: [
        null,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ],
    });
  }

  getUserProfile() {
    this.userService.getProfile().subscribe((res) => {
      this.userProfile = res.user;
      this.loadUserProfile();
    });
  }

  loadUserProfile() {
    this.profileFormGroup.patchValue({
      firstName: this.userProfile?.firstName,
      lastName: this.userProfile?.lastName,
      emailId: this.userProfile?.emailId,
      dob: moment(this.userProfile?.dob).format('YYYY-MM-DD'),
      gender: this.userProfile?.gender,
    });
  }

  editUserProfile() {
    if (this.profileFormGroup.invalid) return;

    const form = this.profileFormGroup;

    const payload = {
      firstName: form.get('firstName')?.value,
      lastName: form.get('lastName')?.value,
      dob: form.get('dob')?.value,
      gender: form.get('gender')?.value,
      ...(form.get('password')?.value && {
        password: form.get('password')?.value,
      }),
    };

    this.userService.updateProfile(payload).subscribe((res) => {
      this.notifyService.openSnackBar(res.message + ' Signing out...');
      setTimeout(() => {
        this.authService.logout();
      }, 2000);
    });
  }
}
