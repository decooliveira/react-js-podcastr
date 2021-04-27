
import { Header } from '../components/Header';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { Player } from '../components/Player';
import { PlayerContext } from '../context/playerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const[episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex,setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  return (

      <PlayerContext.Provider value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        play,
        setPlayingState,
        togglePlay
      }}>
        <div className={styles.wrapper}>
        <main>
          <Header/>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
      </PlayerContext.Provider>
  )
}

export default MyApp
