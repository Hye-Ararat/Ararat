import { DataTableRow } from "@/app/_components/datatable";
import { Text } from "@mantine/core";
import { IconLink, IconServer } from "@tabler/icons-react";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";

export default function Rack({ rack }) {
    console.log(rack)
    return (
        <DataTableRow
            columns={[{ primary: rack.name, secondary: "Rack Name" }, { primary: rack.location.name, secondary: "Location" }, {primary: <>{rack.location.countryCode} <ReactCountryFlag countryCode={rack.location.countryCode} svg /></>, "secondary": "Country"}]}
            icon={
                <IconServer style={{marginTop: "auto",marginBottom: "auto", marginLeft: 10, marginRight: 10}} size={35}/>
            }
            button={{ text: "Manage", link: `/racks/${rack.id}` }}
        />
    )
}