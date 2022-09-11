import {
  AudioPlayerState,
  AUDIO_PLAYER,
  AUDIO_PLAYER_ACTIONS,
  PlayedState,
  PLAY_STATE,
  Sermon,
} from '../context/types';
import { updateListenTime } from '../firebase/audio_functions';

export default function audioPlayerReducer(
  state: AudioPlayerState,
  action: AUDIO_PLAYER_ACTIONS
): AudioPlayerState {
  // console.log(type, payload);

  const nextSermon = (state: AudioPlayerState) => {
    return setCurrentSermonIndex(
      state,
      (state.currentSermonIndex + 1) % state.playlist.length
    );
  };
  const setCurrentSermonIndex = (state: AudioPlayerState, index: number) => {
    // update playstate of previous sermon
    console.log('SET_CURRENT_SERMON_INDEX');
    const playedState: PlayedState = {
      playPositionMilliseconds: state.currentSermonSecond,
      state: state.currentPlayedState,
    };
    const updatedPlaylist = state.playlist;
    updatedPlaylist[state.currentSermonIndex] = {
      ...state.playlist[state.currentSermonIndex],
      playedState: playedState,
    };

    console.log(updatedPlaylist[state.currentSermonIndex]);
    return {
      ...state,
      playlist: updatedPlaylist,
      currentSermonSecond:
        updatedPlaylist[index].playedState.playPositionMilliseconds,
      currentPlayedState: state.playing
        ? PLAY_STATE.IN_PROGRESS
        : updatedPlaylist[index].playedState.state,
      currentSermonIndex: index,
    };
  };
  switch (action.type) {
    case AUDIO_PLAYER.SET_USER_ID: {
      console.log('SET_USER_ID', action.userId);
      return { ...state, userId: action.userId };
    }
    case AUDIO_PLAYER.SET_PLAYLIST: {
      return {
        ...state,
        playlist: action.playlist,
        currentSermonSecond:
          action.playlist[state.currentSermonIndex].playedState
            .playPositionMilliseconds,
      };
    }
    case AUDIO_PLAYER.SET_CURRENT_SERMON: {
      if (state.playlist[state.currentSermonIndex].key === action.sermon.key)
        return state;
      const currentSermonIndex = state.playlist.findIndex(
        (s) => s.key === action.sermon.key
      );
      return setCurrentSermonIndex(state, currentSermonIndex);
    }

    case AUDIO_PLAYER.NEXT_SERMON: {
      return nextSermon(state);
    }

    case AUDIO_PLAYER.PREIOUS_SERMON: {
      return setCurrentSermonIndex(
        state,
        (state.currentSermonIndex - 1) % state.playlist.length
      );
    }

    case AUDIO_PLAYER.UPDATE_CURRENT_SERMON_URL: {
      const sermon: Sermon = {
        ...state.playlist[state.currentSermonIndex],
        url: action.url,
      };
      const updatedPlaylist = state.playlist;
      updatedPlaylist[state.currentSermonIndex] = sermon;
      return {
        ...state,
        playlist: updatedPlaylist,
      };
    }

    case AUDIO_PLAYER.TOGGLE_PLAYING: {
      console.log('TOGGLE_PLAYING TO: ', action.isPlaying);
      updateListenTime(
        state.userId,
        state.playlist[state.currentSermonIndex].key,
        state.currentSermonSecond
      );
      if (action.isPlaying === undefined) {
        action.isPlaying = !state.playing; // TODO: see if this works
      }
      if (action.isPlaying) {
        return {
          ...state,
          currentPlayedState: PLAY_STATE.IN_PROGRESS,
          playing: action.isPlaying,
        };
      } else {
        const updatedPlaylist = state.playlist;
        updatedPlaylist[state.currentSermonIndex].playedState = {
          playPositionMilliseconds: state.currentSermonSecond,
          state: PLAY_STATE.IN_PROGRESS,
        };
        return {
          ...state,
          playlist: updatedPlaylist,
          playing: action.isPlaying,
        };
      }
    }

    case AUDIO_PLAYER.UPDATE_CURRENT_SECOND: {
      if (action.second % 5 === 0) {
        updateListenTime(
          state.userId,
          state.playlist[state.currentSermonIndex].key,
          action.second
        );
      }
      return {
        ...state,
        currentSermonSecond: action.second,
      };
    }

    case AUDIO_PLAYER.SERMON_ENDED: {
      console.log('sermon ended dispatch');
      updateListenTime(
        state.userId,
        state.playlist[state.currentSermonIndex].key,
        0,
        PLAY_STATE.COMPLETED
      );
      const updatedPlaylist = state.playlist;
      updatedPlaylist[state.currentSermonIndex] = {
        ...state.playlist[state.currentSermonIndex],
        playedState: {
          playPositionMilliseconds: 0,
          state: PLAY_STATE.COMPLETED,
        },
      };
      console.log(updatedPlaylist[state.currentSermonIndex]);
      const newState = {
        ...state,
        currentPlayedState: PLAY_STATE.COMPLETED,
        currentSermonSecond: 0,
        playlist: updatedPlaylist,
      };
      return nextSermon(newState);
    }

    default:
      throw new Error(`No case for ${action} in auidoPlayerReducer`);
  }
}
