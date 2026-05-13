import { Link, useRouterState } from "@tanstack/react-router";
import footerHtml from "../pages-html/footer.html?raw";

const links = [
  { to: "/", label: "Home" },
  { to: "/business", label: "Business" },
  { to: "/economy", label: "Economy" },
  { to: "/finance", label: "Finance" },
  { to: "/stories", label: "Stories" },
  { to: "/podcast", label: "Podcast" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  return (
    <nav>
      <div className="nav-inner">
        <Link to="/" className="logo-block" style={{ textDecoration: "none" }}>
          <div className="logo-bar"></div>
          <div className="logo-text">
            <div className="small">THE LIBERIAN</div>
            <div className="big">Business Hour</div>
            <div className="sub">with James T. Worquea III</div>
          </div>
        </Link>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} activeOptions={{ exact: l.to === "/" }} activeProps={{ className: "active" }}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/admin" className="admin-link">⚙ Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/admin") return null;
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
}
