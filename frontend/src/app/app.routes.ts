import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { ServiceDetail } from './pages/services/service-detail/service-detail';
import { Contact } from './pages/contact/contact';
import { Blog } from './pages/blog/blog';
import { BlogDetail } from './pages/blog/blog-detail/blog-detail';

import { DashboardLayout } from './admin/layout/dashboard-layout/dashboard-layout';
import { Login } from './admin/pages/login/login';
import { Dashboard } from './admin/pages/dashboard/dashboard';
import { Newsletter as AdminNewsletter } from './admin/pages/newsletter/newsletter';
import { Blogs as AdminBlogs } from './admin/pages/blogs/blogs';
import { Contacts as AdminContacts } from './admin/pages/contacts/contacts';
import { Services as AdminServices } from './admin/pages/services/services';
import { Chatbot as AdminChatbot } from './admin/pages/chatbot/chatbot';

import { authGuard } from './admin/guards/auth-guard';
import { BlogForm } from './admin/pages/blog-form/blog-form';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Axione Solutions | AI, Web Development & Digital Solutions',
    data: {
      description:
        'Axione Solutions provides Agentic AI, AI automation, web development, digital marketing, UI/UX design and technology solutions.',
    },
  },

  {
    path: 'about',
    component: About,
    title: 'About Us | Axione Solutions',
    data: {
      description:
        'Learn about Axione Solutions and our approach to delivering innovative, scalable and reliable digital solutions for modern businesses.',
    },
  },

  {
    path: 'services',
    component: Services,
    title: 'Digital & AI Services | Axione Solutions',
    data: {
      description:
        'Explore web development, Agentic AI, AI automation, digital marketing, UI/UX design, and support services from Axione Solutions.',
    },
  },

  {
    path: 'services/:slug',
    component: ServiceDetail,
  },

  {
    path: 'blog',
    component: Blog,
    title: 'Technology & AI Blog | Axione Solutions',
    data: {
      description:
        'Explore insights and updates on Agentic AI, automation, web development, digital marketing and modern business technology.',
    },
  },

  {
    path: 'blog/:slug',
    component: BlogDetail,
  },

  {
    path: 'contact',
    component: Contact,
    title: 'Contact Us | Axione Solutions',
    data: {
      description:
        'Contact Axione Solutions to discuss your web development, AI automation, digital marketing, UI/UX design or technology project.',
    },
  },

  {
    path: 'admin/login',
    component: Login,
  },

  {
    path: 'admin',
    component: DashboardLayout,
    canActivate: [authGuard],

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        component: Dashboard,
      },

      {
        path: 'blogs',
        component: AdminBlogs,
      },

      {
        path: 'blogs/add',
        component: BlogForm,
      },

      {
        path: 'services',
        component: AdminServices,
      },

      {
        path: 'contacts',
        component: AdminContacts,
      },

      {
        path: 'newsletter',
        component: AdminNewsletter,
      },

      {
        path: 'chatbot',
        component: AdminChatbot,
      },
    ],
  },
];
