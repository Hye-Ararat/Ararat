import { useRouter } from "next/router";
import Navigation from "../../components/server/Navigation";
import { Typography } from "@mui/material";
import useSWR from "swr";
import axios from "axios";

export default function Server({ data }) {
    const router = useRouter();
    const { id } = router.query;
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    function Server() {
        const {data} = useSWR(`/api/v1/client/servers/${id}`, fetcher)
        console.log(data)
        if (!data) {
            return {
                name: "Loading..."
            }
        }
        return {
            name: data.data.name
        }
    }
	return (
		<Navigation server={id}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {Server().name}
          </Typography>
          			{id}
		</Navigation>
	);
}
