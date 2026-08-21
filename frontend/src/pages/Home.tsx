import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  ChevronRight,
  MonitorPlay,
  Menu,
  X,
  Search,
  ShieldCheck,
  Signal,
  Users,
  Zap,
} from "lucide-react";
import { C, Tag, Logo, Footer } from "../components/Common";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="nav">
        <Logo />
        <button className="mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
        <nav className={mobileMenuOpen ? "open" : ""}>
          <Link to="/queue" onClick={() => setMobileMenuOpen(false)}>Queue</Link>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link className="button small" to="/queue" onClick={() => setMobileMenuOpen(false)}>
            Get started <ArrowRight size={15} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div>
            <Tag>● Real-time queue intelligence</Tag>
            <h1>
              Every wait feels <i>worth it.</i>
            </h1>
            <p>
              SmartQueue turns uncertain lines into transparent, intelligent
              experiences for your customers and team.
            </p>
            <div className="actions">
              <Link className="button" to="/queue">
                Start free <ArrowRight size={17} />
              </Link>
              <a className="button ghost" href="#how">
                See how it works
              </a>
            </div>
            <div className="trust">
              <span>Trusted for better service</span>
              <b>98%</b> satisfaction <b>42%</b> less waiting
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-card"
          >
            <div className="live">
              <span>● LIVE NOW</span>
              <small>Downtown branch</small>
            </div>
            <h3>Your queue status</h3>
            <div className="token">A127</div>
            <div className="status-grid">
              <div>
                <small>POSITION</small>
                <strong>#4</strong>
              </div>
              <div>
                <small>EST. WAIT</small>
                <strong>12 min</strong>
              </div>
            </div>
            <div className="serving">
              <div className="avatar">MP</div>
              <span>
                <small>NOW SERVING</small>
                <b>A123 · Maya Patel</b>
              </span>
              <Signal color="#17a36b" />
            </div>
            <div className="progress">
              <i />
            </div>
            <p className="muted">You'll get notified when it's your turn.</p>
          </motion.div>
        </section>
        <section id="features" className="section">
          <Tag>BUILT FOR THE FLOW</Tag>
          <h2>A calmer way to manage demand.</h2>
          <p className="intro">
            One intelligent platform for every person in the queue.
          </p>
          <div className="features">
            {[
              [
                Activity,
                "Live visibility",
                "Keep every guest informed with live position and wait estimates.",
              ],
              [
                Zap,
                "Smart prioritization",
                "Balance urgency, service needs, and fairness automatically.",
              ],
              [
                BarChart3,
                "Actionable insights",
                "See patterns and make every counter count.",
              ],
            ].map(([I, t, d]: any) => (
              <C key={t}>
                <I className="feature-icon" />
                <h3>{t}</h3>
                <p>{d}</p>
                <a href="#how">
                  Explore <ChevronRight size={15} />
                </a>
              </C>
            ))}
          </div>
        </section>
        <section id="how" className="section pale">
          <Tag>HOW IT WORKS</Tag>
          <h2>Simple for people. Powerful for teams.</h2>
          <div className="steps">
            {[
              [
                "01",
                "Check in",
                "Choose a service and get your digital token.",
              ],
              [
                "02",
                "Stay informed",
                "See your live position and get notified at the right moment.",
              ],
              [
                "03",
                "Get served",
                "Arrive when called. Your team has everything ready.",
              ],
            ].map((x) => (
              <div>
                <b>{x[0]}</b>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="use" className="section use">
          <div>
            <Tag>FLEXIBLE BY DESIGN</Tag>
            <h2>Built for every place people wait.</h2>
            <p>
              From busy branches to appointment desks, make time feel respected.
            </p>
            <Link className="text-link" to="/queue">
              Find your fit <ArrowRight size={16} />
            </Link>
          </div>
          <div className="uses">
            <span>
              <Building2 />
              Banking & finance
            </span>
            <span>
              <ShieldCheck />
              Healthcare
            </span>
            <span>
              <Users />
              Government services
            </span>
            <span>
              <MonitorPlay />
              Retail & support
            </span>
          </div>
        </section>
        <section className="cta">
          <div>
            <Tag type="green">READY WHEN YOU ARE</Tag>
            <h2>Make the next wait a better one.</h2>
            <p>Start creating more transparent, efficient experiences today.</p>
            <Link className="button" to="/queue">
              Get started for free <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}