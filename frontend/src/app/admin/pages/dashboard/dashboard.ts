import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  admin: any = {};
  private api = inject(Api);

  cards = [
    {
      title: 'Blogs',
      value: 0,
      icon: 'ri-article-line',
      color: '#7B2FF7',
    },
    {
      title: 'Services',
      value: 0,
      icon: 'ri-briefcase-line',
      color: '#2563eb',
    },
    {
      title: 'Contacts',
      value: 0,
      icon: 'ri-mail-line',
      color: '#10b981',
    },
    {
      title: 'Newsletter',
      value: 0,
      icon: 'ri-mail-send-line',
      color: '#f59e0b',
    },
  ];

  ngOnInit() {
    const admin = localStorage.getItem('admin');

    if (admin) {
      this.admin = JSON.parse(admin);
    }
    this.loadStats();
  }

  loadStats() {
    this.api.getDashboardStats().subscribe({
      next: (res: any) => {
        this.cards[0].value = res.blogs;
        this.cards[1].value = res.services;
        this.cards[2].value = res.contacts;
        this.cards[3].value = res.newsletter;
      },
      error: (error: any) => {
        console.error('Dashboard Stats Error:', error);
      },
    });
  }
}
