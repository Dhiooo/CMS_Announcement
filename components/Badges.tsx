import React from "react";
import type { NotifType, Priority, Status } from "@/lib/types";

export function TypeBadge({ type }: { type: NotifType }) {
  return (
    <span
      className={
        "badge " + (type === "Announcement" ? "badge-blue" : "badge-gray")
      }
    >
      {type}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "Urgent")
    return (
      <span className="badge badge-red">
        <span className="dot dot-red" /> Urgent
      </span>
    );
  return <span className="badge badge-gray">Normal</span>;
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { cls: string; dot: string }> = {
    Active: { cls: "badge-green", dot: "dot-green" },
    Scheduled: { cls: "badge-amber", dot: "dot-amber" },
    Draft: { cls: "badge-gray", dot: "dot-gray" },
  };
  const m = map[status];
  return (
    <span className={"status-inline"}>
      <span className={"dot " + m.dot} /> {status}
    </span>
  );
}
