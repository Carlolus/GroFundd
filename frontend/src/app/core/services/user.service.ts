import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUser?: User;

  constructor(
    private http: HttpClient
  ) { }

  getCurrentUser(): any {
    if (this.currentUser) return this.currentUser;
    const storedUser = localStorage.getItem('user');
    if (storedUser) this.currentUser = JSON.parse(storedUser);
    return this.currentUser;
  }

  getCurrentUserUUID(): string {
    if (this.currentUser) return this.currentUser.id;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser) as User;
    }
    return this.currentUser?.id || "nan";
  }

  updateUser(userData: User) {
    return this.http.patch<User>(`${this.apiUrl}/${userData.id}`, userData).pipe(
      tap(updatedUser => {
        this.setCurrentUser(updatedUser);
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }
}
