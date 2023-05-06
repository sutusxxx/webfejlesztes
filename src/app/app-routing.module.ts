import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@components/auth/login/login.component';
import { RegistrationComponent } from '@components/auth/registration/registration.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { MessengerComponent } from '@components/messenger/messenger.component';
import { ProfileComponent } from '@components/profile/profile.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToMessenger = () => redirectLoggedInTo(['messenger']);

const routes: Routes = [
  { path: 'login', component: LoginComponent, ...canActivate(redirectToMessenger) },
  { path: 'registration', component: RegistrationComponent, ...canActivate(redirectToMessenger) },
  { path: 'messenger', component: MessengerComponent, ...canActivate(redirectToLogin) },
  { path: 'profile', component: ProfileComponent, ...canActivate(redirectToLogin) },
  { path: '', redirectTo: 'messenger', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
