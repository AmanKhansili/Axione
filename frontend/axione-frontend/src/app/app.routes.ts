import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { ServiceDetail } from './pages/services/service-detail/service-detail';
import { Contact } from './pages/contact/contact';
import { Blog } from './pages/blog/blog';
import { BlogDetail } from './pages/blog/blog-detail/blog-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'services', component: Services },

  // Dynamic Service Detail
  { path: 'services/:slug', component: ServiceDetail },

  { path: 'blog', component: Blog },
  { path: 'blog/:slug', component: BlogDetail },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' },
];
