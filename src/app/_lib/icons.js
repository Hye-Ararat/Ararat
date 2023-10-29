import { SiDell, SiHp } from "@icons-pack/react-simple-icons";

export function getBrandIcon(brand, size, style) {
  switch (brand) {
    case "Dell":
      return <SiDell style={style} size={size} color="#0076CE" />;
    case "HP":
      return <SiHp style={style} size={size} color="#0096D6" />;
  }
}
