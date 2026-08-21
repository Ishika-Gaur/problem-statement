import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Person,
  QueueEvent,
  counters,
  eligible,
  rankQueue,
  scoreBreakdown,
} from "../queueEngine";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  MonitorPlay,
  Plus,
  Search,
  Settings,
  Signal,
  UserRound,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
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
      `${token} left the queue. Everyone's ETA has been recalculated.`,
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

function AppShell({ role, children }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  let links =
    role === "staff"
      ? [
          ["My counter", "/queue", MonitorPlay],
          ["History", "/queue/history", Clock3],
          ["Settings", "#", Settings],
        ]
        : [
            ["Overview", "/queue", LayoutDashboard],
            ["Find a queue", "/queue/find", Search],
            ["My history", "/queue/history", Clock3],
            ["Profile", "#", UserRound],
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
            {role === "staff" ? "JK" : "IP"}
          </div>
          <span>
            <b>
              {role === "staff"
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
            {role === "staff" ? "JK" : "IP"}
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
            <Link className="button" to="/queue/find">
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
          to="/queue/find"
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
              nav("/queue", { state: { joined: p } });
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

export default function Queue() {
  const store = useQueue();
  const location = useLocation();

  if (location.pathname === "/queue/find") {
    return <Find store={store} />;
  } else if (location.pathname === "/queue/staff") {
    return <Staff store={store} />;
  } else {
    return <User store={store} />;
  }
}