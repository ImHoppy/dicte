import { useEffect, useState } from 'react';
import './AdminApp.scss'
import { socket, useSocketEvent } from '../socket.io';
import { TextBox } from '../components/TextBox/TextBox';
import { Timer } from '../components/Timer/Timer';
import { GameState } from '../App/App';
import { AudioPlayer } from '../App/AudioPlayer';
import classNames from 'classnames';
import { Button } from '../components/Button/Button';

interface Client {
  name: string;
  id: string;
  text: string;
  isFocused: boolean;
}

export function AdminApp() {
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioPaused, setAudioPaused] = useState(true);

  const [clients, setClients] = useState<Record<string, Client>>({});

  useEffect(() => {
    socket.emit('joinAdmin');
  }, []);

  useSocketEvent('clients', (clients: Record<string, Client>) => {
    setClients(clients);
  });

  useSocketEvent('state', (state: GameState) => {
    setStarted(state.started);
    if (state.startTime > 0)
      setTimer(Date.now() - state.startTime);
    setAudioPaused(state.audioPaused);
  });

  const handleAudioPause = () => {
    socket.emit(!started || audioPaused ? 'start' : 'pause')
  }

  return (
    <div className="admin-app">
      <div className="header">
        <div className="controls">
          <Button className='button' onClick={handleAudioPause}>{!started || audioPaused ? 'Start' : 'Pause'}</Button>
          <Button className='button' onClick={() => socket.emit('verify')}>Verify</Button>
        </div>
        <h1 className='time'><Timer paused={!started} defaultTimer={timer} /></h1>
      </div>
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
    </div>
  )
}