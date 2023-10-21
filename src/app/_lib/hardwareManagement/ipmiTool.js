import { execSync } from "node:child_process";

export default async function ipmiTool(ip, username, password, command) {
  let dat = execSync(
    `ipmitool -I lanplus -H ${ip} -U ${username} -P ${password} ${command}`
  );
  return dat.toString();
}
