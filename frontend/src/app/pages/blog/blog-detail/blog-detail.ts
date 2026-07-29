import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOGS } from '../blog-data';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetail {
  blog: any;

  constructor(private route: ActivatedRoute) {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.blog = BLOGS.find((blog) => blog.slug === slug);
  }
}
