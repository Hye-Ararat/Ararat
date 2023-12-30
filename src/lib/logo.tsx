import { SiAlpinelinux, SiAmazon, SiApple, SiArchlinux, SiCentos, SiDebian, SiDell, SiFedora, SiGentoo, SiHp, SiKalilinux, SiLenovo, SiLinux, SiLinuxmint, SiMicrosoft, SiOpensuse, SiOpenwrt, SiOracle, SiProxmox, SiQemu, SiRockylinux, SiSupermicro, SiUbuntu, SiVirtualbox, SiVmware, SiMinecraft } from "@icons-pack/react-simple-icons";
import { IconServer2 } from "@tabler/icons-react";

export function getOSLogo(os: string, size?: number) {
    switch (os) {
        case "papermc":
            return <SiMinecraft color="#F89820" size={size} />;
        case "apline":
            return <SiAlpinelinux color="#0D597F" size={size} />;
        case "amazonlinux":
            return <SiAmazon color="#FF9900" size={size} />;
        case "archlinux":
            return <SiArchlinux color="#1793D1" size={size} />;
        case "centos":
            return <SiCentos color="#262577" size={size} />;
        case "debian":
            return <SiDebian color="#A81D33" size={size} />;
        case "fedora":
            return <SiFedora color="#51A2DA" size={size} />;
        case "gentoo":
            return <SiGentoo color="#54487A" size={size} />;
        case "kali":
            return <SiKalilinux color="#557C94" size={size} />;
        case "mint":
            return <SiLinuxmint color="#87CF3E" size={size} />;
        case "opensuse":
            return <SiOpensuse color="#73BA25" size={size} />;
        case "openwrt":
            return <SiOpenwrt color="#00B5E2" size={size} />;
        case "oracle":
            return <SiOracle color="#F80000" size={size} />;
        case "rockylinux":
            return <SiRockylinux color="#10B981" size={size} />;
        case "ubuntu":
            return <SiUbuntu color="#E95420" size={size} />;
        default:
            return <SiLinux color="#FCC624" size={size} />;
    }
}

export function getVendorLogo(vendor: string, size?: number | string) {
    if (vendor.toLowerCase().includes("dell")) {
        return <SiDell color="#007DB8" size={size} />;
    }
    if (vendor.toLowerCase().includes("hp") || vendor.toLowerCase().includes("hewlett")) {
        return <SiHp color="#0096D6" size={size} />;
    }
    if (vendor.toLowerCase().includes("lenovo")) {
        return <SiLenovo color="#E2231A" size={size} />;
    }
    if (vendor.toLowerCase().includes("vmware")) {
        return <SiVmware color="#607078" size={size} />;
    }
    if (vendor.toLowerCase().includes("virtualbox")) {
        return <SiVirtualbox color="#183A61" size={size} />;
    }
    if (vendor.toLowerCase().includes("apple")) {
        return <SiApple color="#fff" size={size} />;
    }
    if (vendor.toLowerCase().includes("microsoft")) {
        return <SiMicrosoft color="#0078D4" size={size} />;
    }
    if (vendor.toLowerCase().includes("supermicro")) {
        return <SiSupermicro color="#5E5E5E" size={size} />;
    }
    if (vendor.toLowerCase().includes("amazon")) {
        return <SiAmazon color="#FF9900" size={size} />;
    }
    if (vendor.toLowerCase().includes("oracle")) {
        return <SiOracle color="#F80000" size={size} />;
    }
    if (vendor.toLowerCase().includes("proxmox")) {
        return <SiProxmox color="#E57000" size={size} />;
    }
    if (vendor.toLowerCase().includes("qemu")) {
        return <SiQemu color="#FF6600" size={size} />;
    }
    return <IconServer2 color="#000000" size={size} />;


}