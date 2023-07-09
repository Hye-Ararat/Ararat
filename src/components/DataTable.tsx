import { ScrollArea, Table } from "@mantine/core";
import { Children, MouseEventHandler, ReactNode } from "react";

export function DataTable({ children, headings }: { children: ReactNode, headings?: string[] }) {
    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800, borderSpacing: "0 15px", borderCollapse: "separate" }} verticalSpacing="lg">
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

export function DataTableRow({ children, active,onClick }: { children: ReactNode, active?: boolean, onClick?: MouseEventHandler<HTMLTableDataCellElement> }) {
    if (!active) active = false;
    var firstStyle = { borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", backgroundColor: active ? "#28292e" : "#1a1b1e", marginTop: 30, border: 0 }
    var lastStyle = { borderTopRightRadius: "10px", borderBottomRightRadius: "10px", backgroundColor: active ? "#28292e" : "#1a1b1e", marginTop: 30, border: 0 }
    var normalStyle = { backgroundColor: active ? "#28292e" : "#1a1b1e", marginTop: 30, border: 0 }
    var mappedChildren = Children.map(children, (child, i) => {
        return (
            <td key={i} style={i == 0 ? firstStyle : (i == (children as any).length - 1 ? lastStyle : normalStyle)} onClick={onClick}>
                {child}
            </td>
        )
    })
    return (<tr>{mappedChildren}</tr>)
}

export function DataTableColumn({ children }: { children: ReactNode }) {
    return children
}