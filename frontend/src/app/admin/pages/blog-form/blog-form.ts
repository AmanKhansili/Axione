import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuillEditorComponent } from 'ngx-quill';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [FormsModule, QuillEditorComponent],
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

  // =====================================================
  // Quill Editor Configuration
  // =====================================================

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  // =====================================================
  // Blog Object
  // =====================================================

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

  // =====================================================
  // Add Content Section
  // =====================================================

  addSection(): void {
    this.blog.content.push({
      heading: '',
      text: '',
    });
  }

  // =====================================================
  // Remove Content Section
  // =====================================================

  removeSection(index: number): void {
    if (this.blog.content.length <= 1) {
      return;
    }

    this.blog.content.splice(index, 1);
  }

  // =====================================================
  // Generate ID
  // =====================================================

  private generateId(): string {
    return 'cms' + crypto.randomUUID().replace(/-/g, '');
  }

  // =====================================================
  // Save Blog
  // =====================================================

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

  // =====================================================
  // Initialize
  // =====================================================

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';

    if (this.blogId) {
      this.isEdit = true;
      this.loadBlog();
    }
  }

  // =====================================================
  // Load Blog For Edit
  // =====================================================

  loadBlog(): void {
    this.isLoading = true;

    this.api.getBlogById(this.blogId).subscribe({
      next: (response: any) => {
        if (!response) {
          this.toastr.error('Blog not found');

          this.router.navigate(['/admin/blogs']);

          return;
        }

        this.blog = {
          title: response.title || '',
          slug: response.slug || '',
          category: response.category || '',
          author: response.author || '',
          image: response.image || '',
          shortDescription: response.shortDescription || '',

          date:
            response.date ||
            new Date().toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            }),

          published: response.published === true,

          content:
            Array.isArray(response.content) && response.content.length > 0
              ? response.content.map((section: any) => ({
                  heading: section.heading || '',
                  text: section.text || '',
                }))
              : [
                  {
                    heading: '',
                    text: '',
                  },
                ],
        };

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Load Blog Error:', error);

        this.isLoading = false;

        this.toastr.error(error?.error?.message || 'Unable to load blog');
      },
    });
  }

  // =====================================================
  // Generate Slug
  // =====================================================

  generateSlug(): void {
    if (this.isEdit) {
      return;
    }

    this.blog.slug = this.blog.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-');
  }
}
