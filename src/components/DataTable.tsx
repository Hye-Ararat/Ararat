import { useMantineTheme, Group, Avatar, Badge, Anchor, ActionIcon, ScrollArea, Table, Text } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Children, ReactNode } from "react";

export function DataTable({ children, headings }: { children: ReactNode, headings?: string[] }) {
    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800, borderSpacing: "0 10px", borderCollapse: "separate" }} verticalSpacing="md">
                {headings ? <thead>
                    <tr key={"head"}>
                        {headings.map(heading => <th style={{ border: 0 }}>{heading}</th>)}
                    </tr>
                </thead> : ""}
                <tbody>{children}</tbody>
            </Table>
        </ScrollArea>
    );
}

export function DataTableRow({ children }: { children: ReactNode }) {
    var firstStyle = { borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", backgroundColor: "#1a1b1e", marginTop: 30, border: 0 }
    var lastStyle = { borderTopRightRadius: "10px", borderBottomRightRadius: "10px", backgroundColor: "#1a1b1e", marginTop: 30, border: 0 }
    var normalStyle = { backgroundColor: "#1a1b1e", marginTop: 30, border: 0 }
    var mappedChildren = Children.map(children, (child, i) => {
        return (
            <td key={i} style={i == 0 ? firstStyle : (i == (children as any).length - 1 ? lastStyle : normalStyle )}>
                {child}
            </td>
        )
    })
    return (<tr>{mappedChildren}</tr>)
}

export function DataTableColumn({ children }: { children: ReactNode }) {
    return children
}