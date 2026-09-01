"use client";

import { useState } from "react";
import { IconChevronLeft, IconTrendingUp } from "@/components/icons";
import { useStore } from "@/lib/store";
import type { Notification, Priority } from "@/lib/types";

export function EditScreen({
  id,
  onCancel,
  onPublished,
}: {
  id: string;
  onCancel: (id: string) => void;
  onPublished: (n: Notification) => void;
}) {
  const { getById, publishNewVersion } = useStore();
  const n = getById(id);

  const [title, setTitle] = useState(n?.title ?? "");
  const [message, setMessage] = useState(n?.message ?? "");
  const [source, setSource] = useState(n?.source ?? "HQ");
  const [priority, setPriority] = useState<Priority>(n?.priority ?? "Normal");
  const [category, setCategory] = useState(n?.category ?? "Maintenance");
  const [note, setNote] = useState("");
  const [resend, setResend] = useState(true);

  if (!n) {
    return (
      <>
        <div className="empty">Notification not found.</div>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => onCancel(id)} className="btn btn-outline">
            Back
          </button>
        </div>
      </>
    );
  }

  const nextVersion = n.version + 1;

  function publish() {
    const updated = publishNewVersion(n!.id, {
      title,
      message,
      source,
      priority,
      category,
      note: note || "Updated by Admin.",
      resendToReaders: resend,
    });
    onPublished(updated ?? n!);
  }

  return (
    <>
      <div className="breadcrumb">
        <button className="btn btn-ghost btn-sm" onClick={() => onCancel(n.id)}>
          <IconChevronLeft size={16} /> Back
        </button>
      </div>
      <h1 className="page-title">Edit Notification</h1>
      <p className="page-sub">Updating published notification: {n.title}</p>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card card-pad">
          <div className="row-2 edit-selects">
            <div className="field">
              <label>Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option>HQ</option>
                <option>System Team</option>
                <option>Curriculum</option>
                <option>Branch</option>
                <option>System</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="field">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Maintenance</option>
                <option>Curriculum</option>
                <option>Operations</option>
                <option>Product</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={resend}
              onChange={(e) => setResend(e.target.checked)}
            />
            <span className="track" />
            <span>
              <strong>Resend to Readers</strong>
              <div className="hint">
                Notify users who have already read version {n.version} about
                this update.
              </div>
            </span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <button className="btn btn-outline" onClick={() => onCancel(n.id)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={publish}>
              Publish Version {nextVersion}
            </button>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title">
            <IconTrendingUp size={14} /> Current Reach
          </div>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div className="stat-big">{n.delivery.total}</div>
            <div className="stat-label">Total Recipients</div>
          </div>
          <div className="stat-row">
            <span>
              <span className="dot dot-green" /> Read
            </span>
            <strong>{n.delivery.read}</strong>
          </div>
          <div className="stat-row">
            <span>
              <span className="dot dot-gray" /> Unread
            </span>
            <strong>{n.delivery.unread}</strong>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 14 }}>
            Version {n.version} metrics will be archived upon publishing v
            {nextVersion}.
          </p>
        </div>
      </div>
    </>
  );
}
