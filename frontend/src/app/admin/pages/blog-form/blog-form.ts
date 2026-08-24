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

  addSection(): void {
    this.blog.content.push({
      heading: '',
      text: '',
    });
  }

  removeSection(index: number): void {
    this.blog.content.splice(index, 1);
  }

  private generateId(): string {
    return 'cms' + crypto.randomUUID().replace(/-/g, '');
  }

  saveBlog(): void {
    if (
      !this.blog.title.trim() ||
      !this.blog.slug.trim() ||
      !this.blog.category.trim() ||
      !this.blog.author.trim() ||
      !this.blog.shortDescription.trim()
    ) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    const now = new Date().toISOString();

    const payload = {
      ...(this.isEdit ? {} : { id: this.generateId() }),

      title: this.blog.title.trim(),
      slug: this.blog.slug.trim(),
      category: this.blog.category.trim(),
      author: this.blog.author.trim(),
      image: this.blog.image.trim(),
      shortDescription: this.blog.shortDescription.trim(),

      date: this.blog.date,
      published: this.blog.published,
      content: this.blog.content,

      updatedAt: now,

      ...(this.isEdit ? {} : { createdAt: now }),
    };

    this.isLoading = true;

    const request = this.isEdit
      ? this.api.updateBlog(this.blogId, payload)
      : this.api.createBlog(payload);

    request.subscribe({
      next: (response: any) => {
        this.isLoading = false;

        this.toastr.success(response?.message || 'Blog saved successfully');

        this.router.navigate(['/admin/blogs']);
      },

      error: (error) => {
        this.isLoading = false;

        console.error('Save Blog Error:', error);

        this.toastr.error(error?.error?.message || error?.error?.msg || 'Unable to save blog');
      },
    });
  }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';

    if (this.blogId) {
      this.isEdit = true;
      this.loadBlog();
    }
  }

  loadBlog(): void {
    this.isLoading = true;

    this.api.getBlogById(this.blogId).subscribe({
      next: (response: any) => {
        if (!response) {
          this.toastr.error('Blog not found');
          this.router.navigate(['/admin/blogs']);
          return;
        }

        this.blog = response;
        this.isLoading = false;
      },

      error: (error) => {
        console.error('Load Blog Error:', error);

        this.isLoading = false;

        this.toastr.error(error?.error?.message || 'Unable to load blog');
      },
    });
  }

  generateSlug(): void {
    if (this.isEdit) return;

    this.blog.slug = this.blog.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-');
  }
}
