import React from "react";
import {
  LockOutlined,
  ErrorOutline,
  HourglassEmptyOutlined,
  CheckCircleOutline,
  WarningAmberOutlined,
  PendingOutlined,
  LoopOutlined,
  ChatOutlined,
  PauseCircleOutlineOutlined,
  CancelOutlined,
} from "@mui/icons-material";

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  moreclasses?: string;
}

const statusLabels: Record<string, string> = {
  active: "Active",
  completed: "Completed",
  inactive: "Inactive",
  pending: "Pending",
  failed: "Failed",
  "not working": "Not Working",
  open: "Open",
  in_process: "In Process",
  answered: "Answered",
  hold: "Hold",
  closed: "Closed",
  expired: "Expired",
  error: "Error",
  "expiring soon": "Expiring Soon",
};

// Define icons per status
const statusIcons: Record<string, React.ReactNode> = {
  active: <LockOutlined fontSize="small" />,
  completed: <CheckCircleOutline fontSize="small" />,
  inactive: <PauseCircleOutlineOutlined fontSize="small" />,
  pending: <HourglassEmptyOutlined fontSize="small" />,
  failed: <ErrorOutline fontSize="small" />,
  "not working": <ErrorOutline fontSize="small" />,
  open: <LoopOutlined fontSize="small" />,
  in_process: <PendingOutlined fontSize="small" />,
  answered: <ChatOutlined fontSize="small" />,
  hold: <PauseCircleOutlineOutlined fontSize="small" />,
  closed: <CancelOutlined fontSize="small" />,
  expired: <LockOutlined fontSize="small" />,
  error: <ErrorOutline fontSize="small" />,
  "expiring soon": <WarningAmberOutlined fontSize="small" />,
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = false,moreclasses="" }) => {
  const normalized = status.toLowerCase();

  const getClasses = () => {
    switch (normalized) {
      case "active":
      case "completed":
      case "answered":
        return "bg-primary text-white";

      case "inactive":
      case "pending":
      case "open":
      case "in_process":
      case "hold":
      case "expiring soon":
        return "border border-warning text-warning";

      case "failed":
      case "not working":
      case "closed":
      case "expired":
      case "error":
        return "border border-error text-error";

      default:
        return "border border-foreground text-foreground";
    }
  };

  const Icon = statusIcons[normalized];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getClasses()} ${moreclasses}`}
    >
      {showIcon && Icon && <span className="flex items-center">{Icon}</span>}
      {statusLabels[normalized] || status}
    </span>
  );
};

export default StatusBadge;
