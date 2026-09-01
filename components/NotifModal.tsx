"use client";

import { IconX, IconBell, IconClock, IconVersion, IconCheck } from "./icons";
import type { Notification } from "@/lib/types";

export function NotifModal({
  notif,
  onAcknowledge,
  onClose,
}: {
  notif: Notification;
  onAcknowledge: () => void;
  onClose: () => void;
}) {
  const scheduleText = notif.schedule.date
    ? `${notif.schedule.date}${notif.schedule.time ? ", " + notif.schedule.time : ""} ${notif.schedule.timezone || ""}`
    : notif.schedule.label;
  const needsAck = notif.displayBehavior === "until_acknowledged";

  return (
    <div className="overlay" onClick={onClose}>
      <div className="notif-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notif-modal-head">
          <div className="notif-modal-id">
            <span className="notif-modal-ic">
              <IconBell size={18} />
            </span>
            <div>
              <div className="notif-modal-kicker">Notification</div>
              <div className="notif-modal-src">
                {notif.source} · {notif.category}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        <div className="notif-modal-body">
          <div className="notif-modal-badges">
            <span
              className={
                "badge " +
                (notif.priority === "Urgent" ? "badge-red" : "badge-gray")
              }
            >
              {notif.priority}
            </span>
            {notif.updated && (
              <span className="badge badge-green">
                <IconVersion size={12} /> UPDATED
              </span>
            )}
            <span className="notif-modal-time">{scheduleText}</span>
          </div>

          <h3 className="notif-modal-title">{notif.title}</h3>
          <p className="message-box message-box-shaded">{notif.message}</p>

          {notif.updated && notif.whatsChanged && (
            <div className="nc-changed" style={{ marginTop: 14 }}>
              <div className="nc-changed-head">
                <IconVersion size={13} /> Changes in v{notif.version}
              </div>
              <div className="nc-changed-body">{notif.whatsChanged}</div>
            </div>
          )}

          <div className="detail-card" style={{ marginTop: 14 }}>
            <div className="ic">
              <IconClock size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Schedule</div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>
                {scheduleText}
              </div>
            </div>
          </div>
        </div>

        <div className="notif-modal-foot">
          {needsAck ? (
            <>
              <span className="notif-modal-hint">
                This notification needs your acknowledgement.
              </span>
              <button className="btn btn-primary" onClick={onAcknowledge}>
                <IconCheck size={16} /> Acknowledge
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
