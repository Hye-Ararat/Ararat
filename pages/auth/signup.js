import {
	Container,
	FormControl,
	Grid,
	TextField,
	Typography,
	Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Check } from "@mui/icons-material"
import logo from "../../public/logo.png";
import Image from "next/image";
import { Box } from "@mui/system";
import Link from "next/link";
import Head from "next/head";
import signup from "../../scripts/api/v1/auth/signup";
import { useState } from "react";
import { useRouter } from "next/router";
import nprogress, { render } from "nprogress";

export default function SignUp() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [signingUp, setSigningUp] = useState(false);
	const SignUp = async () => {
		try {
			setSigningUp(true);
			await signup(firstName, lastName, username, email, password);
		} catch (error) {
			return setSigningUp(false)
		}
		setSigningUp(false);
		render(<Check color="success" />)
		return router.push("/auth/login");
	}
	return (
		<>
			<Head>
				<title>Sign Up | Ararat</title>
			</Head>
			<Container>
				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="center"
					mt={30}
				>
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
					>
						<Image src={logo} width={160} height={85.16} />
						<Typography align="center" mt={1} variant="subtitle1">
							Welcome to Ararat! Please Sign Up to continue.
						</Typography>
						<FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
							<TextField
								required
								onChange={e => setFirstName(e.target.value)}
								margin="dense"
								placeholder="Name"
								variant="outlined"
								type="text"
							/>
							<TextField
								required
								onChange={e => setLastName(e.target.value)}
								margin="dense"
								placeholder="Last Name"
								variant="outlined"
								type="text"
							/>
							<TextField
								required
								onChange={e => setUsername(e.target.value)}
								margin="dense"
								placeholder="Username"
								variant="outlined"
								type="text"
							/>
							<TextField
								required
								onChange={(e) => setEmail(e.target.value)}
								margin="dense"
								placeholder="Email"
								variant="outlined"
								type="email"
							/>
							<TextField
								required
								onChange={(e) => setPassword(e.target.value)}
								margin="dense"
								placeholder="Password"
								variant="outlined"
								type="password"

							/>
							<Box component="div" sx={{ mt: 1 }}>

								<LoadingButton
									loading={signingUp}
									onClick={SignUp}
									sx={{ width: "100%" }}
									variant="contained"
									color="primary"
								>
									Sign Up
								</LoadingButton>
							</Box>
						</FormControl>
						<Link href="/auth/login">
							<Button variant="text">Login</Button>
						</Link>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
