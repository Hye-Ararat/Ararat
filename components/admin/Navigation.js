import {
	Button,
	Typography,
	Grid,
	Toolbar,
	AppBar,
	Drawer,
	Box,
	CssBaseline,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Avatar,
	SvgIcon,
} from "@mui/material";
import {
	Terminal as InstanceIcon,
	SupervisorAccount as AdminIcon,
	AccountCircle as AccountIcon,
	Code as ApiIcon,
	Monitor as OverviewIcon,
	Storage as NodesIcon,
	Badge as RanksIcon,
	ViewStream as DatabaseIcon,
	People as UsersIcon,
	Schedule as SchedulesIcon,
	Lan as NetworkIcon,
	Settings as SettingsIcon,
    Person as ClientIcon,
    ViewInAr as MagmaCubeIcon,
	Sensors as NetworkForwardsIcon
} from "@mui/icons-material";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useEffect } from "react";
export default function AdminNav({ children, ...props }) {
	return (
		<>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar
					position="fixed"
					sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
				>
					<Toolbar>
						<Typography variant="h6" noWrap component="div">
							Ararat
						</Typography>
                        <Typography variant="h6" noWrap component="div" sx={{ml: .8}} fontWeight={400}>
							Administrator
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					sx={{
						width: 240,
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: {
							width: 240,
							boxSizing: "border-box",
						},
					}}
				>
					<Toolbar />
					<Box sx={{ overflow: "auto" }}>
						<List>
							<Link href="/admin">
								<ListItem button selected={props.page==null ? true : false}>
									<ListItemIcon>
										<OverviewIcon />
									</ListItemIcon>
									<ListItemText primary="Overview" />
								</ListItem>
							</Link>
							<ListItem button>
								<ListItemIcon>
									<SettingsIcon />
								</ListItemIcon>
								<ListItemText primary="Settings" />
							</ListItem>
							<ListItem button>
								<ListItemIcon>
									<ApiIcon />
								</ListItemIcon>
								<ListItemText primary="API" />
							</ListItem>
						</List>
						<Divider />
						<List>
							<Link href={`/admin/instances`}>
								<ListItem button selected={props.page == "instances"}>
									<ListItemIcon>
                                        <InstanceIcon />
									</ListItemIcon>
									<ListItemText primary="Instances" />
								</ListItem>
							</Link>
							<Link href={`/admin/nodes`}>
								<ListItem button selected={props.page == "nodes"}>
									<ListItemIcon>
										<NodesIcon />
									</ListItemIcon>
									<ListItemText primary="Nodes" />
								</ListItem>
							</Link>
							<Link href={``}>
								<ListItem button selected={props.page=="databases" ? true : false}>
									<ListItemIcon>
										<DatabaseIcon />
									</ListItemIcon>
									<ListItemText primary="Databases" />
								</ListItem>
							</Link>
							<Link href={``}>
								<ListItem button selected={props.page=="users" ? true : false}>
									<ListItemIcon>
										<UsersIcon />
									</ListItemIcon>
									<ListItemText primary="Users" />
								</ListItem>
							</Link>
                            <Link href={``}>
								<ListItem button selected={props.page=="users" ? true : false}>
									<ListItemIcon>
										<RanksIcon />
									</ListItemIcon>
									<ListItemText primary="Ranks" />
								</ListItem>
							</Link>
							<Link href={`/admin/magma_cubes`}>
                            <ListItem button selected={props.page=="magma_cubes" ? true : false}>
								<ListItemIcon>
									<MagmaCubeIcon />
								</ListItemIcon>
								<ListItemText primary="Magma Cubes" />
							</ListItem>
							</Link>
						</List>
                        <Divider />
                        <Link href={`/`}>
						<List>
							<ListItem button>
								<ListItemIcon>
									<ClientIcon />
								</ListItemIcon>
								<ListItemText primary="Client" />
							</ListItem>
						</List>
                        </Link>
					</Box>
				</Drawer>
				<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
					<Toolbar />
					{children}
				</Box>
			</Box>
		</>
	);
}
