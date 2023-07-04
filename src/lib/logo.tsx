import { SiAlpinelinux, SiAmazon, SiArchlinux, SiCentos, SiDebian, SiFedora, SiGentoo, SiKalilinux, SiLinux, SiLinuxmint, SiOpensuse, SiOpenwrt, SiOracle, SiRockylinux, SiUbuntu } from "@icons-pack/react-simple-icons";

export function getOSLogo(os: string, size?: number) {
    switch (os) {
        case "apline":
            return <SiAlpinelinux color="#0D597F" size={size}/>;
        case "amazonlinux":
            return <SiAmazon color="#FF9900" size={size}/>;
        case "archlinux":
            return <SiArchlinux color="#1793D1" size={size}/>;
        case "centos":
            return <SiCentos color="#262577" size={size}/>;
        case "debian":
            return <SiDebian color="#A81D33" size={size}/>;
        case "fedora":
            return <SiFedora color="#51A2DA" size={size}/>;
        case "gentoo":
            return <SiGentoo color="#54487A" size={size}/>;
        case "kali":
            return <SiKalilinux color="#557C94" size={size}/>;
        case "mint":
            return <SiLinuxmint color="#87CF3E" size={size}/>;
        case "opensuse":
            return <SiOpensuse color="#73BA25" size={size}/>;
        case "openwrt":
            return <SiOpenwrt color="#00B5E2" size={size}/>;
        case "oracle":
            return <SiOracle color="#F80000" size={size}/>;
        case "rockylinux":
            return <SiRockylinux color="#10B981" size={size}/>;
        case "ubuntu":
            return <SiUbuntu color="#E95420" size={size}/>;
        default:
            return <SiLinux color="#FCC624" size={size}/>;
    }
}