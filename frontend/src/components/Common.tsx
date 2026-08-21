import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export const C = ({ children, className = "" }: any) => (
  <div className={"card " + className}>{children}</div>
);

export const Tag = ({ children, type = "blue" }: { children: any; type?: string }) => (
  <span className={"tag " + type}>{children}</span>
);

export const Logo = () => (
  <Link className="logo" to="/">
    <span>
      <Zap size={19} />
    </span>
    SmartQueue
  </Link>
);

export const Footer = () => (
  <footer>
    <Logo />
    <span>© 2026 SmartQueue. Designed for better service.</span>
    <span>Privacy · Terms · Support</span>
  </footer>
);