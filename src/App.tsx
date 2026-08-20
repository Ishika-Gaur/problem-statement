import { useEffect, useMemo, useState } from "react";
import {
  Person,
  QueueEvent,
  counters,
  eligible,
  rankQueue,
  scoreBreakdown,
} from "./queueEngine";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DoorOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorPlay,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Signal,
  Users,
  UserRound,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const seed: Person[] = [
  {
    token: "A123",
    name: "Maya Patel",
    service: "Account services",
    wait: 28,
    urgency: 1,
    status: "serving",
    joinedAt: 1,
  },
  {
    token: "A124",
    name: "Rohan Sharma",
    service: "Account services",
    wait: 22,
    urgency: 1,
    status: "waiting",
    joinedAt: 2,
    previousPosition: 1,
  },
  {
    token: "A125",
    name: "Nisha Singh",
    service: "Account services",
    wait: 19,
    urgency: 3,
    status: "waiting",
    joinedAt: 3,
    previousPosition: 2,
  },
  {
    token: "A126",
    name: "Dev Kapoor",
    service: "Account services",
    wait: 14,
    urgency: 2,
    status: "waiting",
    joinedAt: 4,
    previousPosition: 3,
  },
];
const useQueue = () => {
  const [q, setQ] = useState<Person[]>(() => rankQueue(seed));
  const [events, setEvents] = useState<QueueEvent[]>([]);
  const [online] = useState(true);
  const emit = (type: QueueEvent["type"], message: string) =>
    setEvents((e) => [{ type, message, at: Date.now() }, ...e].slice(0, 4));
  useEffect(() => {
    const timer = setInterval(
      () =>
        setQ((x) =>
          rankQueue(
            x.map((p) =>
              p.status === "waiting" ? { ...p, wait: p.wait + 1 } : p,
            ),
          ),
        ),
      15000,
    );
    return () => clearInterval(timer);
  }, []);
  const next = () => {
    const counter = counters[2];
    setQ((x) => {
      const completed = x.map((p) =>
        p.status === "serving" ? { ...p, status: "complete" as const } : p,
      );
      const candidate = rankQueue(completed)
        .filter((p) => eligible(p, counter))
        .sort(
          (a, b) =>
            scoreBreakdown(b, counter).total - scoreBreakdown(a, counter).total,
        )[0];
      if (!candidate) return completed;
      emit(
        "token_called",
        `${candidate.token} was called at ${counter.name}; selected for its eligible priority score.`,
      );
      return rankQueue(
        completed.map((p) =>
          p.token === candidate.token
            ? {
                ...p,
                status: "serving" as const,
                changeReason:
                  "Called: highest eligible priority at Counter 03.",
              }
            : p,
        ),
      );
    });
  };
  const skip = () =>
    setQ((x) => {
      const current = x.find((p) => p.status === "serving");
      if (current)
        emit(
          "token_skipped",
          `${current.token} marked no-show. Queue and ETA recalculated.`,
        );
      return rankQueue(
        x.map((p) =>
          p.status === "serving"
            ? {
                ...p,
                status: "no-show" as const,
                changeReason:
                  "No-show: counter released and queue recalculated.",
              }
            : p,
        ),
      );
    });
  const cancel = (token: string) => {
    emit(
      "queue_left",
      `${token} left the queue. Everyone’s ETA has been recalculated.`,
    );
    setQ((x) =>
      rankQueue(
        x.map((p) =>
          p.token === token
            ? {
                ...p,
                status: "cancelled" as const,
                changeReason: "Cancelled by customer.",
              }
            : p,
        ),
      ),
    );
  };
  const join = (
    name: string,
    urgency: number,
    service = "Account services",
  ) => {
    const token = `A${127 + q.length}`;
    const p: Person = {
      token,
      name,
      service,
      wait: 0,
      urgency,
      status: "waiting",
      joinedAt: Date.now(),
      previousPosition: 99,
      changeReason:
        "Joined: priority calculated from urgency, service match, and fairness.",
    };
    emit("queue_joined", `${token} joined the live queue.`);
    setQ((x) => rankQueue([...x, p]));
    return p;
  };
  return { q, online, next, skip, cancel, join, setQ, events };
};
const queueStore = useQueue; // mock WebSocket/Supabase-Realtime style event stream; replace emit/commit with channel broadcasts in production
const C = ({ children, className = "" }: any) => (
  <div className={"card " + className}>{children}</div>
);
const Tag = ({ children, type = "blue" }: { children: any; type?: string }) => (
  <span className={"tag " + type}>{children}</span>
);
const Logo = () => (
  <Link className="logo" to="/">
    <span>
      <Zap size={19} />
    </span>
    SmartQueue
  </Link>
);
function PublicNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Logo />
      <button className="mobile" onClick={() => setOpen(!open)}>
        <Menu />
      </button>
      <nav className={open ? "open" : ""}>
        <a href="#features">Features</a>
        <a href="#how">How it works</a>
        <a href="#use">Use cases</a>
        <Link to="/login">Log in</Link>
        <Link className="button small" to="/register">
          Get started <ArrowRight size={15} />
        </Link>
      </nav>
    </header>
  );
}
function Landing() {
  return (
    <>
      <PublicNav />
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
              <Link className="button" to="/register">
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
            <p className="muted">You’ll get notified when it’s your turn.</p>
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
            <Link className="text-link" to="/register">
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
            <Link className="button" to="/register">
              Get started for free <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
const Footer = () => (
  <footer>
    <Logo />
    <span>© 2026 SmartQueue. Designed for better service.</span>
    <span>Privacy · Terms · Support</span>
  </footer>
);
function Auth() {
  const nav = useNavigate();
  const reg = useLocation().pathname === "/register";
  return (
    <div className="auth">
      <Link to="/" className="back">
        ← Back to home
      </Link>
      <C>
        <Logo />
        <Tag>{reg ? "START FOR FREE" : "WELCOME BACK"}</Tag>
        <h1>{reg ? "Build better queues." : "Sign in to SmartQueue."}</h1>
        <p>
          {reg
            ? "Your 14-day trial includes every feature."
            : "Manage queues, not confusion."}
        </p>
        {reg && (
          <label>
            Organization name
            <input placeholder="Acme Services" />
          </label>
        )}
        <label>
          Email address
          <input placeholder="you@company.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="••••••••" />
        </label>
        <button
          className="button full"
          onClick={() => nav(reg ? "/user" : "/admin")}
        >
          {reg ? "Create account" : "Sign in"} <ArrowRight size={16} />
        </button>
        <p className="center">
          {reg ? "Already have an account?" : "New to SmartQueue?"}{" "}
          <Link to={reg ? "/login" : "/register"}>
            {reg ? "Sign in" : "Create account"}
          </Link>
        </p>
        <div className="demo">
          Demo access: <Link to="/user">Customer</Link> ·{" "}
          <Link to="/staff">Staff</Link> · <Link to="/admin">Admin</Link>
        </div>
      </C>
    </div>
  );
}
const priority = (p: Person) => scoreBreakdown(p, counters[2]).total;
function AppShell({ role, children }: any) {
  let links =
    role === "admin"
      ? [
          ["Dashboard", "/admin", LayoutDashboard],
          ["Live queues", "/admin/queues", Activity],
          ["Staff", "/admin/staff", Users],
          ["Counters", "/admin/counters", MonitorPlay],
          ["Analytics", "/admin/analytics", BarChart3],
          ["Settings", "#", Settings],
        ]
      : role === "staff"
        ? [
            ["My counter", "/staff", MonitorPlay],
            ["History", "/staff/history", Clock3],
            ["Settings", "#", Settings],
          ]
        : [
            ["Overview", "/user", LayoutDashboard],
            ["Find a queue", "/user/find", Search],
            ["My history", "/user/history", Clock3],
            ["Profile", "#", UserRound],
          ];
  return (
    <div className="app-shell">
      <aside>
        <Logo />
        <div className="role">
          <span className={"role-dot " + role} />
          {role} portal
        </div>
        <nav>
          {links.map(([l, u, I]: any) => (
            <Link
              className={useLocation().pathname === u ? "active" : ""}
              to={u}
            >
              <I size={18} />
              {l}
            </Link>
          ))}
        </nav>
        <div className="side-user">
          <div className="avatar">
            {role === "admin" ? "SA" : role === "staff" ? "JK" : "IP"}
          </div>
          <span>
            <b>
              {role === "admin"
                ? "Sarah Admin"
                : role === "staff"
                  ? "Jordan Kim"
                  : "Ishaan Patel"}
            </b>
            <small>{role}@smartqueue.co</small>
          </span>
          <LogOut size={16} />
        </div>
      </aside>
      <div className="app-main">
        <header className="app-top">
          <div className="mobile-logo">
            <Logo />
          </div>
          <span className="online">
            <i /> Live
          </span>
          <button className="icon">
            <Bell size={18} />
            <em />
          </button>
          <div className="avatar">
            {role === "admin" ? "SA" : role === "staff" ? "JK" : "IP"}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
function User({ store }: any) {
  const { q, cancel, events } = store;
  const location = useLocation();
  const [joined, setJoined] = useState<Person | null>(
    location.state?.joined || null,
  );
  const active = joined && q.find((x: Person) => x.token === joined.token);
  const ranked = rankQueue(q);
  const position = active
    ? ranked
        .filter((x) => x.status === "waiting")
        .findIndex((x) => x.token === active.token) + 1
    : 0;
  const details = active ? scoreBreakdown(active, counters[2]) : null;
  const leave = () => {
    if (active) cancel(active.token);
    setJoined(null);
  };
  return (
    <AppShell role="user">
      <PageTitle
        eyebrow="GOOD AFTERNOON, ISHAAN"
        title={active ? "Your place in line" : "Your queue, on your time."}
        action={
          !active && (
            <Link className="button" to="/user/find">
              <Plus size={16} /> Join a queue
            </Link>
          )
        }
      />
      {active ? (
        <div className="user-grid">
          <C className="ticket">
            <div className="ticket-head">
              <Tag type="green">● LIVE QUEUE</Tag>
              <span>Downtown Service Center</span>
            </div>
            <small>YOUR TOKEN</small>
            <h1>{active.token}</h1>
            <div className="ticket-data">
              <div>
                <small>YOUR POSITION</small>
                <b>#{active.status === "serving" ? 0 : position}</b>
              </div>
              <div>
                <small>ESTIMATED WAIT</small>
                <b>
                  {active.status === "serving"
                    ? "Now"
                    : Math.max(2, position * 4)}{" "}
                  min
                </b>
              </div>
            </div>
            <div className="now">
              <div className="avatar">MP</div>
              <span>
                <small>NOW SERVING</small>
                <b>
                  {q.find((p: Person) => p.status === "serving")?.token || "—"}{" "}
                  · Counter 03
                </b>
              </span>
              <Signal color="#18a56c" />
            </div>
            <div className="priority">
              <span>
                Priority score <b>{details?.total}</b>
              </span>
              <span>
                Urgency +{details?.urgency} · Waiting time +{details?.waiting} ·
                Service match +{details?.service} · Fairness +
                {details?.fairness}
              </span>
              <span>{active.changeReason}</span>
            </div>
            <button className="danger-link" onClick={leave}>
              Cancel / leave this queue
            </button>
          </C>
          <div>
            <C>
              <h3>Queue progress</h3>
              <div className="large-stat">
                {Math.max(0, position - 1)}
                <small>people ahead</small>
              </div>
              <div className="progress">
                <i style={{ width: `${Math.min(90, 25 + position * 15)}%` }} />
              </div>
            </C>
            <C>
              <h3>Live updates</h3>
              <p>
                {events[0]?.message ||
                  "Waiting-time aging protects fair access for every customer."}
              </p>
              <button className="text-link">
                Realtime connected <ChevronRight size={15} />
              </button>
            </C>
          </div>
        </div>
      ) : (
        <Empty
          title="Ready when you are."
          text="Join a queue digitally and spend your waiting time your way."
          button="Find an organization"
          to="/user/find"
        />
      )}
      <div className="history">
        <h2>Recent visits</h2>
        <C>
          <div className="row">
            <span className="avatar">DS</span>
            <span>
              <b>Downtown Service Center</b>
              <small>Account services · Aug 18, 2026</small>
            </span>
            <Tag type="green">Completed</Tag>
            <ChevronRight size={18} />
          </div>
        </C>
      </div>
    </AppShell>
  );
}
function Find({ store }: any) {
  const nav = useNavigate();
  const [service, setService] = useState("Account services");
  return (
    <AppShell role="user">
      <PageTitle eyebrow="JOIN A QUEUE" title="Where do you need to go?" />
      <div className="find">
        <C>
          <div className="search">
            <Search size={19} />
            <input
              placeholder="Search organizations or locations"
              value="Downtown"
              readOnly
            />
          </div>
          <h3>Nearby organizations</h3>
          {[
            "Downtown Service Center",
            "Northside Community Hub",
            "City Health Clinic",
          ].map((n, i) => (
            <div className={"org " + (!i ? "selected" : "")}>
              <span className="avatar">{i ? "CH" : "DS"}</span>
              <span>
                <b>{n}</b>
                <small>
                  {i ? "2.4" : "0.8"} km away ·{" "}
                  {i ? "Open" : "Open until 6:00 PM"}
                </small>
              </span>
              {!i && <CheckCircle2 color="#1769e8" />}
            </div>
          ))}
        </C>
        <C>
          <Tag>STEP 2 OF 2</Tag>
          <h2>Select a service</h2>
          {[
            "Account services",
            "Document verification",
            "Payments & billing",
          ].map((s, i) => (
            <button
              onClick={() => setService(s)}
              className={"service " + (service === s ? "chosen" : "")}
            >
              <span>
                <b>{s}</b>
                <small>{[12, 8, 5][i]} min estimated wait</small>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
          <div className="urgency">
            <b>How urgent is this?</b>
            <div>
              {["Standard", "Soon", "Urgent"].map((x, i) => (
                <button className={i === 0 ? "selected" : ""}>{x}</button>
              ))}
            </div>
          </div>
          <button
            className="button full"
            onClick={() => {
              const p = store.join("Ishaan Patel", 1);
              nav("/user", { state: { joined: p } });
            }}
          >
            Get my token <ArrowRight size={16} />
          </button>
        </C>
      </div>
    </AppShell>
  );
}
function Staff({ store }: any) {
  const { q, next, skip, events } = store;
  const serving = q.find((x: Person) => x.status === "serving");
  const waiting = rankQueue(q).filter((x: Person) => x.status === "waiting");
  return (
    <AppShell role="staff">
      <PageTitle
        eyebrow="COUNTER 03 · ACTIVE"
        title="Good afternoon, Jordan."
      />
      <div className="staff-grid">
        <C className="current">
          <Tag type="green">IN SERVICE</Tag>
          <h2>{serving?.token || "No eligible customer"}</h2>
          <p>
            {serving?.name ||
              "Counter is selecting the best eligible customer."}{" "}
            {serving && `· ${serving.service}`}
          </p>
          <div className="actions">
            <button className="button" onClick={next}>
              <CheckCircle2 size={16} /> Complete / call next
            </button>
            <button className="button ghost" onClick={skip}>
              No-show
            </button>
          </div>
        </C>
        <C>
          <h3>Counter status</h3>
          <div className="status-toggle">
            <span>
              <i /> Available · Account services
            </span>
            <button>Change</button>
          </div>
          <hr />
          <small>REALTIME EVENT</small>
          <p>
            {events[0]?.message ||
              "Compatible service and staff availability determine the next call."}
          </p>
        </C>
      </div>
      <section className="table-section">
        <div className="section-head">
          <div>
            <Tag>PRIORITY ORDER</Tag>
            <h2>Upcoming eligible queue</h2>
          </div>
          <span>{waiting.length} waiting</span>
        </div>
        <C>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Token</th>
                <th>Service</th>
                <th>Score</th>
                <th>Why this rank</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {waiting.map((p: Person, i: number) => {
                const d = scoreBreakdown(p, counters[2]);
                return (
                  <tr>
                    <td>#{i + 1}</td>
                    <td>
                      <b>{p.token}</b>
                    </td>
                    <td>{p.service}</td>
                    <td>
                      <Tag type={d.total > 60 ? "orange" : "blue"}>
                        {d.total}
                      </Tag>
                    </td>
                    <td>
                      <small>{p.changeReason}</small>
                    </td>
                    <td>
                      <button className="text-link" onClick={next}>
                        Select next
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </C>
      </section>
    </AppShell>
  );
}
const waitData = [
    { n: "9am", v: 8 },
    { n: "11am", v: 15 },
    { n: "1pm", v: 23 },
    { n: "3pm", v: 17 },
    { n: "5pm", v: 11 },
  ],
  pie = [
    { name: "Account", value: 48 },
    { name: "Documents", value: 30 },
    { name: "Billing", value: 22 },
  ];
function Admin({ store }: any) {
  const { q, next } = store;
  const path = useLocation().pathname;
  const waiting = q.filter((x: Person) => x.status === "waiting");
  return (
    <AppShell role="admin">
      <PageTitle
        eyebrow="DOWNTOWN SERVICE CENTER"
        title={
          path.includes("analytics")
            ? "Performance analytics"
            : path.includes("staff")
              ? "Staff management"
              : path.includes("counters")
                ? "Counter management"
                : path.includes("queues")
                  ? "Live queue control"
                  : "Operations overview"
        }
        action={
          <button className="button" onClick={next}>
            <Phone size={16} /> Call next
          </button>
        }
      />
      {path.includes("analytics") ? (
        <Analytics />
      ) : path.includes("staff") ? (
        <StaffManage />
      ) : path.includes("counters") ? (
        <Counters />
      ) : (
        <>
          <div className="stats">
            {[
              ["Waiting users", waiting.length, Users, "blue"],
              ["Active queues", "04", Activity, "green"],
              ["Avg. wait time", "12m", Clock3, "orange"],
              ["Staff utilization", "78%", BarChart3, "purple"],
            ].map(([l, n, I, c]: any) => (
              <C>
                <div className={"stat-icon " + c}>
                  <I size={19} />
                </div>
                <small>{l}</small>
                <b>{n}</b>
                <span className="trend">↑ 12% from yesterday</span>
              </C>
            ))}
          </div>
          <div className="admin-grid">
            <C>
              <div className="section-head">
                <div>
                  <Tag>LIVE ACTIVITY</Tag>
                  <h2>Queue pulse</h2>
                </div>
                <span className="online">
                  <i /> Updating
                </span>
              </div>
              <ResponsiveContainer width="100%" height={215}>
                <AreaChart data={waitData}>
                  <defs>
                    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                      <stop stopColor="#1769e8" stopOpacity=".25" />
                      <stop stopColor="#1769e8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="n" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#1769e8"
                    strokeWidth={3}
                    fill="url(#g)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </C>
            <C>
              <h3>Team on shift</h3>
              {[
                ["JK", "Jordan Kim", "Counter 03", "Serving"],
                ["ML", "Mina Lee", "Counter 01", "Available"],
                ["RS", "Ravi Shah", "Counter 02", "On break"],
              ].map((x) => (
                <div className="team">
                  <span className="avatar">{x[0]}</span>
                  <span>
                    <b>{x[1]}</b>
                    <small>{x[2]}</small>
                  </span>
                  <Tag type={x[3] === "Serving" ? "green" : "blue"}>{x[3]}</Tag>
                </div>
              ))}
              <Link className="text-link" to="/admin/staff">
                Manage staff <ArrowRight size={14} />
              </Link>
            </C>
          </div>
          <section className="table-section">
            <div className="section-head">
              <div>
                <Tag>LIVE QUEUE</Tag>
                <h2>
                  {path.includes("queues")
                    ? "All waiting customers"
                    : "Needs your attention"}
                </h2>
              </div>
              <Link className="text-link" to="/admin/queues">
                View live queues <ArrowRight size={15} />
              </Link>
            </div>
            <C>
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Waiting</th>
                    <th>Priority score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {q
                    .filter((p: Person) => p.status !== "complete")
                    .map((p: Person) => (
                      <tr>
                        <td>
                          <b>{p.token}</b>
                        </td>
                        <td>{p.name}</td>
                        <td>{p.service}</td>
                        <td>{p.wait} min</td>
                        <td>
                          <span className="score">
                            {priority(p)}{" "}
                            <small>
                              Urgency +{p.urgency * 15} · Fairness +10
                            </small>
                          </span>
                        </td>
                        <td>
                          <Tag
                            type={p.status === "serving" ? "green" : "orange"}
                          >
                            {p.status}
                          </Tag>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </C>
          </section>
        </>
      )}
    </AppShell>
  );
}
function Analytics() {
  return (
    <>
      <div className="stats">
        {[
          ["Average wait", "12 min", Clock3, "blue"],
          ["Users served", "142", CheckCircle2, "green"],
          ["Peak period", "1–2 PM", Activity, "orange"],
          ["SLA met", "94%", ShieldCheck, "purple"],
        ].map(([l, n, I, c]: any) => (
          <C>
            <div className={"stat-icon " + c}>
              <I size={19} />
            </div>
            <small>{l}</small>
            <b>{n}</b>
            <span className="trend">This week</span>
          </C>
        ))}
      </div>
      <div className="admin-grid">
        <C>
          <h3>Peak-hour volume</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={waitData}>
              <XAxis dataKey="n" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="v" fill="#1769e8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </C>
        <C>
          <h3>Queue distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pie} dataKey="value" innerRadius={55} outerRadius={82}>
                {pie.map((_, i) => (
                  <Cell fill={["#1769e8", "#18a56c", "#f59e0b"][i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            Account services · 48%
            <br />
            Documents · 30%
            <br />
            Billing · 22%
          </div>
        </C>
      </div>
    </>
  );
}
function StaffManage() {
  return (
    <section className="table-section">
      <C>
        <div className="section-head">
          <h2>Team members</h2>
          <button className="button">
            <Plus size={16} /> Add staff
          </button>
        </div>
        {[
          ["Jordan Kim", "Counter 03", "78%"],
          ["Mina Lee", "Counter 01", "84%"],
          ["Ravi Shah", "Counter 02", "66%"],
        ].map((x) => (
          <div className="row">
            <span className="avatar">
              {x[0]
                .split(" ")
                .map((a) => a[0])
                .join("")}
            </span>
            <span>
              <b>{x[0]}</b>
              <small>{x[1]} · On shift</small>
            </span>
            <span>
              Utilization <b>{x[2]}</b>
            </span>
            <Tag type="green">Active</Tag>
            <ChevronRight size={18} />
          </div>
        ))}
      </C>
    </section>
  );
}
function Counters() {
  return (
    <section className="counters">
      {["Counter 01", "Counter 02", "Counter 03", "Counter 04"].map((x, i) => (
        <C>
          <MonitorPlay className="feature-icon" />
          <Tag type={i === 3 ? "orange" : "green"}>
            {i === 3 ? "Idle" : "Open"}
          </Tag>
          <h2>{x}</h2>
          <p>
            {i === 3
              ? "No staff assigned"
              : `Assigned to ${["Mina Lee", "Ravi Shah", "Jordan Kim"][i]}`}
          </p>
          <button className="text-link">
            Manage counter <ArrowRight size={15} />
          </button>
        </C>
      ))}
    </section>
  );
}
function PageTitle({ eyebrow, title, action }: any) {
  return (
    <div className="page-title">
      <div>
        <Tag>{eyebrow}</Tag>
        <h1>{title}</h1>
      </div>
      {action}
    </div>
  );
}
function Empty({ title, text, button, to }: any) {
  return (
    <C className="empty">
      <div className="empty-icon">
        <Clock3 />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button" to={to}>
        {button} <ArrowRight size={16} />
      </Link>
    </C>
  );
}
function Root() {
  const store = queueStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/user" element={<User store={store} />} />
        <Route path="/user/find" element={<Find store={store} />} />
        <Route path="/user/history" element={<User store={store} />} />
        <Route path="/staff/*" element={<Staff store={store} />} />
        <Route path="/admin/*" element={<Admin store={store} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Root;
