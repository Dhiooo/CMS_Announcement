"use client";

import { useMemo, useState } from "react";
import { TypeBadge, PriorityBadge, StatusBadge } from "@/components/Badges";
import { IconPlus, IconSearch } from "@/components/icons";
import { useStore } from "@/lib/store";
import type { Status } from "@/lib/types";

const STATUS_TABS: ("All" | Status)[] = ["All", "Active", "Scheduled", "Draft"];

export function ListScreen({
  onCreate,
  onOpen,
}: {
  onCreate: () => void;
  onOpen: (id: string) => void;
}) {
  const { notifications } = useStore();
  const [tab, setTab] = useState<"All" | Status>("All");
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [priority, setPriority] = useState("All");
  const [source, setSource] = useState("All");

  const sources = useMemo(
    () => Array.from(new Set(notifications.map((n) => n.source))),
    [notifications],
  );

  const rows = useMemo(() => {
    return notifications.filter((n) => {
      if (tab !== "All" && n.status !== tab) return false;
      if (type !== "All" && n.type !== type) return false;
      if (priority !== "All" && n.priority !== priority) return false;
      if (source !== "All" && n.source !== source) return false;
      if (
        q &&
        !`${n.title} ${n.message}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [notifications, tab, type, priority, source, q]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Notification</h1>
          <p className="page-sub">
            Manage notifications and announcements across branches
          </p>
        </div>
        <button onClick={onCreate} className="btn btn-primary">
          <IconPlus size={16} /> Create Notification
        </button>
      </div>

      <div className="list-card">
        <div className="list-tabs">
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              className={"tab" + (tab === t ? " active" : "")}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="list-body">
          <div className="filters">
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: 10,
                  color: "#9ca3af",
                }}
              >
                <IconSearch size={17} />
              </span>
              <input
                className="input"
                style={{ width: "100%", paddingLeft: 36 }}
                placeholder="Search notifications..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">Type: All</option>
              <option value="Notification">Notification</option>
              <option value="Announcement">Announcement</option>
            </select>
            <select
              className="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="All">Priority: All</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
            <select
              className="select"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="All">Source: All</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Notification Title</th>
                <th>Type</th>
                <th>Source</th>
                <th>Priority</th>
                <th>Target Audience</th>
                <th>Schedule / Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n.id} onClick={() => onOpen(n.id)}>
                  <td>
                    <div className="cell-title">{n.title}</div>
                    <div className="cell-sub">
                      {n.message.split("\n")[0].slice(0, 60)}
                    </div>
                  </td>
                  <td>
                    <TypeBadge type={n.type} />
                  </td>
                  <td>{n.source}</td>
                  <td>
                    <PriorityBadge priority={n.priority} />
                  </td>
                  <td>{n.audience.label}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {n.schedule.label}
                      {n.schedule.time ? ` ${n.schedule.time}` : ""}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <StatusBadge status={n.status} />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty">
                      No notifications match your filters.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-foot">
          <span>
            Showing 1 to {rows.length} of {notifications.length} entries
          </span>
          <div className="pager">
            <button>&lsaquo;</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&rsaquo;</button>
          </div>
        </div>
      </div>
    </>
  );
}
