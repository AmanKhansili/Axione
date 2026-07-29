import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOGS } from './blog-data';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  blogs = BLOGS;
}