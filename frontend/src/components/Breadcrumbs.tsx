import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);

    return (
      <li key={routeTo} className="flex items-center">
        <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
        {isLast ? (
          <span className="text-foreground font-medium">{displayName}</span>
        ) : (
          <Link
            to={routeTo}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {displayName}
          </Link>
        )}
      </li>
    );
  });

  return (
    <nav className="flex h-14 items-center px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ol className="flex items-center">
        <li>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </li>
        {breadcrumbs}
      </ol>
    </nav>
  );
} 