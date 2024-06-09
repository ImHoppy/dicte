import { useEffect, useState } from 'react';
import './AdminApp.scss'
import { socket, useSocketEvent } from '../socket.io';
import { TextBox } from '../components/TextBox/TextBox';
import { Timer } from '../components/Timer/Timer';
import { GameState } from '../App/App';
import { AudioPlayer } from '../App/AudioPlayer';
import classNames from 'classnames';

interface Client {
  name: string;
  id: string;
  text: string;
  isFocused: boolean;
}

export function AdminApp() {

  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);

  const [clients, setClients] = useState<Record<string, Client>>({});

  useEffect(() => {
    socket.emit('joinAdmin', null, (state: GameState) => {
      setStarted(state.started);
      setTimer(state.timer);
    });
  }, []);

  useSocketEvent('clients', (clients: Record<string, Client>) => {
    setClients(clients);
  });

  useSocketEvent('state', (state: GameState) => {
    setStarted(state.started);
    setTimer(state.timer);
  });

  return (
    <>
      <div className="controls">
        <button onClick={() => socket.emit(started ? 'pause' : 'start')}>{started ? 'Pause' : 'Start'}</button>
        <button onClick={() => socket.emit('verify')}>Verify</button>
      </div>
      <h1 className='time'><Timer paused={!started} defaultTimer={timer} /></h1>
      <AudioPlayer />
      <div className="clients">
        {
          clients && Object.values(clients).map((client) => {
            return (
              <div className={classNames('client', { focus: client.isFocused })} key={client.id}>
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