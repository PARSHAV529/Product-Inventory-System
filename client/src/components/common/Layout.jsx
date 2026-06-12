import { Link, useLocation } from 'react-router-dom';
import { Package } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Package className="h-5 w-5" />
            <span>Inventory</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className={`transition-colors hover:text-foreground ${
                location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Products
            </Link>
            <Link
              to="/add"
              className={`transition-colors hover:text-foreground ${
                location.pathname === '/add' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Add Product
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
