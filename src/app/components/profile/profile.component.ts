import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base/base.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user$ = this.authService.currentUser$;

  profileForm = new FormGroup({
    id: new FormControl(''),
    email: new FormControl(''),
    displayName: new FormControl(''),
  })

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.profileForm.patchValue({ ...user })
      })
  }

  save() {
    this.userService.saveUser(this.profileForm.value).subscribe();
  }
}
