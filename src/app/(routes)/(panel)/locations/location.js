import { DataTableRow } from "@/app/_components/datatable";
import { Text } from "@mantine/core";
import { IconLink, IconMapPin, IconServer } from "@tabler/icons-react";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";

export default function Location({ location }) {
    return (
        <DataTableRow
            columns={[{ primary: location.name, secondary: "Location Name" }, {primary: <>{location.countryCode} <ReactCountryFlag countryCode={location.countryCode} svg /></>, "secondary": "Country"}]}
            icon={
                <IconMapPin style={{marginTop: "auto",marginBottom: "auto", marginLeft: 10, marginRight: 10}} size={35}/>
            }
            button={{ text: "Manage", link: `/locations/${location.id}` }}
        />
    )
}