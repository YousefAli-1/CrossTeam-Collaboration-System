import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
@Component({
  selector: 'app-about-us',
  imports: [NgFor, NavbarComponent],
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent {
  companyValues = [
    {
      title: 'Collaboration Without Boundaries',
      description: 'We eliminate departmental silos by creating shared spaces where ideas flow freely across teams and hierarchies.',
      icon: 'group'
    },
    {
      title: 'Radical Transparency',
      description: 'We build tools that make work visible at all levels, fostering trust and accountability organization-wide.',
      icon: 'visibility'
    },
    {
      title: 'Continuous Evolution',
      description: 'We treat our platform as always unfinished, constantly adapting to new ways teams work together.',
      icon: 'trending_up'
    },
    {
      title: 'Empathy in Design',
      description: 'Every feature begins with understanding the real pain points teams experience in their daily workflows.',
      icon: 'psychology'
    },
    {
      title: 'Data-Informed Decisions',
      description: 'We combine quantitative insights with qualitative feedback to guide our product development.',
      icon: 'analytics'
    },
    {
      title: 'Sustainable Work Practices',
      description: 'We promote healthy collaboration habits that prevent burnout and maintain team energy long-term.',
      icon: 'self_improvement'
    }
  ];
}