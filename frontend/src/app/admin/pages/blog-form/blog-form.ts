import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../services/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './blog-form.html',
  styleUrl: './blog-form.scss',
})
export class BlogForm implements OnInit {
  private api = inject(Api);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  isEdit = false;

  blogId = '';

  isLoading = false;

  blog = {
    title: '',
    slug: '',
    category: '',
    author: '',
    image: '',
    shortDescription: '',
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
    published: false,
    content: [
      {
        heading: '',
        text: '',
      },
    ],
  };

  addSection() {
    this.blog.content.push({
      heading: '',
      text: '',
    });
  }

  removeSection(index: number) {
    this.blog.content.splice(index, 1);
  }

  saveBlog() {
    if (
      !this.blog.title ||
      !this.blog.slug ||
      !this.blog.category ||
      !this.blog.author ||
      !this.blog.shortDescription
    ) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    this.isLoading = true;

    const request = this.isEdit
      ? this.api.updateBlog(this.blogId, this.blog)
      : this.api.createBlog(this.blog);

    request.subscribe({
      next: (response: any) => {
        this.isLoading = false;

        this.toastr.success(response.message);

        this.router.navigate(['/admin/blogs']);
      },

      error: (error) => {
        this.isLoading = false;

        this.toastr.error(error.error.message);
      },
    });
  }

  ngOnInit() {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';

    if (this.blogId) {
      this.isEdit = true;
      this.loadBlog();
    }
  }

  loadBlog() {
    this.api.getBlogById(this.blogId).subscribe({
      next: (response: any) => {
        this.blog = response;
      },

      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }
  generateSlug() {
    this.blog.slug = this.blog.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }
}
