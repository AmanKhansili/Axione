import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { ServiceDetail } from './pages/services/service-detail/service-detail';
import { Contact } from './pages/contact/contact';
import { Blog } from './pages/blog/blog';
import { BlogDetail } from './pages/blog/blog-detail/blog-detail';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { TermsConditions } from './pages/terms-conditions/terms-conditions';

import { Login } from './admin/pages/login/login';
import { Dashboard } from './admin/pages/dashboard/dashboard';
import { Blogs as AdminBlogs } from './admin/pages/blogs/blogs';
import { BlogForm } from './admin/pages/blog-form/blog-form';
import { Services as AdminServices } from './admin/pages/services/services';
import { ServiceForm } from './admin/pages/service-form/service-form';
import { Contacts as AdminContacts } from './admin/pages/contacts/contacts';
import { Newsletter as AdminNewsletter } from './admin/pages/newsletter/newsletter';
import { Team as AdminTeam } from './admin/pages/team/team';
import { TeamForm } from './admin/pages/team-form/team-form';

import { DashboardLayout } from './admin/layout/dashboard-layout/dashboard-layout';
import { authGuard } from './admin/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Axione Solutions | AI, Web Development & Digital Solutions',
  },
  { path: 'about', component: About, title: 'About Us | Axione Solutions' },
  { path: 'services', component: Services, title: 'Digital & AI Services | Axione Solutions' },
  { path: 'services/:slug', component: ServiceDetail },
  { path: 'blog', component: Blog, title: 'Technology & AI Blog | Axione Solutions' },
  { path: 'blog/:slug', component: BlogDetail },
  { path: 'contact', component: Contact, title: 'Contact Us | Axione Solutions' },
  {
    path: 'privacy-policy',
    component: PrivacyPolicy,
    title: 'Privacy Policy | Axione Solutions',
  },

  {
    path: 'terms-and-conditions',
    component: TermsConditions,
    title: 'Terms & Conditions | Axione Solutions',
  },

  { path: 'admin/login', component: Login },
  {
    path: 'admin',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'blogs', component: AdminBlogs },
      { path: 'blogs/add', component: BlogForm },
      { path: 'blogs/edit/:id', component: BlogForm },
      { path: 'services', component: AdminServices },
      { path: 'services/add', component: ServiceForm },
      { path: 'services/edit/:id', component: ServiceForm },
      { path: 'contacts', component: AdminContacts },
      { path: 'newsletter', component: AdminNewsletter },
      { path: 'team', component: AdminTeam },
      { path: 'team/add', component: TeamForm },
      { path: 'team/edit/:id', component: TeamForm },
    ],
  },

  { path: '**', redirectTo: '' },
];
