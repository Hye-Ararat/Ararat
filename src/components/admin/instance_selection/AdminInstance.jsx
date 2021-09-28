/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import {
  Fade,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Skeleton,
  Grid,
} from "@material-ui/core";
import { getStorage, ref, getDownloadURL } from "@firebase/storage";
import { makeStyles } from "@material-ui/styles";
import Firebase from "../../db";
const storage = getStorage(Firebase);
const useStyles = makeStyles({
  media: {
    height: 140,
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
      .catch(() => {
        setImage("/images/logo.png");
      });
  }, []);
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Fade in={true}>
        <Card>
          <CardMedia>
            <Fade in={imageLoaded}>
              <img
                style={{ display: imageLoaded ? "block" : "none" }}
                src={image}
                onLoad={() => handleImageLoaded()}
                className={classes.media}
              />
            </Fade>
            {imageLoaded == false ? (
              <Skeleton
                animation="wave"
                className={classes.media}
                variant="rectangular"
              ></Skeleton>
            ) : (
              ""
            )}
          </CardMedia>
          <CardContent>
            <Typography noWrap variant="h5">
              {props.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to={`/admin/instance/${props.id}`}
              size="small"
            >
              Select
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Grid>
  );
}

export default Instance;
