import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule,NavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  features = [
    {
      icon: 'groups',
      title: 'Unified Workspaces',
      description: 'Bring all teams together in shared environments with customizable views'
    },
    {
      icon: 'sync_alt',
      title: 'Real-time Sync',
      description: 'See updates across all departments instantly with our live collaboration engine'
    },
    {
      icon: 'insights',
      title: 'Smart Analytics',
      description: 'Get cross-team performance insights with automated reporting'
    },
    {
      icon: 'lock',
      title: 'Enterprise Security',
      description: 'Military-grade encryption with granular permission controls'
    },
    {
      icon: 'bolt',
      title: 'Automated Workflows',
      description: 'Streamline processes with no-code automation between teams'
    },
    {
      icon: 'hub',
      title: 'Integration Hub',
      description: 'Connect all your tools with 100+ native integrations'
    }
  ];
}