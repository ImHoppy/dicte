import { useState } from 'react';
import './AdminApp.css'
import { useSocketEvent } from '../socket.io';
import { TextBox } from '../App/components/TextBox/TextBox';

interface Client {
  name: string;
  id: string;
  text: string;
}

export function AdminApp() {

  const [clients, setClients] = useState<Record<string, Client>>({});

  useSocketEvent('clients', (clients: Record<string, Client>) => {
    setClients(clients);
  });

  return (
    <>
      {
        clients && Object.values(clients).map((client) => {
          return (
            <div key={client.id}>
              <h1>{client.name}</h1>
              <TextBox
                disable={true}
                onTextChange={() => { }}
                text={client.text}
              />
            </div>
          )
        })
      }
    </>
  )
}