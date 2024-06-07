import { useState } from 'react';
import './AdminApp.css'
import { useSocketEvent } from '../socket.io';
import { TextBox } from '../App/components/TextBox/TextBox';
import { Timer } from '../App/components/Timer/Timer';

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
      <h1 className='time'><Timer paused={false} defaultTimer={0} /></h1>
      <div className="clients">
        {
          clients && Object.values(clients).map((client) => {
            return (
              <div className='client' key={client.id}>
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
      </div>
    </>
  )
}