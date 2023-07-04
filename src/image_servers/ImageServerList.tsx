import React, { useState, useEffect } from "react";
import { TextInput, Button, Title, Modal } from "@mantine/core";
import { PrismaClient } from "@prisma/client";

interface ImageServer {
  name: string;
  url: string;
}

const prisma = new PrismaClient();

const ImageServerList: React.FC = () => {
  const [servers, setServers] = useState<ImageServer[]>([]);
  const [newServer, setNewServer] = useState<ImageServer>({ name: "", url: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    const fetchedServers = await prisma.imageServer.findMany();
    setServers(fetchedServers);
  };

  const addServer = async () => {
    await prisma.imageServer.create({
      data: {
        name: newServer.name,
        url: newServer.url,
      },
    });
    fetchServers();
    setNewServer({ name: "", url: "" });
    setShowModal(false);
  };

  return (
    <div>
      <Title order={2}>Image Servers</Title>
      <ul>
        {servers.map((server, index) => (
          <li key={index}>
            {server.name} - {server.url}
          </li>
        ))}
      </ul>

      <Button onClick={() => setShowModal(true)}>Add Server</Button>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Add Server"
      >
        <TextInput
          placeholder="Name"
          value={newServer.name}
          onChange={(e) =>
            setNewServer({ ...newServer, name: e.currentTarget.value })
          }
        />
        <TextInput
          placeholder="URL"
          value={newServer.url}
          onChange={(e) =>
            setNewServer({ ...newServer, url: e.currentTarget.value })
          }
        />
        <Button onClick={addServer}>Add</Button>
      </Modal>
    </div>
  );
};

export default ImageServerList;
