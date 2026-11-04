"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ContactRound,
  FileText,
  LayoutDashboard,
  Settings,
  Target,
} from "lucide-react";
import type { ComponentType } from "react";

type NavEntry = { label: string; href: string; icon: ComponentType<{ "aria-hidden"?: boolean }> };

const groups: Array<{ label: string; entries: NavEntry[] }> = [
  { label: "Principal", entries: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    label: "Comercial",
    entries: [
      { label: "Empresas", href: "/empresas", icon: Building2 },
      { label: "Contatos", href: "/contatos", icon: ContactRound },
      { label: "Oportunidades", href: "/oportunidades", icon: Target },
      { label: "Propostas", href: "/propostas", icon: FileText },
      { label: "Projetos", href: "/projetos", icon: BriefcaseBusiness },
    ],
  },
  {
    label: "Gestão",
    entries: [
      { label: "Financeiro", href: "/financeiro", icon: BadgeDollarSign },
      { label: "Relatórios", href: "/relatorios", icon: ChartNoAxesCombined },
      { label: "Configurações", href: "/configuracoes", icon: Settings },
    ],
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand-lockup" href="/dashboard" aria-label="RAIP Hub - Dashboard">
        <div className="brand-wordmark-window" aria-hidden="true">
          <Image src="/brand/raip-wordmark-gradient.png" alt="" width={120} height={120} priority />
        </div>
        <span className="brand-product">Hub</span>
      </Link>
      <nav aria-label="Navegação principal">
        {groups.map((group) => (
          <section className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            <div className="nav-list">
              {group.entries.map((entry) => {
                const Icon = entry.icon;
                const active = pathname === entry.href || pathname.startsWith(`${entry.href}/`);
                return (
                  <Link className={`nav-link${active ? " active" : ""}`} href={entry.href} key={entry.href}>
                    <Icon aria-hidden={true} /><span>{entry.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
      <div className="sidebar-footer"><strong>RAIP Agência</strong><span>Base independente · MVP local</span></div>
    </aside>
  );
}
