import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api } from '../../../services/api';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './blogs.html',
  styleUrl: './blogs.scss',
})
export class Blogs implements OnInit {
  private api = inject(Api);
  private toastr = inject(ToastrService);

  blogs: any[] = [];
  filteredBlogs: any[] = [];
  search = '';
  loading = true;

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.api.getBlogs().subscribe({
      next: (response: any) => {
        this.blogs = response;
        this.filteredBlogs = response;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  searchBlogs() {
    const value = this.search.toLowerCase().trim();

    this.filteredBlogs = this.blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(value) || blog.category.toLowerCase().includes(value),
    );
  }

  deleteBlog(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this blog?');

    if (!confirmDelete) {
      return;
    }

    this.api.deleteBlog(id).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message);

        this.blogs = this.blogs.filter((blog) => blog.id !== id);
        this.filteredBlogs = this.filteredBlogs.filter((blog) => blog.id !== id);
      },

      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }
}
