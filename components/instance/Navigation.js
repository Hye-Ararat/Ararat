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
	Inbox as InboxIcon,
	Mail as MailIcon,
	Storage as InstanceIcon,
	SupervisorAccount as AdminIcon,
	AccountCircle as AccountIcon,
	Code as ApiIcon,
	Monitor as ConsoleIcon,
	Folder as FilesIcon,
	Backup as BackupIcon,
	ViewStream as DatabaseIcon,
	People as UsersIcon,
	Schedule as SchedulesIcon,
	SettingsEthernet as NetworkIcon,
	Settings as SettingsIcon,
} from "@mui/icons-material";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useEffect } from "react";
const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Navigation({ children, ...props }) {
	console.log(props.page)
	function Addons() {
		const { data } = useSWR(
			`/api/v1/client/instances/${props.instance}/addons/pages`,
			fetcher
		);
		if (!data) {
			return [];
		} else {
      if (data.status == "error" || data.data == "Instance does not exist") {
        return []
      }
			return data.data;
		}
	}
	useEffect(() => {
		console.log("Nav redone")
	}, [])
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
							<Link href="/">
								<ListItem button>
									<ListItemIcon>
										<InstanceIcon />
									</ListItemIcon>
									<ListItemText primary="Instances" />
								</ListItem>
							</Link>
							<ListItem button>
								<ListItemIcon>
									<AccountIcon />
								</ListItemIcon>
								<ListItemText primary="Account" />
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
							<Link href={`/instance/${encodeURIComponent(props.instance)}`}>
								<ListItem button selected={props.page==null ? true : false}>
									<ListItemIcon>
										<ConsoleIcon />
									</ListItemIcon>
									<ListItemText primary="Console" />
								</ListItem>
							</Link>
							<Link href={`/instance/${encodeURIComponent(props.instance)}/files`}>
								<ListItem button selected={props.page != null ? props.page.includes("files") ? true : false : false}>
									<ListItemIcon>
										<FilesIcon />
									</ListItemIcon>
									<ListItemText primary="Files" />
								</ListItem>
							</Link>
							<Link href={`/instance/${encodeURIComponent(props.instance)}`}>
								<ListItem button selected={props.page=="backups" ? true : false}>
									<ListItemIcon>
										<BackupIcon />
									</ListItemIcon>
									<ListItemText primary="Backups" />
								</ListItem>
							</Link>
							<Link href={`/instance/${encodeURIComponent(props.instance)}`}>
								<ListItem button selected={props.page=="databases" ? true : false}>
									<ListItemIcon>
										<DatabaseIcon />
									</ListItemIcon>
									<ListItemText primary="Databases" />
								</ListItem>
							</Link>
							<Link href={`/instance/${encodeURIComponent(props.instance)}`}>
								<ListItem button selected={props.page=="users" ? true : false}>
									<ListItemIcon>
										<UsersIcon />
									</ListItemIcon>
									<ListItemText primary="Users" />
								</ListItem>
							</Link>
							<Link href={`/instance/${encodeURIComponent(props.instance)}`}>
								<ListItem button selected={props.page=="schedules" ? true : false}>
									<ListItemIcon>
										<SchedulesIcon />
									</ListItemIcon>
									<ListItemText primary="Schedules" />
								</ListItem>
							</Link>
							<Link href={`/instance/${encodeURIComponent(props.instance)}`}>
								<ListItem button selected={props.page=="networking" ? true : false}>
									<ListItemIcon>
										<NetworkIcon />
									</ListItemIcon>
									<ListItemText primary="Networking" />
								</ListItem>
							</Link>
							<Link href={`/instance/${encodeURIComponent(props.instance)}`}>
								<ListItem button selected={props.page=="settings" ? true : false}>
									<ListItemIcon>
										<SettingsIcon />
									</ListItemIcon>
									<ListItemText primary="Settings" />
								</ListItem>
							</Link>
							{Addons()
								? Addons() != "Loading"
									? Addons().map((addon) => {
											library.add();
											return (
												<Link
													href={`/instances/${encodeURIComponent(props.instance)}${
														addon.route
													}`}
													key={addon._id}
												>
													<ListItem button>
														<ListItemIcon>
															<SvgIcon sx={{ width: 24, height: 24, ml: 0.2 }}>
																<FontAwesomeIcon icon={Icons[addon.icon]} />
															</SvgIcon>
														</ListItemIcon>
														<ListItemText primary={addon.name} />
													</ListItem>
												</Link>
											);
									  })
									: ""
								: ""}
						</List>
						<Divider />
						<List>
							<ListItem button>
								<ListItemIcon>
									<AdminIcon />
								</ListItemIcon>
								<ListItemText primary="Admin" />
							</ListItem>
						</List>
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
