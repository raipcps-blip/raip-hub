import type { ComponentType, ReactNode } from "react";

type EmptyStateProps = { icon: ComponentType<{ "aria-hidden"?: boolean }>; title: string; description: string; action?: ReactNode };

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state"><div className="empty-state-content">
      <div className="empty-state-icon"><Icon aria-hidden={true} /></div><h2>{title}</h2><p>{description}</p>{action}
    </div></div>
  );
}
