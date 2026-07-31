import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  private api = inject(Api);

  blogs: any[] = [];
  loading = true;

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
    this.api.getBlogs().subscribe({
      next: (response: any) => {
        this.blogs = response;
        this.loading = false;
      },

      error: (error) => {
        console.error('Blog Error:', error);
        this.blogs = [];
        this.loading = false;
      },
    });
  }
}
