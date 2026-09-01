"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Notification, NotifVersion } from "./types";
import seed from "@/data/notifications.json";

type NewNotifInput = Omit<
  Notification,
  "id" | "createdAt" | "version" | "versions" | "delivery" | "updated"
> & { saveAsDraft?: boolean };

interface StoreValue {
  notifications: Notification[];
  getById: (id: string) => Notification | undefined;
  addNotification: (input: NewNotifInput) => Notification;
  deleteNotification: (id: string) => void;
  publishNewVersion: (
    id: string,
    changes: {
      title: string;
      message: string;
      source: string;
      priority: Notification["priority"];
      category: string;
      note: string;
      resendToReaders: boolean;
    },
  ) => void;
  markReadByUser: (id: string) => void;
  acknowledgeByUser: (id: string) => void;
  dismissByUser: (id: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    clone(seed as Notification[]),
  );

  const value = useMemo<StoreValue>(() => {
    return {
      notifications,
      getById: (id) => notifications.find((n) => n.id === id),
      addNotification: (input) => {
        const now = new Date().toISOString();
        const isDraft = input.saveAsDraft || input.status === "Draft";
        const status = isDraft
          ? "Draft"
          : input.schedule.mode === "scheduled"
            ? "Scheduled"
            : "Active";
        const total = input.audience.count;
        const created: Notification = {
          ...input,
          id: "n-" + Math.random().toString(36).slice(2, 8),
          createdAt: now,
          publishedAt: isDraft ? undefined : now,
          status,
          version: 1,
          updated: false,
          versions: [
            {
              version: 1,
              timestamp: now,
              note: isDraft ? "Draft created." : "Initial publication.",
              title: input.title,
              message: input.message,
            },
          ],
          delivery: {
            total,
            delivered: isDraft ? 0 : total,
            read: 0,
            acknowledged: 0,
            unread: isDraft ? total : total,
          },
          acknowledgedByUser: false,
          readByUser: false,
          dismissedByUser: false,
        };
        setNotifications((prev) => [created, ...prev]);
        return created;
      },
      deleteNotification: (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      },
      publishNewVersion: (id, changes) => {
        setNotifications((prev) => {
          const updatedList = prev.map((n) => {
            if (n.id !== id) return n;
            const now = new Date().toISOString();
            const nextVersion = n.version + 1;
            const newVersionEntry: NotifVersion = {
              version: nextVersion,
              timestamp: now,
              note: changes.note || "Updated by Admin.",
              title: changes.title,
              message: changes.message,
            };
            return {
              ...n,
              title: changes.title,
              message: changes.message,
              source: changes.source,
              priority: changes.priority,
              category: changes.category,
              version: nextVersion,
              updated: true,
              whatsChanged: changes.note,
              publishedAt: now,
              status: "Active",
              versions: [newVersionEntry, ...n.versions],
              // republish resets user-side ack/read if resending
              acknowledgedByUser: changes.resendToReaders
                ? false
                : n.acknowledgedByUser,
              readByUser: changes.resendToReaders ? false : n.readByUser,
              dismissedByUser: changes.resendToReaders
                ? false
                : n.dismissedByUser,
              delivery: {
                ...n.delivery,
                read: changes.resendToReaders ? 0 : n.delivery.read,
                acknowledged: changes.resendToReaders
                  ? 0
                  : n.delivery.acknowledged,
                unread: changes.resendToReaders
                  ? n.delivery.total
                  : n.delivery.unread,
              },
            };
          });
          // An updated notification becomes the newest, so bubble it to the top.
          const moved = updatedList.find((n) => n.id === id);
          if (!moved) return updatedList;
          return [moved, ...updatedList.filter((n) => n.id !== id)];
        });
      },
      markReadByUser: (id) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id && !n.readByUser
              ? {
                  ...n,
                  readByUser: true,
                  delivery: {
                    ...n.delivery,
                    read: n.delivery.read + 1,
                    unread: Math.max(0, n.delivery.unread - 1),
                  },
                }
              : n,
          ),
        );
      },
      acknowledgeByUser: (id) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id && !n.acknowledgedByUser
              ? {
                  ...n,
                  acknowledgedByUser: true,
                  readByUser: true,
                  dismissedByUser: true,
                  delivery: {
                    ...n.delivery,
                    acknowledged: n.delivery.acknowledged + 1,
                    read: n.readByUser ? n.delivery.read : n.delivery.read + 1,
                    unread: n.readByUser
                      ? n.delivery.unread
                      : Math.max(0, n.delivery.unread - 1),
                  },
                }
              : n,
          ),
        );
      },
      dismissByUser: (id) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, dismissedByUser: true } : n)),
        );
      },
      resetAll: () => setNotifications(clone(seed as Notification[])),
    };
  }, [notifications]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
