import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './router/PrivateRoute';
import Navbar from './components/layout/Navbar';

// Pages — Auth
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Pages — App
import DashboardPage    from './pages/dashboard/DashboardPage';
import PostListPage     from './pages/posts/PostListPage';
import PostDetailPage   from './pages/posts/PostDetailPage';
import PostCreatePage   from './pages/posts/PostCreatePage';
import PostEditPage     from './pages/posts/PostEditPage';
import MeetingsPage     from './pages/meetings/MeetingsPage';
import ProfilePage      from './pages/profile/ProfilePage';

// Pages — Admin
import AdminPanel from './pages/admin/AdminPanel';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/posts" element={
            <PrivateRoute><AppLayout><PostListPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/posts/new" element={
            <PrivateRoute><AppLayout><PostCreatePage /></AppLayout></PrivateRoute>
          } />
          <Route path="/posts/:id" element={
            <PrivateRoute><AppLayout><PostDetailPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/posts/:id/edit" element={
            <PrivateRoute><AppLayout><PostEditPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/meetings" element={
            <PrivateRoute><AppLayout><MeetingsPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><AppLayout><ProfilePage /></AppLayout></PrivateRoute>
          } />

          {/* Admin only */}
          <Route path="/admin/*" element={
            <PrivateRoute adminOnly><AppLayout><AdminPanel /></AppLayout></PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
