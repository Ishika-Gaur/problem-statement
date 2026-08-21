export type QueueStatus =
  | "waiting"
  | "called"
  | "serving"
  | "complete"
  | "skipped"
  | "cancelled"
  | "no-show";
export type Person = {
  token: string;
  name: string;
  service: string;
  wait: number;
  urgency: number;
  status: QueueStatus;
  joinedAt: number;
  previousPosition?: number;
  changeReason?: string;
};
export type Counter = {
  id: string;
  name: string;
  services: string[];
  available: boolean;
  staff: string;
};
export type QueueEvent = {
  type:
    | "queue_updated"
    | "token_called"
    | "token_served"
    | "token_skipped"
    | "queue_joined"
    | "queue_left"
    | "counter_changed"
    | "notification";
  message: string;
  at: number;
};
export const counters: Counter[] = [
  {
    id: "c1",
    name: "Counter 01",
    services: ["Document verification"],
    available: true,
    staff: "Mina Lee",
  },
  {
    id: "c2",
    name: "Counter 02",
    services: ["Payments & billing"],
    available: true,
    staff: "Ravi Shah",
  },
  {
    id: "c3",
    name: "Counter 03",
    services: ["Account services"],
    available: true,
    staff: "Jordan Kim",
  },
];
export const scoreBreakdown = (p: Person, counter?: Counter) => {
  const urgency = p.urgency === 3 ? 40 : p.urgency === 2 ? 25 : 10;
  const waiting = Math.min(25, Math.floor(p.wait / 2));
  const service = counter?.services.includes(p.service) ? 10 : 0;
  const fairness = Math.min(25, Math.floor(p.wait / 3) + 5);
  return {
    urgency,
    waiting,
    service,
    fairness,
    total: urgency + waiting + service + fairness,
  };
};
export const eligible = (p: Person, counter?: Counter) =>
  p.status === "waiting" &&
  !!counter?.available &&
  counter.services.includes(p.service);
export const rankQueue = (queue: Person[], counter: Counter = counters[2]) => {
  const waiting = queue.filter((p) => p.status === "waiting");
  const ranked = [...waiting]
    .sort(
      (a, b) =>
        scoreBreakdown(b, counter).total - scoreBreakdown(a, counter).total ||
        a.joinedAt - b.joinedAt,
    )
    .map((p, index) => {
      const next = index + 1;
      const previous = p.previousPosition || next;
      return {
        ...p,
        previousPosition: next,
        changeReason:
          next < previous
            ? "Moved up: urgency, aging, or a compatible counter increased eligibility."
            : next > previous
              ? "Moved down: another eligible guest has a higher current priority."
              : "Holding: priority and fairness are balanced.",
      };
    });
  return [...queue.filter((p) => p.status !== "waiting"), ...ranked];
};
