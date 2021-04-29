import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title:string;
    members:string;
    thumbnail:string;
    duration:number;
    url:string;
}
type PlayerContextData = {
    episodeList:Episode[];
    currentEpisodeIndex:number;
    isPlaying:boolean;
    isLooping:boolean;
    isShuffling:boolean;
    hasNext:boolean;
    hasPrevious:boolean;
    play: (episode:Episode) => void;
    playList:(list:Episode[], index:number)=> void;
    togglePlay:() => void;
    toggleLoop:() => void;
    toggleShuffle:() => void;
    playNext:() => void;
    playPrevious:() => void;
    setPlayingState:(state:boolean)=>void;
    clear: () => void;
}
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps) {

  const[episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex,setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);


 const hasPrevious = currentEpisodeIndex > 0;
 const hasNext = (currentEpisodeIndex +1) < episodeList.length || isShuffling;


  function play(episode:Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
      setIsShuffling(!isShuffling);
  }
  function playList(list: Episode[], index:number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function clear(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  function playNext(){
    
    if(isShuffling){
        const nextRandIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandIndex);
    }else if(hasNext){
        setCurrentEpisodeIndex(currentEpisodeIndex+1);
    }
  }

  function playPrevious(){
  
    if(hasPrevious){
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
    
}
  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  return (

      <PlayerContext.Provider value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        play,
        playList,
        setPlayingState,
        togglePlay, 
        toggleLoop,
        toggleShuffle,
        playNext,
        playPrevious,
        clear
      }}>
          {children}
      </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}