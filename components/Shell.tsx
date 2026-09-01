"use client";

import {
  IconDashboard,
  IconBook,
  IconUsers,
  IconUser,
  IconBell,
  IconSettings,
  IconHelp,
  IconLogout,
  IconPlus,
} from "./icons";

const nav = [
  { key: "dashboard", label: "Dashboard", icon: IconDashboard },
  { key: "curriculum", label: "Curriculum", icon: IconBook },
  { key: "students", label: "Students", icon: IconUsers },
  { key: "instructors", label: "Instructors", icon: IconUser },
  { key: "notifications", label: "Notifications", icon: IconBell },
  { key: "settings", label: "Settings", icon: IconSettings },
];

export function Shell({
  children,
  onGoNotifications,
  onBellClick,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  onGoNotifications: () => void;
  onBellClick: () => void;
  unreadCount?: number;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">TA</div>
          <div>
            <div className="brand-name">
              Timedoor
              <br />
              Academy
            </div>
            <div className="brand-sub">Admin Portal</div>
          </div>
        </div>
        <div className="side-cta">
          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <IconPlus size={16} /> New Course
          </button>
        </div>
        <nav className="nav">
          {nav.map((n) => {
            const Icon = n.icon;
            const isNotif = n.key === "notifications";
            return (
              <div
                key={n.key}
                className={"nav-item" + (isNotif ? " active" : " disabled")}
                onClick={isNotif ? onGoNotifications : undefined}
                role={isNotif ? "button" : undefined}
              >
                <Icon size={18} /> {n.label}
              </div>
            );
          })}
        </nav>
        <div className="nav-spacer" />
        <div className="nav-foot">
          <div className="nav-item disabled">
            <IconHelp size={18} /> Help Center
          </div>
          <div className="nav-item disabled">
            <IconLogout size={18} /> Logout
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <span className="logo">Timedoor CMS</span>
          <nav className="topnav" style={{ marginLeft: 24 }}>
            <span className="active">Overview</span>
            <span>Analytics</span>
            <span>Reports</span>
          </nav>
          <div className="search" style={{ marginLeft: 24 }}>
            <input placeholder="Search..." />
          </div>
          <div className="top-icons">
            <button
              className="bell-plain"
              onClick={onBellClick}
              title="Notifications"
            >
              <IconBell size={20} />
              {unreadCount > 0 && <span className="bell-dot" />}
            </button>
            <IconSettings size={18} />
            <IconHelp size={18} />
            <div className="avatar">DC</div>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
