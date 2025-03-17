import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import BlogList from './pages/Blog/BlogList';
import BlogPost from './pages/Blog/BlogPost';
import ProductList from './pages/Products/ProductList';
import Services from './pages/Services';
import Events from './pages/Events';
import AdminDashboard from './pages/Admin/Dashboard';
import PostsManagement from './pages/Admin/PostsManagement';
import Settings from './pages/Admin/Settings';
import AdminLayout from './components/layout/AdminLayout';
import NewPost from './pages/Admin/Posts/NewPost';
import EditPost from './pages/Admin/Posts/EditPost';
import ProductDetail from './pages/Products/ProductDetail';
import ProductsManagement from './pages/Admin/ProductsManagement';
import NewProduct from './pages/Admin/Products/NewProduct';
import EditProduct from './pages/Admin/Products/EditProduct';
import Return from './pages/Products/Return';
import Checkout from './pages/Products/Checkout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'blog', element: <BlogList /> },
      { path: 'blog/:postId', element: <BlogPost /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/:productId', element: <ProductDetail /> },
      { path: 'return', element: <Return /> },
      { path: 'services', element: <Services /> },
      { path: 'events', element: <Events /> },
      { path: 'checkout/:productId', element: <Checkout /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'posts', element: <PostsManagement /> },
      { path: 'posts/new', element: <NewPost /> },
      { path: 'posts/edit/:postId', element: <EditPost /> },
      { path: 'products', element: <ProductsManagement /> },
      { path: 'products/new', element: <NewProduct /> },
      { path: 'products/edit/:productId', element: <EditProduct /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]); 