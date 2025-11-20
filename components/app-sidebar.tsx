"use client";

import { Frame, GalleryVerticalEnd, Map, PieChart } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "Injecition SQL",
      logo: GalleryVerticalEnd,
      plan: "SQLi",
    },
  ],
  navMain: [
    {
      title: "SQLi en bande",
      url: "/Bande",
      icon: Frame,
      isActive: true,
      items: [
        {
          title: "SQLi basé sur les erreurs",
          url: "/Bande/SQLi-base-sur-les-erreurs",
        },
        {
          title: "SQLi basé sur l'union",
          url: "/Bande/SQLi-base-sur-union",
        },
        {
          title: "OU 1=1 attaque",
          url: "/Bande/SQLi-base-sur-or1=1",
        },
        {
          title: "Injection de commentaires",
          url: "/Bande/SQLi-base-sur-commentaire",
        },
      ],
    },
    {
      title: "SQLi inférentiel (Blind SQLi)",
      url: "/Blind",
      icon: PieChart,
      items: [
        {
          title: "SQLi basé sur les booléens",
          url: "/Blind/SQLi-base-sur-booleen",
        },
        {
          title: "SQLi basé sur le temps",
          url: "/Blind/SQLi-base-sur-temps",
        },
      ],
    },
    {
      title: "SQLi hors bande",
      url: "/HBand",
      icon: Map,
      items: [
        {
          title: "Injection SQL stockée",
          url: "/HBand/SQLi-stocke",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
