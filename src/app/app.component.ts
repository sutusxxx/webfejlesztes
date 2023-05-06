import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-app';

  user$ = this.userService.currentUser$;

  constructor(
    public readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router
  ) { }

  logout() {
    this.authService.logout()
      .subscribe(() => {
        this.router.navigate(['login']);
      });
  }
}
