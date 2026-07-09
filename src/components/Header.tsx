import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "首页", to: "/" },
  { label: "作品", to: "/works" },
  { label: "服务", to: "/services" },
  { label: "关于我们", to: "/about" },
  { label: "联系", to: "/contact" },
];

const r2 = (path: string) => `https://pub-a713d9cf23ab4d0eadc1394422e1924b.r2.dev${path}`;

export default function Header() {
  const location = useLocation();
  const [heroTone, setHeroTone] = useState(location.pathname === "/");

  useEffect(() => {
    const updateTone = () => {
      setHeroTone(location.pathname === "/" && window.scrollY < window.innerHeight * 0.82);
    };

    updateTone();
    window.addEventListener("scroll", updateTone, { passive: true });
    window.addEventListener("resize", updateTone);

    return () => {
      window.removeEventListener("scroll", updateTone);
      window.removeEventListener("resize", updateTone);
    };
  }, [location.pathname]);

  return (
    <header className={`site-header ${heroTone ? "light" : ""}`}>
      <Link to="/" className="brand" aria-label="PlanA 首页">
        <img src={heroTone ? r2("/brand/plana-logo-black-transparent.png") : r2("/brand/plana-logo-transparent.png")} alt="PlanA" />
      </Link>
      <nav className="nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Link className="header-contact" to="/contact">
        项目咨询 ↗
      </Link>
    </header>
  );
}
