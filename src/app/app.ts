import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/UserService/UserService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Request_Management');

  constructor(private userService: UserService) {}

  ngOnInit() {
  this.userService.restoreUserFromStorage();
}
}
