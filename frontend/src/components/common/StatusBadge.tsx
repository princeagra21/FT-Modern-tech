import React from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getClasses = () => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
        return "bg-primary text-white";
      case "inactive":
      case "pending":
        return "border border-primary text-primary";
      case "failed":
      case "not working":
        return "border border-error text-error";
      default:
        return "border border-foreground text-foreground";
    }
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${getClasses()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
