import React from "react";

type P = { size?: number; className?: string };
const S = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconDashboard = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
export const IconBook = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
    <path d="M4 19a2 2 0 0 1 2-2h13" />
  </svg>
);
export const IconUsers = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 6a3 3 0 0 1 0 6" />
    <path d="M18 20a6 6 0 0 0-3-5" />
  </svg>
);
export const IconUser = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
);
export const IconBell = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);
export const IconSettings = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
  </svg>
);
export const IconHelp = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7" />
    <path d="M12 17h.01" />
  </svg>
);
export const IconLogout = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);
export const IconPlus = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconSearch = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4-4" />
  </svg>
);
export const IconChevronLeft = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
export const IconChevronRight = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);
export const IconClock = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconChart = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);
export const IconEdit = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);
export const IconTrash = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);
export const IconMegaphone = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" />
    <path d="M15 8a4 4 0 0 1 0 8" />
    <path d="M18 5a8 8 0 0 1 0 14" />
  </svg>
);
export const IconVersion = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 4v4h4" />
  </svg>
);
export const IconCheck = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
export const IconX = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const IconWarn = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M12 3 2 20h20L12 3z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);
export const IconSend = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);
export const IconEye = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconChecks = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);
export const IconMail = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
export const IconTrendingUp = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
export const IconImage = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);
export const IconPaperclip = ({ size, className }: P) => (
  <svg {...S(size)} className={className}>
    <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);
