import { Routes } from '@angular/router';

// Website Pages
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { ServiceDetail } from './pages/services/service-detail/service-detail';
import { Contact } from './pages/contact/contact';
import { Blog } from './pages/blog/blog';
import { BlogDetail } from './pages/blog/blog-detail/blog-detail';

// Admin Pages
import { Login } from './admin/pages/login/login';
import { Dashboard } from './admin/pages/dashboard/dashboard';
import { Blogs as AdminBlogs } from './admin/pages/blogs/blogs';
import { BlogForm } from './admin/pages/blog-form/blog-form';
import { Services as AdminServices } from './admin/pages/services/services';
import { Contacts as AdminContacts } from './admin/pages/contacts/contacts';
import { Newsletter as AdminNewsletter } from './admin/pages/newsletter/newsletter';
import { Chatbot as AdminChatbot } from './admin/pages/chatbot/chatbot';

// Admin Layout
import { DashboardLayout } from './admin/layout/dashboard-layout/dashboard-layout';

// Guards
import { authGuard } from './admin/guards/auth-guard';

export const routes: Routes = [
  // Website Routes
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
        'Learn about Axione Solutions and our approach to delivering innovative, scalable and reliable digital solutions.',
    },
  },

  {
    path: 'services',
    component: Services,
    title: 'Digital & AI Services | Axione Solutions',
    data: {
      description: 'Explore our AI, Web Development, UI/UX and Digital Marketing services.',
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
      description: 'Latest insights on AI, Automation, Web Development and Technology.',
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
      description: 'Contact Axione Solutions for your next digital project.',
    },
  },

  // Admin Routes
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
        path: 'blogs/edit/:id',
        component: BlogForm,
      },

      {
        path: 'services',
        component: AdminServices,
      },

      // ServiceForm baad me add hoga
      // {
      //   path: 'services/add',
      //   component: ServiceForm,
      // },

      // {
      //   path: 'services/edit/:id',
      //   component: ServiceForm,
      // },

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

  {
    path: '**',
    redirectTo: '',
  },
];
