import { useContext, useRef, useEffect } from 'react';
import { PlayerContext } from '../../context/playerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';



export function Player(){

    const {episodeList, currentEpisodeIndex, isPlaying, tooglePlay, setPlayingState} = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];

    const audioRef = useRef<HTMLAudioElement>(null);
    
    useEffect(()=>{
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    },[isPlaying]);

    return (
        <div className={styles.playerContainer}>

            <header>
                <img src='/playing.svg' alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            {
                episode?
                (
                    <div className={styles.currentEpisode}>
                        <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                )
                :
                (
                    <div className={styles.emptyPlayer}>

                <strong> Selecione um podcast para ouvir</strong>

            </div>
                )
            }
            


            <footer className={ !episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>

                    <div className={styles.slider}>
                    {
                                episode ?
                                (
                                    <Slider
                                        trackStyle={{backgroundColor:'#84d361'}}
                                        railStyle= {{ backgroundColor:'#9f75ff'}}
                                        handleStyle = {{ borderColor:'#84d361', borderWidth:4}}
                                    />
                                )
                                :
                                (
                                    <div className={styles.emptySlider}/>
                            
                      
                                )
                            }
                        
                    </div>
                    <span>00:00</span>
                </div>

                {
                    episode && 
                    (
                        <audio 
                        src={episode.url} 
                        ref={audioRef}
                        autoPlay
                        onPlay={()=> setPlayingState(true)}
                        onPause = {() => setPlayingState(false)}
                        >

                        </audio>
                    )
                }
                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>

                    <button type="button" 
                    disabled={!episode} 
                    className={styles.playButton}
                    onClick={()=> tooglePlay()}>
                        {
                            isPlaying?
                            (
                                <img src="/pause.svg" alt="Tocar"/>
                            )
                            :
                            (
                                <img src="/play.svg" alt="Tocar"/>
                            )
                        }
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>

                </div>
            </footer>

        </div>
        );
}