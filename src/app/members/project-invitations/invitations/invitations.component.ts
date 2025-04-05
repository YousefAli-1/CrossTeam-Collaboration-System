import { Component,input } from '@angular/core';
import { type Invitation } from '../../../app.model';
@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss'
})
export class InvitationsComponent {
  invitation = input.required<Invitation>();
}
