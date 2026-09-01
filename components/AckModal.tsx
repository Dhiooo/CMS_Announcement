"use client";

import { useState } from "react";
import { IconX, IconClock, IconWarn, IconVersion } from "./icons";
import type { Notification } from "@/lib/types";

export function AckModal({
  notif,
  onAcknowledge,
  onClose,
}: {
  notif: Notification;
  onAcknowledge: () => void;
  onClose: () => void;
}) {
  const [checked, setChecked] = useState(false);
  const scheduleText = notif.schedule.date
    ? `${notif.schedule.date}${notif.schedule.time ? ", " + notif.schedule.time : ""} ${notif.schedule.timezone || ""}`
    : notif.schedule.label;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-pad">
          <div className="modal-head">
            <div style={{ display: "flex", gap: 8 }}>
              {notif.priority === "Urgent" && (
                <span className="badge badge-red">
                  <IconWarn size={13} /> URGENT
                </span>
              )}
              <span className="badge badge-blue">
                {notif.source.toUpperCase()}
              </span>
            </div>
            <button className="modal-close" onClick={onClose}>
              <IconX size={18} />
            </button>
          </div>
          <h3>{notif.title}</h3>
          <p
            className="message-box"
            style={{ marginTop: 12, color: "#374151" }}
          >
            {notif.message}
          </p>

          <div className="detail-card">
            <div className="ic">
              <IconClock size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Maintenance Window</div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>
                {scheduleText}
              </div>
            </div>
          </div>

          {notif.updated && notif.whatsChanged && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--green-dark)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <IconVersion size={15} /> What&apos;s changed?
              </div>
              <div className="changed-box">{notif.whatsChanged}</div>
            </>
          )}
        </div>
        {notif.displayBehavior === "until_acknowledged" ? (
          <div className="modal-foot">
            <label className="check">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              I have read and understood this announcement.
            </label>
            <button
              className="btn btn-primary"
              disabled={!checked}
              onClick={onAcknowledge}
            >
              Acknowledge
            </button>
          </div>
        ) : (
          <div className="modal-foot" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={onAcknowledge}>
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
