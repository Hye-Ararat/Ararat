import fs from "fs";
import sftpServer from "lxd-sftp-server";


export default function () {
    sftpServer.launch((context) => {
        context.accept()
        return "more-jaguar"
    }, 2222, fs.readFileSync('/root/.ssh/id_rsa'))
}
