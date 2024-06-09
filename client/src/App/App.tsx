import { useEffect, useState } from 'react';
import './App.scss'
import { UsernameInput } from '../components/UsernameInput/UsernameInput';
import { socket, useSocketEvent } from '../socket.io';
import { MdBlock } from "react-icons/md";
import { AudioPlayer } from './AudioPlayer';
import { TextBox } from '../components/TextBox/TextBox';
import { Timer } from '../components/Timer/Timer';
import { GenerateDiff } from '../components/Diff';

export interface GameState {
  started: boolean;
  startTime: number;
  audioUrl: string,
  audioPaused: boolean,
  audioTime: number,
}

export function App() {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!username) return;
    socket.emit('joinUser', username);
  }, [username]);

  useSocketEvent('state', (state: GameState) => {
    setStarted(state.started);
    if (state.startTime > 0)
      setTimer(Date.now() - state.startTime);
  });

  // Focus handling
  useEffect(() => {
    const handleWindowFocus = () => {
      socket.emit('focus');
    }
    const handleWindowBlur = () => {
      socket.emit('blur');
    }
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  useSocketEvent('text', (text: string) => {
    setText(text);
  });

  const [diff, setDiff] = useState<string>();

  useSocketEvent('correction', (correction: string) => {
    setDiff(GenerateDiff(text, correction));
  });

  if (!username) {
    return (
      <UsernameInput
        onSubmit={(username) => {
          localStorage.setItem('username', username);
          setUsername(username);
        }}
      />
    )
  }
  return (
    <div className="app">
      <AudioPlayer />
      <div className="timer">
        <Timer
          paused={!started}
          defaultTimer={timer}
        />
      </div>
      <div className="box">
        {
          !started && (
            <MdBlock
              className='block-icon'
              size={100}
            />
          )
        }
        <TextBox
          disable={!started}
          text={text}
          diff={diff}
          onTextChange={(text) => {
            setText(text);
            socket.emit('text', text);
          }}
        />
      </div>
    </div>
  )
}