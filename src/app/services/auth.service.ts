import { Injectable } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = authState(this.auth);

  constructor(private readonly auth: Auth) { }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  registration(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }
}
