import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Person,
  counters,
  eligible,
  rankQueue,
  scoreBreakdown,
} from "../queueEngine";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  MonitorPlay,
  Plus,
  Settings,
  ShieldCheck,
  Users,
  Phone,
  Menu,
  X,
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
import { C, Tag, Logo } from "../components/Common";

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
  const [events, setEvents] = useState<any[]>([]);
  const [online] = useState(true);
  const emit = (type: any, message: string) =>
    setEvents((e) => [{ type, message, at: Date.now() }, ...e].slice(0, 4));
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
  return { q, online, next, events };
};

const priority = (p: Person) => scoreBreakdown(p, counters[2]).total;

function AppShell({ role, children }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      : [
          ["Overview", "/admin", LayoutDashboard],
          ["Analytics", "/admin/analytics", BarChart3],
        ];
  return (
    <div className="app-shell">
      <aside className={mobileMenuOpen ? "mobile-open" : ""}>
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
              onClick={() => setMobileMenuOpen(false)}
            >
              <I size={18} />
              {l}
            </Link>
          ))}
        </nav>
        <div className="side-user">
          <div className="avatar">
            {role === "admin" ? "SA" : "IP"}
          </div>
          <span>
            <b>
              {role === "admin"
                ? "Sarah Admin"
                : "Ishaan Patel"}
            </b>
            <small>{role}@smartqueue.co</small>
          </span>
          <LogOut size={16} />
        </div>
      </aside>
      <div className="app-main">
        <header className="app-top">
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          <div className="mobile-logo">
            <Logo />
          </div>
          <span className="online">
            <i /> Live
          </span>
          <div className="avatar">
            {role === "admin" ? "SA" : "IP"}
          </div>
        </header>
        {children}
      </div>
    </div>
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

export default function Admin() {
  const store = useQueue();
  const path = useLocation().pathname;
  const waiting = store.q.filter((x: Person) => x.status === "waiting");

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
          <button className="button" onClick={store.next}>
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
                  {store.q
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