import { useEffect, useState } from 'react';
import './App.scss'
import { UsernameInput } from '../components/UsernameInput/UsernameInput';
import { socket, useSocketEvent } from '../socket.io';
import { MdBlock } from "react-icons/md";
import { AudioPlayer } from './AudioPlayer';
import { TextBox } from '../components/TextBox/TextBox';
import { Timer } from '../components/Timer/Timer';

export interface GameState {
  started: boolean;
  timer: number;
}

export function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    socket.emit('joinUser', username, (state: GameState) => {

      setStarted(state.started);
      setTimer(state.timer);
    });
  }, [username]);

  useSocketEvent('state', (state: GameState) => {
    setStarted(state.started);
    setTimer(state.timer);
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

  useEffect(() => {
    const start = () => {
      setStarted(true);
    };

    const stop = () => {
      setStarted(false);
    };

    const text = (text: string) => {
      setText(text);
    }

    socket.on('start', start);
    socket.on('stop', stop);
    socket.on('text', text);

    return () => {
      socket.off('start', start);
      socket.off('stop', stop);
      socket.off('text', text);
    }
  }, []);

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
          onTextChange={(text) => {
            setText(text);
            socket.emit('text', text);
          }}
        />
      </div>
    </div>
  )
}