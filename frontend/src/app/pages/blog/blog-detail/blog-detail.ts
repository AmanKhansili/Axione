import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(Api);

  blog: any = null;
  loading = true;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.loading = false;
      return;
    }

    this.api.getBlogs().subscribe({
      next: (blogs: any[]) => {
        this.blog = blogs.find((blog) => blog.slug === slug) ?? null;

        this.loading = false;

        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto',
          });

          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 0);
      },

      error: (error) => {
        console.error('Blog Detail Error:', error);

        this.blog = null;
        this.loading = false;
      },
    });
  }
}
