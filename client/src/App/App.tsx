import { useEffect, useState } from 'react';
import './App.scss'
import { UsernameInput } from './components/UsernameInput/UsernameInput';
import { socket } from '../socket.io';
import { MdBlock } from "react-icons/md";
import { AudioPlayer } from './AudioPlayer';
import { TextBox } from './components/TextBox/TextBox';

export function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [timer, setTimer] = useState(0);
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    socket.emit('username', username, (time: number) => {
      setTimer(time);
    });
  }, [username]);

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

  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started]);


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
        {new Date(timer * 1000).toISOString().substr(11, 8)}
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