import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, RouterLinkActive, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isCollapsed: boolean = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

}
