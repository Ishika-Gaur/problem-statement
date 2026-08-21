import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Zap, Users, ShieldCheck, BarChart3, Menu, X } from "lucide-react";
import { C, Tag, Logo, Footer } from "../components/Common";

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="nav">
        <Logo />
        <button className="mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
        <nav className={mobileMenuOpen ? "open" : ""}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/queue" onClick={() => setMobileMenuOpen(false)}>Queue</Link>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          <Link className="button small" to="/queue" onClick={() => setMobileMenuOpen(false)}>
            Get started <ArrowRight size={15} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="section">
          <div className="auth" style={{ background: "transparent", minHeight: "auto", padding: "40px 0" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <Tag>ABOUT SMARTQUEUE</Tag>
              <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
                Transforming waiting into a better experience
              </h1>
              <p style={{ fontSize: "18px", color: "#61708a", lineHeight: "1.6" }}>
                SmartQueue is an intelligent queue management system designed to eliminate
                the frustration of waiting. Our platform combines real-time visibility,
                smart prioritization, and actionable insights to create seamless experiences
                for both customers and service providers.
              </p>
            </div>
          </div>
        </section>

        <section className="section pale">
          <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Our Mission</h2>
          <div className="features">
            <C>
              <Zap className="feature-icon" />
              <h3>Efficiency First</h3>
              <p>
                We believe that time is precious. Our smart algorithms optimize queue flow
                to reduce wait times while ensuring fair access for everyone.
              </p>
            </C>
            <C>
              <Users className="feature-icon" />
              <h3>Customer-Centric</h3>
              <p>
                Every feature is designed with the customer in mind. From live updates to
                mobile notifications, we keep people informed and in control.
              </p>
            </C>
            <C>
              <ShieldCheck className="feature-icon" />
              <h3>Fair & Transparent</h3>
              <p>
                Our priority scoring system balances urgency, service needs, and fairness
                to ensure equitable access for all customers.
              </p>
            </C>
          </div>
        </section>

        <section className="section">
          <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Why Choose SmartQueue?</h2>
          <div className="features">
            <C>
              <BarChart3 className="feature-icon" />
              <h3>Data-Driven Insights</h3>
              <p>
                Make informed decisions with real-time analytics on queue performance,
                staff utilization, and customer satisfaction metrics.
              </p>
            </C>
            <C>
              <Zap className="feature-icon" />
              <h3>Easy Integration</h3>
              <p>
                Seamlessly integrate with your existing systems. Our flexible API and
                webhook support ensure smooth implementation.
              </p>
            </C>
            <C>
              <Users className="feature-icon" />
              <h3>Scalable Solution</h3>
              <p>
                From single-location branches to multi-site operations, SmartQueue scales
                to meet your needs without compromising performance.
              </p>
            </C>
          </div>
        </section>

        <section className="section" style={{ textAlign: "center" }}>
          <C style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2>Ready to transform your queue experience?</h2>
            <p style={{ marginBottom: "30px" }}>
              Join hundreds of organizations already using SmartQueue to deliver
              exceptional service experiences.
            </p>
            <Link className="button" to="/queue">
              Get started today <ArrowRight size={16} />
            </Link>
          </C>
        </section>
      </main>
      <Footer />
    </>
  );
}