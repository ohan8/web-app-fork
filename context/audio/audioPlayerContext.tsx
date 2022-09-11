import {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  useEffect,
} from 'react';
import {
  Sermon,
  AudioPlayerState,
  PLAY_STATE,
  AUDIO_PLAYER_ACTIONS,
  AUDIO_PLAYER,
} from '../../context/types';

import audioPlayerReducer from '../../reducers/audioPlayerReducer';
import userContext from '../user/UserContext';
const initialState: AudioPlayerState = {
  playlist: [],
  currentSermonIndex: 0,
  currentSermonSecond: 0,
  currentPlayedState: PLAY_STATE.NOT_STARTED,
  playing: false,
  userId: '',
};

type AudioPlayerContextType = {
  playlist: Sermon[];
  currentSermon: Sermon;
  currentSecond: number;
  currentPlayedState: PLAY_STATE;
  playing: boolean;
  dispatch: Dispatch<AUDIO_PLAYER_ACTIONS>;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(audioPlayerReducer, initialState);
  const { user } = useContext(userContext);
  useEffect(() => {
    let userId = '';
    if (user) {
      userId = user.uid;
    }
    dispatch({ type: AUDIO_PLAYER.SET_USER_ID, userId });
  }, [user]);
  return (
    <AudioPlayerContext.Provider
      value={{
        playlist: state.playlist,
        currentSermon: state.playlist[state.currentSermonIndex],
        currentSecond: state.currentSermonSecond,
        currentPlayedState: state.currentPlayedState,
        playing: state.playing,
        dispatch,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined || context === null) {
    throw new Error('useAudioPlayer must be used within a AudioPlayerProvider');
  }
  return context;
};

export default useAudioPlayer;
