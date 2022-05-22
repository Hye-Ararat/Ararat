import { Avatar, CardActionArea, Grid, Paper, Skeleton, Typography } from "@mui/material"
import Link from "next/link"
import { get } from "axios"
import useSWR from "swr"
import { useEffect, useState } from "react"
import prettyBytes from "pretty-bytes"
import { faMemory, faMicrochip } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export default function Instance({ instance }) {
  const [statisticsWS, setStatisticsWS] = useState(null);
  const [statistics, setStatistics] = useState({
    cpu: null,
    memory: {
      usage: null
    },
    state: null
  });

  const fetcher = (url) => get(url).then((res) => res.data);
  const { data: instanceData } = useSWR(`/api/v1/client/instances/${instance.id}`, fetcher);
  console.log(statistics);
  useEffect(() => {
    if (!statisticsWS && instanceData) {
      get(`/api/v1/client/instances/${instanceData.id}/monitor/ws`).then((res) => {
        const token = res.data;

        const ws = new WebSocket(`${instanceData.node.ssl ? "wss" : "ws"}://${instanceData.node.hostname}:${instanceData.node.port}/api/v1/instances/${instanceData.id}/monitor`)
        ws.onopen = () => ws.send(token)

        setStatisticsWS(ws);
      }).catch(() => { });
    } else if (instanceData && statisticsWS) {
      statisticsWS.onmessage = (data) => setStatistics(JSON.parse(data.data));
    }
    return () => {
      if (statisticsWS) statisticsWS.close();
    }
  }, [statisticsWS, instanceData]);

  return (
    <Grid container item xs={12}>
      <Link href={`/instance/${instance.id}`} passHref>
        <CardActionArea>
          <Paper sx={{ width: "100%", p: 2 }}>
            <Grid container direction="row" xs={12}>
              <Grid container direction="row" xs={5}>
                {instanceData || statistics.state ?
                  <Avatar sx={{ mr: 1, border: statistics.state ? 4 : "", borderColor: statistics.state ? statistics.state == "Online" ? "#1d5434" : "#592525" : "transparent" }} src={instanceData.image ? instanceData.image.type == "n-vps" ? "/hye.png" : instanceData.image.type == "kvm" ? "/images/kvm.png" : "" : "/hye.png"} />
                  : <Skeleton variant="circular" sx={{ height: "40px", width: "40px", mr: 1 }} />}
                <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>{instance.name}</Typography>
              </Grid>
              {instanceData ?
                <>
                  {instanceData.cpu ?
                    <Grid container direction="row" xs={2} sx={{ mt: "auto", mb: "auto", ml: "auto" }}>
                      <Typography>
                        <FontAwesomeIcon icon={faMicrochip} style={{ marginRight: 5, marginTop: "auto", marginBottom: "auto" }} />
                        {statistics.cpu != null ? statistics.cpu.toFixed(2) + "%" : instanceData.cpu + " Cores"}
                      </Typography>
                    </Grid>
                    : ""}
                  {instanceData.memory ?
                    <Grid container direction="row" xs={2} sx={{ mt: "auto", mb: "auto", ml: "auto" }}>
                      <Typography><FontAwesomeIcon icon={faMemory} style={{ marginRight: 5, marginTop: "auto", marginBottom: "auto" }} /> {statistics.memory.usage != null ? prettyBytes(statistics.memory.usage, { binary: true }).replace(" ", "") + " / " : ""} {instanceData.memory}</Typography>
                    </Grid>
                    : ""}
                </>
                : ""}
            </Grid>
          </Paper>
        </CardActionArea>
      </Link>
    </Grid>
  )
}
