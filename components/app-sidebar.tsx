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
import { Title } from "@radix-ui/react-dialog";
import { url } from "node:inspector/promises";

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
    {
      title: "Bonne pratiques",
      url: "/Bonne-pratiques",
      icon: Map,
      items: [
        {
          title: "Utilisation d'ORM",
          url: "/Bonne-pratiques/ORM",
        },
        {
          title: "Validation des données",
          url: "/Bonne-pratiques/Validation-des-donnees",
        },
        {
          title: "Moindre privilèges",
          url: "/Bonne-pratiques/Moindre-privilèges",
        },
        {
          title: "Requêtes préparées",
          url: "/Bonne-pratiques/Requetes-preparees",
        },
        {
          title: "Échappement des entrées",
          url: "/Bonne-pratiques/Echappement-entrees",
        },
        {
          title: "Liste blanche d'entrées",
          url: "/Bonne-pratiques/Liste-blanche",
        },
        {
          title: "Chiffrement des données",
          url: "/Bonne-pratiques/Chiffrement-donnees",
        },
        {
          title: "Journalisation et monitoring",
          url: "/Bonne-pratiques/Journalisation",
        },
        {
          title: "Gestion des erreurs",
          url: "/Bonne-pratiques/Gestion-erreurs",
        },
        {
          title: "WAF et pare-feu",
          url: "/Bonne-pratiques/WAF-parefeu",
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
