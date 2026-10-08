import React from "react";
import { Film } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionText,
  onAction
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-box">
        {icon || <Film size={44} className="text-slate-500" />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button className="btn-primary empty-state-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
