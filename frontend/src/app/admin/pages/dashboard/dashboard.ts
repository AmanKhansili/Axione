import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  admin: any = {};

  cards = [
    {
      title: 'Blogs',
      value: 12,
      icon: 'ri-article-line',
      color: '#7B2FF7',
    },
    {
      title: 'Services',
      value: 6,
      icon: 'ri-briefcase-line',
      color: '#2563eb',
    },
    {
      title: 'Contacts',
      value: 24,
      icon: 'ri-mail-line',
      color: '#10b981',
    },
    {
      title: 'Newsletter',
      value: 165,
      icon: 'ri-mail-send-line',
      color: '#f59e0b',
    },
  ];

  ngOnInit() {
    const admin = localStorage.getItem('admin');

    if (admin) {
      this.admin = JSON.parse(admin);
    }
  }
}
