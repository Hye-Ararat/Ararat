/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import {
  Fade,
  Card,
  CardMedia,
  Skeleton,
  Grid,
  CardActionArea,
} from "@material-ui/core";
import { getStorage, ref, getDownloadURL } from "@firebase/storage";
import { makeStyles } from "@material-ui/styles";
import Firebase from "../db";
const storage = getStorage(Firebase);
const useStyles = makeStyles({
  media: {
    height: 200,
    width: "100%",
    objectFit: "cover",
  },
});
function Instance(props) {
  const [image, setImage] = React.useState();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  function handleImageLoaded() {
    setImageLoaded(true);
  }
  React.useEffect(() => {
    const pathReference = ref(storage, `instances/${props.id}/images/logo.png`);
    getDownloadURL(pathReference)
      .then((url) => {
        setImage(url);
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setImage("/images/logo.png");
      });
  }, []);
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} md={5} lg={4} xl={3}>
      <Fade in={true}>
        <Card sx={{ borderRadius: 5 }}>
          <CardActionArea
            component={Link}
            to={`/instance/${props.id}`}
            sx={{ borderRadius: 5 }}
          >
            <CardMedia sx={{ borderRadius: 5 }}>
              <div style={{ borderRadius: 5 }}>
                <Fade in={imageLoaded}>
                  <img
                    draggable="false"
                    style={{
                      display: imageLoaded ? "block" : "none",
                      borderRadius: 5,
                    }}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    src={image}
                    onLoad={() => handleImageLoaded()}
                    className={classes.media}
                  />
                </Fade>
                {imageLoaded == false ? (
                  <Skeleton
                    sx={{ borderRadius: 5 }}
                    animation="wave"
                    className={classes.media}
                    variant="rectangular"
                  ></Skeleton>
                ) : (
                  ""
                )}{" "}
              </div>
            </CardMedia>
          </CardActionArea>
          {/*           <CardContent>
            <Typography noWrap variant="h5">
              {props.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button sx={{m: 0.5}}variant="contained" component={Link} to={`/instance/${props.id}`} size="small">Select</Button>
          </CardActions> */}
        </Card>
      </Fade>
    </Grid>
  );
}

export default Instance;
