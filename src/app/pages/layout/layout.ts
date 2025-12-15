import { Component, HostListener } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  isOpen:boolean=false;
 toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown-container');
    if (!clickedInside) {
      this.isOpen = false;
    }
  }



  userName: string | null = null;

  ngOnInit() {
  this.userName = this.authService.getUserFullName();
}


  constructor(private authService: AuthService) {}

  

  logout() {
    this.authService.logout();
  }
 
}
