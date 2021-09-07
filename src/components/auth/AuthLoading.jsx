import {Backdrop, CircularProgress} from '@material-ui/core'

function AuthLoading(){
    return(
        <Backdrop open={true}> <CircularProgress color="inherit" />
</Backdrop>
    )
}

export default AuthLoading