import type { ReactNode } from "react";
import { SideNav } from "@/components/shell/side-nav";

export default function ErpLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="erp-shell">
      <SideNav />
      <div className="erp-main">
        <header className="topbar">
          <div className="workspace-label">Workspace <span>/ Operação RAIP</span></div>
          <div className="user-chip"><span>Ambiente local</span><div className="user-avatar" aria-hidden="true">R</div></div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
