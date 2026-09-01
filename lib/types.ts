export type NotifType = "Notification" | "Announcement";
export type Priority = "Normal" | "Urgent";
export type Status = "Active" | "Scheduled" | "Draft";
export type DisplayBehavior = "until_read" | "until_acknowledged";

export interface NotifVersion {
  version: number;
  timestamp: string;
  note: string;
  title: string;
  message: string;
}

export interface Audience {
  country: string;
  branch: string;
  role: string;
  label: string;
  count: number;
}

export interface Schedule {
  mode: "immediate" | "scheduled";
  date?: string;
  time?: string;
  timezone?: string;
  label: string;
}

export interface Delivery {
  total: number;
  delivered: number;
  read: number;
  acknowledged: number;
  unread: number;
}

export interface Notification {
  id: string;
  title: string;
  type: NotifType;
  source: string;
  category: string;
  priority: Priority;
  message: string;
  audience: Audience;
  status: Status;
  schedule: Schedule;
  displayBehavior: DisplayBehavior;
  createdAt: string;
  publishedAt?: string;
  version: number;
  versions: NotifVersion[];
  updated?: boolean;
  whatsChanged?: string;
  delivery: Delivery;
  acknowledgedByUser?: boolean;
  readByUser?: boolean;
  dismissedByUser?: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  country: string;
  branch: string;
  role: string;
}
