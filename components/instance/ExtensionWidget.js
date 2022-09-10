import { RemoteComponent } from "../RemoteComponent";
import nookies from "nookies";

export default function ExtensionWidget({ image, widget }) {
    let cookies = nookies.get();
    const url = `http://localhost:4000/image/${image}/extension/${widget}?key=${cookies.access_token}`;
    const HelloWorld = ({ name }) => <RemoteComponent url={url} name={name} />;
    return (
        <div>
            <HelloWorld name="TEST" />
        </div>
    )
}