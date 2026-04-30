import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFab from "./components/WhatsAppFab";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import CategoryPage from "./pages/CategoryPage";
import ServicePage from "./pages/ServicePage";
import ContactPage from "./pages/ContactPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminServiceEdit from "./pages/admin/AdminServiceEdit";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSite from "./pages/admin/AdminSite";
import AdminPublish from "./pages/admin/AdminPublish";
import AdminSupabase from "./pages/admin/AdminSupabase";

function PublicShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <PublicShell>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/servicio/:slug" element={<ServicePage />} />
            <Route path="/contacto" element={<ContactPage />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="servicios" element={<AdminServices />} />
              <Route path="servicios/:slug" element={<AdminServiceEdit />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="sitio" element={<AdminSite />} />
              <Route path="publicar" element={<AdminPublish />} />
              <Route path="supabase" element={<AdminSupabase />} />
            </Route>

            <Route path="*" element={<HomePage />} />
          </Routes>
        </PublicShell>
      </div>
    </HashRouter>
  );
}
