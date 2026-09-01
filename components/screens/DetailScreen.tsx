"use client";

import { useState, type ReactNode } from "react";
import { TypeBadge, PriorityBadge } from "@/components/Badges";
import {
  IconVersion,
  IconTrash,
  IconChart,
  IconChevronLeft,
  IconSend,
  IconEye,
  IconChecks,
  IconMail,
} from "@/components/icons";
import { useStore } from "@/lib/store";
import { formatDateTime, pct } from "@/lib/format";

export function DetailScreen({
  id,
  onBack,
  onEdit,
  onDeleted,
}: {
  id: string;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDeleted: () => void;
}) {
  const { getById, deleteNotification } = useStore();
  const n = getById(id);
  const [confirmDel, setConfirmDel] = useState(false);

  if (!n) {
    return (
      <>
        <div className="empty">Notification not found.</div>
        <div style={{ textAlign: "center" }}>
          <button onClick={onBack} className="btn btn-outline">
            Back to list
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="breadcrumb">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <IconChevronLeft size={16} /> Notifications
        </button>
        <span className="sep">/</span>
        <span>Notification Detail</span>
      </div>

      <div className="page-head">
        <div />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onEdit(n.id)} className="btn btn-primary">
            <IconVersion size={16} /> Create New Version
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card card-pad">
            <div className="detail-badge-row">
              <span className="badge badge-green">{n.status}</span>
              <span className="badge badge-gray">{n.source}</span>
              <TypeBadge type={n.type} />
              <PriorityBadge priority={n.priority} />
            </div>
            <h1 className="detail-title">{n.title}</h1>
            <div className="detail-divider" />
            <div
              className="info-grid"
              style={{
                marginTop: 0,
                marginBottom: 0,
                borderTop: "none",
                borderBottom: "none",
                paddingBottom: 0,
              }}
            >
              <div>
                <div className="k">Audience</div>
                <div className="v">{n.audience.label}</div>
              </div>
              <div>
                <div className="k">Published</div>
                <div className="v">{formatDateTime(n.publishedAt)}</div>
              </div>
              <div>
                <div className="k">Version</div>
                <div className="v">v{n.version}</div>
              </div>
            </div>
          </div>

          <div className="card card-pad" style={{ marginTop: 20 }}>
            <div className="card-title">Message Content</div>
            <div className="message-box message-box-shaded">{n.message}</div>
          </div>

          <div className="card card-pad" style={{ marginTop: 20 }}>
            <div className="card-title">
              <IconVersion size={14} /> Version History
            </div>
            <div className="timeline">
              {n.versions.map((v, i) => (
                <div
                  key={v.version}
                  className={"tl-item" + (i === 0 ? " current" : "")}
                >
                  <div className="tl-head">
                    <strong>v{v.version}</strong>
                    {i === 0 && (
                      <span className="badge badge-green">Current</span>
                    )}
                    <span className="tl-time">
                      {formatDateTime(v.timestamp)}
                    </span>
                  </div>
                  <div className="tl-note">{v.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            {!confirmDel ? (
              <button
                className="btn btn-danger"
                onClick={() => setConfirmDel(true)}
              >
                <IconTrash size={16} /> Delete notification
              </button>
            ) : (
              <div
                className="card card-pad"
                style={{ borderColor: "var(--red-soft)" }}
              >
                <p style={{ margin: "0 0 12px" }}>
                  Delete <strong>{n.title}</strong>? This cannot be undone
                  (until refresh).
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setConfirmDel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      deleteNotification(n.id);
                      onDeleted();
                    }}
                  >
                    Yes, delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title">
            <IconChart size={14} /> Delivery Overview
          </div>
          <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <div className="stat-big">{n.delivery.total}</div>
            <div className="stat-label">Total Recipients</div>
          </div>
          <div className="metric-grid">
            <Metric
              label="Delivered"
              value={n.delivery.delivered}
              total={n.delivery.total}
              icon={<IconSend size={14} className="m-ic-green" />}
            />
            <Metric
              label="Read"
              value={n.delivery.read}
              total={n.delivery.total}
              icon={<IconEye size={14} className="m-ic-green" />}
            />
            <Metric
              label="Acknowledged"
              value={n.delivery.acknowledged}
              total={n.delivery.total}
              icon={<IconChecks size={14} className="m-ic-green" />}
            />
            <Metric
              label="Unread"
              value={n.delivery.unread}
              total={n.delivery.total}
              icon={<IconMail size={14} className="m-ic-gray" />}
            />
          </div>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 12,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Static prototype numbers.
          </p>
        </div>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  total,
  icon,
}: {
  label: string;
  value: number;
  total: number;
  icon?: ReactNode;
}) {
  return (
    <div className="metric">
      <div className="m-top">
        {icon}
        {label}
      </div>
      <div className="m-val">{value}</div>
      <div className="progress">
        <span style={{ width: pct(value, total) + "%" }} />
      </div>
    </div>
  );
}
