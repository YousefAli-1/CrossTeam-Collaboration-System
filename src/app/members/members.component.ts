//Angular
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

//Angular Materials
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent {
  isOpened: boolean = false;

  toggleDrawer(): void {
    this.isOpened = !this.isOpened;
  }
}