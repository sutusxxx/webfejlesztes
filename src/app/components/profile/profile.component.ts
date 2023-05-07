import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base/base.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { concatMap, takeUntil } from 'rxjs';
import { User, user } from '@angular/fire/auth';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent implements OnInit {
    user$ = this.authService.currentUser$;

    profileForm = new FormGroup({
        uid: new FormControl(''),
        email: new FormControl('', Validators.required),
        displayName: new FormControl('', Validators.required),
    })

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private imageUploadService: ImageUploadService,
        private readonly router: Router
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

    uploadImage(event: any, user: User): void {
        this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
            concatMap(photoURL => this.authService.updateProfileData({ photoURL }))
        ).subscribe();
    }

    saveProfile(): void {
        const profileData = this.profileForm.value;
        this.userService.saveUser(profileData).pipe(
            concatMap(() => this.authService.updateProfileData(profileData))
        ).subscribe();
    }

    deleteUser(): void {
        const profileData = this.profileForm.value;
        this.userService.deleteProfile(profileData.uid).pipe(
            concatMap(() => this.authService.deleteAccount())
        ).subscribe(() => this.router.navigate(['/login']))
    }
}
