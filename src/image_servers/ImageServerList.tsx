import React, { useState } from "react";

interface ImageServer {
  name: string;
  url: string;
}

const ImageServerList: React.FC = () => {
  const [servers, setServers] = useState<ImageServer[]>([]);
  const [newServer, setNewServer] = useState<ImageServer>({ name: "", url: "" });

  const addServer = () => {
    setServers([...servers, newServer]);
    setNewServer({ name: "", url: "" });
  };

  return (
    <div>
      <h2>Image Servers</h2>
      <ul>
        {servers.map((server, index) => (
          <li key={index}>
            {server.name} - {server.url}
          </li>
        ))}
      </ul>
      <h3>Add Server</h3>
      <input
        type="text"
        placeholder="Name"
        value={newServer.name}
        onChange={(e) =>
          setNewServer({ ...newServer, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="URL"
        value={newServer.url}
        onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
      />
      <button onClick={addServer}>Add</button>
    </div>
  );
};

export default ImageServerList;
