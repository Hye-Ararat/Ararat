import {
    TextField,
    Container,
    FormControl,
    Box,
    Skeleton,
    Grid,
    Typography,
    Button,
    Hidden,
    CardMedia
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';



function LoginContainer() {
    return (
        <Container>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                mt={8}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Hidden only={["sm", "xs"]}>
                        <Box component="img" mt={20} src="https://hyehosting.com/images/logo.png" style={{ width: "10rem" }} />
                    </Hidden>
                    <Hidden only={["md", "lg", "xl"]}>
                        <img src="https://hyehosting.com/images/logo.png" width="150px" alt="logo" />
                    </Hidden>
                    <Typography align="center" mt={1} variant="subtitle1">
                        <Hidden only={["sm", "xs"]}>
                            Welcome to Ararat!
                        </Hidden> Please login with your account.
                    </Typography>
                    <Hidden only={["sm", "xs"]}>
                        <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                            <TextField margin="dense" id="Email" label="Email" variant="outlined" type="email" />
                            <TextField margin="dense" id="Password" label="Password" variant="outlined" type="password" />
                            <Box component="div" mb={1} />
                            <Button variant="contained">Login</Button>
                        </FormControl>
                    </Hidden>
                    <Hidden only={["md", "lg", "xl"]}>
                        <FormControl sx={{ m: 1, width: '30ch' }} variant="outlined">
                            <TextField margin="dense" id="Email" label="Email" variant="outlined" type="email" />
                            <TextField margin="dense" id="Password" label="Password" variant="outlined" type="password" />
                            <Box component="div" mb={1} />
                            <Button variant="contained">Login</Button>
                        </FormControl>
                    </Hidden>
                    <Button variant="text">Forgot Password?</Button>
                </Grid>
            </Grid>
        </Container>
    )
}
export default LoginContainer