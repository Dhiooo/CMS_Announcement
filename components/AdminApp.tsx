"use client";

import { useMemo, useState } from "react";
import { Shell } from "./Shell";
import { ListScreen } from "./screens/ListScreen";
import { CreateScreen } from "./screens/CreateScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { EditScreen } from "./screens/EditScreen";
import { NotificationCenter } from "./NotificationCenter";
import { AckModal } from "./AckModal";
import { NotifModal } from "./NotifModal";
import { useStore } from "@/lib/store";
import type { Notification } from "@/lib/types";

type View =
  | { name: "list" }
  | { name: "new" }
  | { name: "detail"; id: string }
  | { name: "edit"; id: string };

export function AdminApp() {
  // View state lives in memory -> refreshing the page always returns to the list.
  const [view, setView] = useState<View>({ name: "list" });
  const [bellOpen, setBellOpen] = useState(false);
  const [ack, setAck] = useState<Notification | null>(null);
  const [notifDetail, setNotifDetail] = useState<Notification | null>(null);

  const { notifications, markReadByUser, acknowledgeByUser } = useStore();
  const visible = useMemo(
    () => notifications.filter((n) => n.status !== "Draft"),
    [notifications],
  );
  const unread = visible.filter((n) => !n.readByUser).length;

  function openFromCenter(n: Notification) {
    markReadByUser(n.id);
    if (n.type === "Announcement") setAck(n);
    else setNotifDetail(n);
  }

  function markAllRead(items: Notification[]) {
    items.forEach((n) => markReadByUser(n.id));
  }

  return (
    <Shell
      onGoNotifications={() => setView({ name: "list" })}
      onBellClick={() => setBellOpen((v) => !v)}
      unreadCount={unread}
    >
      {view.name === "list" && (
        <ListScreen
          onCreate={() => setView({ name: "new" })}
          onOpen={(id) => setView({ name: "detail", id })}
        />
      )}
      {view.name === "new" && (
        <CreateScreen
          onDone={() => setView({ name: "list" })}
          onCancel={() => setView({ name: "list" })}
          onCreated={(n) => {
            // Announcements pop up on the user's screen shortly after creation.
            if (n.type === "Announcement" && n.status !== "Draft") {
              setTimeout(() => setAck(n), 2000);
            }
          }}
        />
      )}
      {view.name === "detail" && (
        <DetailScreen
          id={view.id}
          onBack={() => setView({ name: "list" })}
          onEdit={(id) => setView({ name: "edit", id })}
          onDeleted={() => setView({ name: "list" })}
        />
      )}
      {view.name === "edit" && (
        <EditScreen
          id={view.id}
          onCancel={(id) => setView({ name: "detail", id })}
          onPublished={(n) => {
            setView({ name: "detail", id: n.id });
            // Updated announcements pop up on the user's screen again,
            // just like a first-time publish.
            if (n.type === "Announcement" && n.status !== "Draft") {
              setTimeout(() => setAck(n), 2000);
            }
          }}
        />
      )}

      {bellOpen && (
        <div style={{ position: "fixed", top: 66, right: 24, zIndex: 60 }}>
          <NotificationCenter
            items={visible}
            onOpen={openFromCenter}
            onMarkAllRead={markAllRead}
          />
        </div>
      )}

      {ack && (
        <AckModal
          notif={ack}
          onAcknowledge={() => {
            acknowledgeByUser(ack.id);
            setAck(null);
          }}
          onClose={() => setAck(null)}
        />
      )}

      {notifDetail && (
        <NotifModal
          notif={notifDetail}
          onAcknowledge={() => {
            acknowledgeByUser(notifDetail.id);
            setNotifDetail(null);
          }}
          onClose={() => setNotifDetail(null)}
        />
      )}
    </Shell>
  );
}
