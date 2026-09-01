"use client";

import { useMemo, useState } from "react";
import {
  IconCheck,
  IconBell,
  IconMegaphone,
  IconX,
  IconVersion,
  IconUsers,
  IconChevronLeft,
  IconImage,
  IconPaperclip,
} from "@/components/icons";
import { useStore } from "@/lib/store";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AckModal } from "@/components/AckModal";
import recipientsData from "@/data/recipients.json";
import type {
  NotifType,
  Priority,
  DisplayBehavior,
  Recipient,
  Notification,
} from "@/lib/types";

const STEPS = ["Content", "Audience", "Schedule & Behavior", "Review"];
const recipients = recipientsData as Recipient[];

export function CreateScreen({
  onDone,
  onCancel,
  onCreated,
}: {
  onDone: () => void;
  onCancel: () => void;
  onCreated?: (n: Notification) => void;
}) {
  const { addNotification, notifications } = useStore();
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [showDraftConfirm, setShowDraftConfirm] = useState(false);
  const [detailView, setDetailView] = useState(false);

  const [type, setType] = useState<NotifType>("Notification");
  const [source, setSource] = useState("HQ");
  const [category, setCategory] = useState("Maintenance");
  const [priority, setPriority] = useState<Priority>("Normal");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [country, setCountry] = useState("All Countries");
  const [branch, setBranch] = useState("All Branches");
  const [role, setRole] = useState("All Roles");
  const [showRecipients, setShowRecipients] = useState(false);

  const [sendMode, setSendMode] = useState<"immediate" | "scheduled">(
    "immediate",
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState("WITA (GMT+8)");
  const [displayBehavior, setDisplayBehavior] =
    useState<DisplayBehavior>("until_read");

  const matched = useMemo(() => {
    return recipients.filter((r) => {
      if (country !== "All Countries" && r.country !== country) return false;
      if (branch !== "All Branches" && r.branch !== branch) return false;
      if (role !== "All Roles" && r.role !== role) return false;
      return true;
    });
  }, [country, branch, role]);

  const audienceLabel = useMemo(() => {
    const parts: string[] = [];
    parts.push(country === "All Countries" ? "All Countries" : country);
    if (branch !== "All Branches") parts.push(branch);
    if (role !== "All Roles") parts.push(role);
    return parts.join(" > ");
  }, [country, branch, role]);

  const canNext = step === 0 ? Boolean(title.trim() && message.trim()) : true;

  // Announcements are always high-visibility, so priority is forced to Urgent.
  const effectivePriority: Priority =
    type === "Announcement" ? "Urgent" : priority;

  const draftNotif: Notification = {
    id: "preview",
    title: title.trim() || "Untitled notification",
    type,
    source,
    category,
    priority: effectivePriority,
    message: message.trim(),
    audience: {
      country,
      branch,
      role,
      label: audienceLabel,
      count: matched.length,
    },
    status: "Active",
    schedule: {
      mode: sendMode,
      date: date || undefined,
      time: time || undefined,
      timezone,
      label: sendMode === "immediate" ? "Just now" : date || "Scheduled",
    },
    displayBehavior,
    createdAt: new Date().toISOString(),
    version: 1,
    versions: [],
    updated: false,
    delivery: {
      total: matched.length,
      delivered: matched.length,
      read: 0,
      acknowledged: 0,
      unread: matched.length,
    },
    readByUser: false,
    acknowledgedByUser: false,
    dismissedByUser: false,
  };

  const previewItems: Notification[] = [
    draftNotif,
    ...notifications.filter((n) => n.status !== "Draft"),
  ];

  function save(asDraft: boolean) {
    const created = addNotification({
      title: title.trim() || "Untitled notification",
      type,
      source,
      category,
      priority: effectivePriority,
      message: message.trim(),
      audience: {
        country,
        branch,
        role,
        label: audienceLabel,
        count: matched.length,
      },
      status: asDraft
        ? "Draft"
        : sendMode === "scheduled"
          ? "Scheduled"
          : "Active",
      schedule: {
        mode: sendMode,
        date: date || undefined,
        time: time || undefined,
        timezone,
        label:
          sendMode === "immediate"
            ? "Just now"
            : date
              ? new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Scheduled",
      },
      displayBehavior,
      publishedAt: undefined,
      whatsChanged: undefined,
      acknowledgedByUser: false,
      readByUser: false,
      dismissedByUser: false,
      saveAsDraft: asDraft,
    });
    if (!asDraft && type === "Announcement") onCreated?.(created);
    onDone();
  }

  const branches = Array.from(new Set(recipients.map((r) => r.branch)));
  const countries = Array.from(new Set(recipients.map((r) => r.country)));

  if (detailView) {
    return (
      <div className="cm-page">
        <div className="cm-card">
          <div className="cm-head">
            <button
              className="modal-close"
              onClick={() => setDetailView(false)}
            >
              <IconX size={18} />
            </button>
          </div>
          <div className="cm-body">
            <h3 className="aud-title">Estimated Recipients</h3>
            <div className="aud-divider" />
            <div className="est-box" style={{ marginBottom: 16 }}>
              <div className="est-left">
                <span className="est-ic">
                  <IconUsers size={20} />
                </span>
                <div>
                  <div className="est-label">Total recipients</div>
                  <div className="est-count">{matched.length} users</div>
                </div>
              </div>
              <div className="rev-sub">{audienceLabel}</div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Country</th>
                    <th>Branch</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {matched.map((r) => (
                    <tr key={r.id} style={{ cursor: "default" }}>
                      <td className="cell-title">{r.name}</td>
                      <td>{r.country}</td>
                      <td>{r.branch}</td>
                      <td>
                        <span className="badge badge-gray">{r.role}</span>
                      </td>
                    </tr>
                  ))}
                  {matched.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty">
                          No users match this audience.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="cm-foot">
            <button
              className="btn btn-outline"
              onClick={() => setDetailView(false)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cm-page">
        <div className="cm-card">
          <div className="cm-head">
            <h3>Create New Notification</h3>
            <button className="modal-close" onClick={onCancel}>
              <IconX size={18} />
            </button>
          </div>

          <div className="cm-steps">
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "contents" }}>
                <div
                  className={
                    "cm-step" +
                    (i === step ? " active" : i < step ? " done" : "")
                  }
                >
                  <div className="cm-step-dot">
                    {i < step ? <IconCheck size={15} /> : i + 1}
                  </div>
                  <div className="cm-step-label">{s}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={"cm-step-line" + (i < step ? " done" : "")} />
                )}
              </div>
            ))}
          </div>

          <div className="cm-body">
            {step === 0 && (
              <>
                <div className="field">
                  <label>Notification Type</label>
                  <div className="choice-grid">
                    <div
                      className={
                        "choice choice-ico" +
                        (type === "Notification" ? " selected" : "")
                      }
                      onClick={() => setType("Notification")}
                    >
                      <div className="choice-ic">
                        <IconBell size={18} />
                      </div>
                      <div>
                        <h4>Notification</h4>
                        <p>
                          Standard alert or update sent to users&apos;
                          notification center.
                        </p>
                      </div>
                    </div>
                    <div
                      className={
                        "choice choice-ico" +
                        (type === "Announcement" ? " selected" : "")
                      }
                      onClick={() => setType("Announcement")}
                    >
                      <div className="choice-ic">
                        <IconMegaphone size={18} />
                      </div>
                      <div>
                        <h4>Announcement</h4>
                        <p>
                          High-visibility message that can require user
                          interaction.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row-2 cols-2">
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

                {type === "Notification" && (
                  <div className="field">
                    <label>Priority</label>
                    <div className="seg">
                      <button
                        className={priority === "Normal" ? "active" : ""}
                        onClick={() => setPriority("Normal")}
                      >
                        Normal
                      </button>
                      <button
                        className={priority === "Urgent" ? "active" : ""}
                        onClick={() => setPriority("Urgent")}
                      >
                        Urgent
                      </button>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Enter notification title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Message Content</label>
                  <div className="editor">
                    <div className="editor-toolbar">
                      <button title="Bold" style={{ fontWeight: 800 }}>
                        B
                      </button>
                      <button title="Italic" style={{ fontStyle: "italic" }}>
                        I
                      </button>
                      <button
                        title="Underline"
                        style={{ textDecoration: "underline" }}
                      >
                        U
                      </button>
                      <span className="editor-sep" />
                      <button title="Bulleted list">&#8226;&#8801;</button>
                      <button title="Numbered list">1.&#8801;</button>
                      <button title="Link">&#128279;</button>
                    </div>
                    <textarea
                      placeholder="Enter the content of your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="media">
                  <div className="media-head">
                    <label>Media &amp; Attachments</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-outline btn-sm">
                        <IconImage size={15} /> Add Image
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <IconPaperclip size={15} /> Add File
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h3 className="aud-title">Audience Targeting</h3>
                <div className="aud-divider" />
                <div className="aud-box">
                  <div className="aud-box-title">Specific Audience</div>
                  <div className="aud-box-hint">
                    Target specific segments using the filters below.
                  </div>
                  <div className="row-2">
                    <div className="field">
                      <label>Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option>All Countries</option>
                        {countries.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Branch</label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      >
                        <option>All Branches</option>
                        {branches.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>Teacher</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="est-box">
                  <div className="est-left">
                    <span className="est-ic">
                      <IconUsers size={20} />
                    </span>
                    <div>
                      <div className="est-label">Estimated recipients</div>
                      <div className="est-count">{matched.length} users</div>
                    </div>
                  </div>
                  <button
                    className="est-link"
                    onClick={() => setShowRecipients((v) => !v)}
                  >
                    {showRecipients ? "Hide recipients" : "View recipients →"}
                  </button>
                </div>
                {showRecipients && (
                  <div className="table-wrap" style={{ marginTop: 16 }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>User Name</th>
                          <th>Country</th>
                          <th>Branch</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matched.map((r) => (
                          <tr key={r.id} style={{ cursor: "default" }}>
                            <td className="cell-title">{r.name}</td>
                            <td>{r.country}</td>
                            <td>{r.branch}</td>
                            <td>
                              <span className="badge badge-gray">{r.role}</span>
                            </td>
                          </tr>
                        ))}
                        {matched.length === 0 && (
                          <tr>
                            <td colSpan={4}>
                              <div className="empty">
                                No users match this audience.
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="aud-title">Delivery</h3>
                <div className="aud-divider" />
                <div className="radio-list">
                  <div
                    className={
                      "radio-row" +
                      (sendMode === "immediate" ? " selected" : "")
                    }
                    onClick={() => setSendMode("immediate")}
                  >
                    <span className="radio-dot" />
                    <div className="radio-text">
                      <div className="radio-title">Send Immediately</div>
                      <div className="radio-desc">
                        Notification will be dispatched as soon as you hit
                        publish.
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "radio-row" +
                      (sendMode === "scheduled" ? " selected" : "")
                    }
                    onClick={() => setSendMode("scheduled")}
                  >
                    <span className="radio-dot" />
                    <div className="radio-text">
                      <div className="radio-title">Schedule for later</div>
                      <div className="radio-desc">
                        Set a specific date and time for delivery.
                      </div>
                      {sendMode === "scheduled" && (
                        <div
                          className="sched-fields row-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="field">
                            <label>Date</label>
                            <input
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>Time</label>
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>Timezone</label>
                            <select
                              value={timezone}
                              onChange={(e) => setTimezone(e.target.value)}
                            >
                              <option>WITA (GMT+8)</option>
                              <option>WIB (GMT+7)</option>
                              <option>WIT (GMT+9)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="aud-title" style={{ marginTop: 24 }}>
                  Display Behavior
                </h3>
                <div className="aud-divider" />
                <div className="radio-list radio-2col">
                  <div
                    className={
                      "radio-row" +
                      (displayBehavior === "until_read" ? " selected" : "")
                    }
                    onClick={() => setDisplayBehavior("until_read")}
                  >
                    <span className="radio-dot" />
                    <div className="radio-text">
                      <div className="radio-title">Until read</div>
                      <div className="radio-desc">
                        {type === "Announcement"
                          ? "Pop-up stays until the user reads it."
                          : "Highlighted in the notification center until the user opens it."}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "radio-row" +
                      (displayBehavior === "until_acknowledged"
                        ? " selected"
                        : "")
                    }
                    onClick={() => setDisplayBehavior("until_acknowledged")}
                  >
                    <span className="radio-dot" />
                    <div className="radio-text">
                      <div className="radio-title">Until acknowledged</div>
                      <div className="radio-desc">
                        {type === "Announcement"
                          ? "Requires active dismissal (best for announcements)."
                          : "User must open the notification and tap Acknowledge to clear it."}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="rev-card">
                  <div className="rev-col rev-col-border">
                    <div className="rev-h">Notification Details</div>
                    <div className="rev-divider" />
                    <div className="rev-field">
                      <div className="rev-k">Title</div>
                      <div className="rev-v">{title || "-"}</div>
                    </div>
                    <div className="rev-field">
                      <div className="rev-k">Message Preview</div>
                      <div className="rev-msgbox">
                        {message || "(no message)"}
                      </div>
                    </div>
                    <div className="rev-2col">
                      <div>
                        <div className="rev-k">Type</div>
                        <div className="rev-v">{type}</div>
                      </div>
                      <div>
                        <div className="rev-k">Priority</div>
                        <div>
                          <span
                            className={
                              "rev-prio " +
                              (effectivePriority === "Urgent"
                                ? "urgent"
                                : "normal")
                            }
                          >
                            {effectivePriority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="rev-field">
                      <div className="rev-k">Source</div>
                      <div className="rev-v">{source}</div>
                    </div>
                  </div>
                  <div className="rev-col">
                    <div className="rev-h">Audience &amp; Schedule</div>
                    <div className="rev-divider" />
                    <div className="rev-field">
                      <div className="rev-k">Target Audience</div>
                      <div className="rev-v">Specific Audience</div>
                      <div className="rev-sub">{audienceLabel}</div>
                    </div>
                    <div className="rev-field">
                      <div className="rev-k">Estimated Recipients</div>
                      <div className="est-inline">
                        <span className="est-ic">
                          <IconUsers size={18} />
                        </span>
                        <span className="est-count">
                          {matched.length} users
                        </span>
                        <button
                          className="est-link"
                          onClick={() => setDetailView(true)}
                          style={{ marginLeft: "auto" }}
                        >
                          See Detail
                        </button>
                      </div>
                    </div>
                    <div className="rev-field">
                      <div className="rev-k">Schedule</div>
                      <div className="rev-v">
                        {sendMode === "immediate"
                          ? "Send immediately"
                          : `${date || "-"}${time ? ", " + time : ""} ${timezone}`}
                      </div>
                    </div>
                    <div className="rev-action">
                      <div className="rev-k">User Action Required</div>
                      <div className="rev-check">
                        <IconCheck size={16} />
                        {displayBehavior === "until_acknowledged"
                          ? "Require acknowledgement upon reading"
                          : "Stays visible until read (no acknowledgement required)"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="cm-foot">
            {step < STEPS.length - 1 ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-outline"
                  onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}
                >
                  {step === 0 ? "Cancel" : "Back"}
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!canNext}
                  onClick={() => setStep(step + 1)}
                >
                  Next Step
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setStep(step - 1)}
                >
                  <IconChevronLeft size={16} /> Back
                </button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setPreview(true)}
                  >
                    Preview as User
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowDraftConfirm(true)}
                  >
                    Save Draft
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => save(false)}
                  >
                    {sendMode === "scheduled"
                      ? "Schedule Notification"
                      : "Publish Notification"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {preview && type === "Notification" && (
        <div className="preview-overlay">
          <div className="preview-bar">
            <span className="preview-bar-title">
              Notification Center Preview
            </span>
            <button
              className="preview-close-btn"
              onClick={() => setPreview(false)}
            >
              <IconX size={18} /> Close Preview
            </button>
          </div>
          <div className="preview-stage">
            <div className="preview-nc">
              <NotificationCenter items={previewItems} onOpen={() => {}} />
            </div>
          </div>
        </div>
      )}

      {preview && type === "Announcement" && (
        <div className="preview-overlay">
          <div className="preview-bar">
            <span className="preview-bar-title">Announcement Preview</span>
            <button
              className="preview-close-btn"
              onClick={() => setPreview(false)}
            >
              <IconX size={18} /> Close Preview
            </button>
          </div>
          <AckModal
            notif={draftNotif}
            onAcknowledge={() => setPreview(false)}
            onClose={() => setPreview(false)}
          />
        </div>
      )}

      {showDraftConfirm && (
        <div className="overlay" onClick={() => setShowDraftConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Save as draft?</h4>
            <p>
              Apakah kamu yakin ingin menyimpan notifikasi ini sebagai draft?
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowDraftConfirm(false)}
              >
                Tidak
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowDraftConfirm(false);
                  save(true);
                }}
              >
                Ya, simpan draft
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
