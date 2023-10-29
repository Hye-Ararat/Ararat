"use client";

import { DataTableRow } from "@/app/_components/datatable";
import { Button } from "@mantine/core";

export default function Organization({ organization }) {
  return (
    <DataTableRow
      columns={[{ primary: organization.name, secondary: "Organization Name" }]}
      icon={
        <img
          src={`${organization.logoUrl}`}
          style={{ marginTop: "auto", marginBottom: "auto", maxWidth: 60 }}
        />
      }
      button={{ text: "Manage", link: `/organizations/${organization.id}` }}
    />
  );
}
