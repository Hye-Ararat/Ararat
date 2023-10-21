"use client";

import { DataTableRow } from "@/app/_components/datatable";
import { getBrandIcon } from "@/app/_lib/icons";
import { flag } from "country-emoji";

export default function Node({ node }) {
  return (
    <DataTableRow
      columns={[{ primary: node.name, secondary: node.software }]}
      button={{ text: "Manage", link: `/nodes/${node.id}` }}
      icon={getBrandIcon(node.brand, 40, {
        marginTop: "auto",
        marginBottom: "auto",
      })}
    />
  );
}
