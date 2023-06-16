"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogTitle, Typography, TextField } from "../../../components/base";
import SelectImage from "./create/SelectImage";
import InstanceDetails from "./create/InstanceDetails";
import { Tabs } from "../../../components/base";
import { Tab } from "../../../components/base";
import { DialogContent } from "../../../components/base";
import Storage from "./create/Storage";
import Networks from "./create/Networks";
import ResourceLimits from "./create/ResourceLimits";
import SecurityPolicies from "./create/SecurityPolicies";
import Snapshots from "./create/Snapshots";
import Advanced from "./create/Advanced";

export default function CreateInstance({imageServers, profiles, storagePools, accessToken, networks}) {
    const [creatingInstance, setCreatingInstance] = useState(false);
    const [createMusic, setCreateMusic] = useState(null);

    const [step, setStep] = useState("selectImage");
    const [instanceName, setInstanceName] = useState("")
    const [image, setImage] = useState(null);
    const [type, setType] = useState(null);
    const [profile, setProfile] = useState(profiles[0].name)
    const [volumes, setVolumes] = useState([
        {
            profile: false,
            name: "root",
            path: "/",
        }
    ]);
    const [memoryLimit, setMemoryLimit] = useState(null);
    const [cpuCores, setCpuCores] = useState(null);
    const [instanceNetworks, setInstanceNetworks] = useState([]);
    const [securityPolicies, setSecurityPolicies] = useState({
        "security.nesting": {
            value: false,
            description: "Controls whether to support running LXD (nested) inside the instance",
            condition: "container",
            title: "Nesting"
        },
        "security.privileged": {
            value: false,
            description: "Controls whether to run the instance in privileged mode",
            condition: "container",
            title: "Privileged Mode"
        },
        "security.protection.delete": {
            value: false,
            description: "Prevents the instance from being deleted",
            title: "Deletion Protection"
        },
        "security.secureboot": {
            value: true,
            description: "Controls whether UEFI secure boot is enabled with default Microsoft keys",
            condition: "virtual-machine",
            title: "Secure Boot"
        },
        "security.sev": {
            value: false,
            description: "Controls wether AMD SEV (Secure Encrypted Virtualization) is enabled for this VM",
            condition: "virtual-machine",
            title: "AMD SEV"
        },
        "security.sev.policy.es": {
            title: "AMD SEV-ES",
            value: false,
            description: "Controls whether AMD SEV-ES (SEV Encrypted State) is enabled for this VM",
            condition: "virtual-machine"
        }
    });
    const [snapshotSchedule, setSnapshotSchedule] = useState("");
    const [snapshotExpiration, setSnapshotExpiration] = useState("1d");
    const [autoWhileStopped, setAutoWhileStopped] = useState(false);
    const [config, setConfig] = useState({});
    useEffect(() => {
        let newConfig = {};
        if (image) {
            newConfig.source = {
                type: "image",
                certificate: "",
                protocol: "simplestreams",
                mode: "pull",
                allow_inconsistent: false,
            }
            newConfig.source.server = imageServers[0].url;
            newConfig.source.alias = image.aliases.split(",")[0];
        }
        newConfig.name = instanceName;
        if (type) newConfig.type = type;
        if (profile) newConfig.profiles = [profile];
        volumes.forEach((vol) => {
            if (!newConfig.devices) newConfig.devices = {};
            if (!vol.profile) {
            newConfig.devices[vol.name] = {
                type: "disk",
                path: vol.path,
                pool: vol.pool
            }
            if (vol.source) newConfig.devices[vol.name].source = vol.source;
            if (vol.size) newConfig.devices[vol.name].size = vol.size
        }   
        })
        instanceNetworks.forEach((net) => {
            if (!newConfig.devices) newConfig.devices = {};
            if (!net.profile) {
                newConfig.devices[net.name] = {
                    type: "nic",
                    network: net.network
                }
            }
        })
        let profileData = profiles.filter((prof) => prof.name == profile)[0];
        if (!newConfig.config) {
            newConfig.config = {}
        }
        if (!profileData.config["limits.memory"]) {
        if (memoryLimit) newConfig.config["limits.memory"] = memoryLimit;
        }
        if (!profileData.config["limits.cpu"]) {
        if (cpuCores) newConfig.config["limits.cpu"] = cpuCores;
        }
        if (snapshotExpiration) newConfig.config["snapshots.expiry"] = snapshotExpiration;
        if (snapshotSchedule) newConfig.config["snapshots.schedule"] = snapshotSchedule;
        newConfig.config["snapshots.schedule.stopped"] = autoWhileStopped.toString();
        Object.keys(securityPolicies).forEach((policy) => {
            if (securityPolicies[policy].condition == type) {
                newConfig.config[policy] = securityPolicies[policy].value.toString();
            }
            
        })
        setConfig(newConfig)
    })
    useEffect(() => {
         setCreateMusic(new Audio("/audio/create.mp3"))
    }, [])
    useEffect(() => {
        if (image) {
        setStep("instanceDetails")
        } else {
            setStep("selectImage")
        }
    }, [image]);
    useEffect(() => {
        if (profile) {
            let profileData = profiles.filter((prof) => prof.name == profile)[0];
            console.log(profileData)
            if (Object.keys(profileData.devices).length > 0) {
                console.log(profileData.devices)
                if (JSON.stringify(profileData.devices).includes("root")) {
                setVolumes([]);
                }
                let vols = [];
                let nets = [];
                Object.keys(profileData.devices).forEach((device) => {
                    let deviceData = profileData.devices[device];
                    if (deviceData.type == "disk") {
                        let volDat = {};
                        volDat.name = device;
                        volDat.profile = true;
                        volDat.path = deviceData.path;
                        volDat.pool = deviceData.pool;
                        if (volDat.size) {
                            volDat.size = deviceData.size;
                        }
                        if (volDat.volume) {
                            volDat.volume = deviceData.source;
                        }
                        vols.push(volDat);
                    }
                    if (deviceData.type == "nic") {
                        let netDat = {};
                        netDat.name = device;
                        netDat.profile = true;
                        netDat.network = deviceData.network;
                        nets.push(netDat);
                    }
                })
                console.log(vols)
                setVolumes(vols);
                setInstanceNetworks(nets);
            } else {
                setVolumes([     {
            profile: false,
            name: "root",
            path: "/",
        }])
            }
}
    }, [profile])
    return (
        <>
        <Button sx={{ml: "auto"}} variant="contained" color="primary" onClick={async () => {
            setCreatingInstance(true)
                createMusic.play();
        }}>Create Instance</Button>
        <Dialog open={creatingInstance} onClose={async () => {
            createMusic.pause();
            createMusic.currentTime = 0;
            setCreatingInstance(false);
            setImage(null);
        }}>
            {step === "selectImage" ? <SelectImage setImage={setImage} imageServers={imageServers} /> : 
            <>
            <DialogTitle>
                <>
                <Typography variant="h6" align="center" fontFamily="Poppins">Create Instance</Typography>
                   <Tabs variant="scrollable" scrollButtons={true}scrollable={true} value={step} onChange={(e, value) => setStep(value)}>
            <Tab label={"Instance Details"} value={"instanceDetails"} />
            <Tab label={"Storage"} value={"storage"} />
            <Tab label={"Networks"} value={"networks"} />
            <Tab label={"Resource Limits"} value={"resourceLimits"} />
            <Tab label={"Security Policies"} value={"securityPolicies"} />
            <Tab label={"Snapshots"} value={"snapshots"} />
            <Tab label={"Advanced"} value={"advanced"} />

        </Tabs>
                </>
       
        </DialogTitle>
            </>
            
            }
            {step != "selectImage" ? 
            <DialogContent>
            {step == "instanceDetails" ? 
            <InstanceDetails instanceName={instanceName} setInstanceName={setInstanceName} profile={profile} setProfile={setProfile} profiles={profiles} setStep={setStep} image={image} type={type} setType={setType} />
            : ""}
            {step == "storage" ? <Storage setStep={setStep} accessToken={accessToken} storagePools={storagePools} volumes={volumes} setVolumes={setVolumes} /> : ""}
            {step == "networks" ? <Networks setStep={setStep} networks={networks} instanceNetworks={instanceNetworks} setInstanceNetworks={setInstanceNetworks} /> : ""}
            {step == "resourceLimits" ? <ResourceLimits setStep={setStep} profiles={profiles} profile={profile} memoryLimit={memoryLimit} setMemoryLimit={setMemoryLimit} cpuCores={cpuCores} setCpuCores={setCpuCores} /> : ""}
            {step == "securityPolicies" ? <SecurityPolicies type={type} setStep={setStep} profiles={profiles} profile={profile} securityPolicies={securityPolicies} setSecurityPolicies={setSecurityPolicies} /> : ""}
            {step == "snapshots" ? <Snapshots setStep={setStep} snapshotSchedule={snapshotSchedule} setSnapshotSchedule={setSnapshotSchedule} snapshotExpiration={snapshotExpiration} setSnapshotExpiration={setSnapshotExpiration} autoWhileStopped={autoWhileStopped} setAutoWhileStopped={setAutoWhileStopped} configuration={config} accessToken={accessToken} /> : ""}
            {step == "advanced" ? <Advanced accessToken={accessToken} config={config} /> : ""}
            </DialogContent>
            : ""}
        </Dialog>
        </>
    )
}