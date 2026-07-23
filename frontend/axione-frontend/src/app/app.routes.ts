import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
// import { Careers } from './pages/careers/careers';
import { Contact } from './pages/contact/contact';
import { Blog } from './pages/blog/blog';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'services', component: Services },
  // { path: 'careers', component: Careers },
  { path: 'blog', component: Blog },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' },
];
