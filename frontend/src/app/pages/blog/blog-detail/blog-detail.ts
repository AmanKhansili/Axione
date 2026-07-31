import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetail {
  private route = inject(ActivatedRoute);
  private api = inject(Api);

  blog: any = null;
  loading = true;

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.loading = false;
      return;
    }

    this.api.getBlogBySlug(slug).subscribe({
      next: (response: any) => {
        this.blog = response;
        this.loading = false;
      },

      error: (error) => {
        console.error('Blog Detail Error:', error);

        this.blog = null;
        this.loading = false;
      },
    });
  }
}
