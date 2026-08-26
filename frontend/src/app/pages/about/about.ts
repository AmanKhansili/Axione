import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  private api = inject(Api);

  teamMembers: any[] = [];

  ngOnInit(): void {
    this.loadTeam();
  }

  loadTeam(): void {
    this.api.getTeamMembers().subscribe({
      next: (data) => {
        this.teamMembers = data || [];
      },
      error: (error) => {
        console.error('Load Team Error:', error);
      },
    });
  }
}
