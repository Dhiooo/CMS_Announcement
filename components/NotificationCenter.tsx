"use client";

import { useState } from "react";
import { IconBell, IconMegaphone, IconVersion } from "./icons";
import type { Notification } from "@/lib/types";

export function NotificationCenter({
  items,
  onOpen,
  onMarkAllRead,
}: {
  items: Notification[];
  onOpen: (n: Notification) => void;
  onMarkAllRead?: (items: Notification[]) => void;
}) {
  const [tab, setTab] = useState<"Notifications" | "Announcements">(
    "Notifications",
  );
  const isAnn = tab === "Announcements";
  const list = items.filter((n) =>
    isAnn ? n.type === "Announcement" : n.type === "Notification",
  );
  const total = items.length;

  return (
    <div className={"nc" + (isAnn ? " nc-red" : "")}>
      <div className="nc-head">
        <div className="nc-title">
          <IconBell size={18} /> Notifications
          <span className="nc-total">{total} Total</span>
        </div>
        <button className="nc-markread" onClick={() => onMarkAllRead?.(list)}>
          Mark all as read
        </button>
      </div>

      <div className="nc-tabs">
        <button
          className={"nc-tab" + (!isAnn ? " active" : "")}
          onClick={() => setTab("Notifications")}
        >
          Notifications
        </button>
        <button
          className={"nc-tab" + (isAnn ? " active" : "")}
          onClick={() => setTab("Announcements")}
        >
          Announcements
        </button>
      </div>

      <div className="nc-list">
        {list.map((n) => {
          const highlight = !n.readByUser;
          const urgent = n.priority === "Urgent";
          return (
            <div
              key={n.id}
              className={"nc-item" + (highlight ? " unread" : "")}
              onClick={() => onOpen(n)}
            >
              <div className="nc-ic">
                {isAnn ? <IconMegaphone size={16} /> : <IconBell size={16} />}
              </div>
              <div className="nc-body">
                <div className="nc-t-row">
                  <span className="nc-t">
                    {n.title}
                    {isAnn && urgent && (
                      <span className="nc-badge-urgent">URGENT</span>
                    )}
                  </span>
                  <span className="nc-time">{n.schedule.label}</span>
                </div>
                {n.updated && (
                  <div className="nc-updated">
                    <IconVersion size={12} /> UPDATED
                  </div>
                )}
                <div className="nc-msg">{n.message.split("\n")[0]}</div>
                {n.updated && n.whatsChanged && (
                  <div className="nc-changed">
                    <div className="nc-changed-head">
                      <IconVersion size={13} /> Changes in v{n.version}
                    </div>
                    <div className="nc-changed-body">{n.whatsChanged}</div>
                  </div>
                )}
                {isAnn && <div className="nc-src">Source: {n.source}</div>}
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="empty">No {tab.toLowerCase()} yet.</div>
        )}
      </div>

      <div className="nc-foot">
        <button className="nc-foot-link">View all {tab.toLowerCase()}</button>
      </div>
    </div>
  );
}
