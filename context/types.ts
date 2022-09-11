import { Timestamp } from 'firebase/firestore';

export const SET_LOADING = 'SET_LOADING';
export const LOGOUT = 'LOGOUT';

// User Context
export const GET_USER = 'GET_USER';

export interface userCreditionals {
  email: string;
  password: string;
}
// Sermon

export enum PLAY_STATE {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface PlayedState {
  playPositionMilliseconds: number;
  state: PLAY_STATE;
}

export interface Sermon {
  key: string;
  title: string;
  description: string;
  speaker: Array<string>;
  subtitle: string;
  scripture: string;
  dateMillis: number;
  durationSeconds: number;
  playedState: PlayedState;
  topic: Array<string>;
  dateString?: string;
  url?: string;
}

export interface FirebaseSermon
  extends Omit<Sermon, 'dateMillis' | 'dateString'> {
  date: Timestamp;
}

export interface ListenTimeData {
  listenedAt: Date;
  playedState: PlayedState;
}

type NewType = {
  playlist: Sermon[];
  currentSermonIndex: number;
  currentSermonSecond: number;
  currentPlayedState: PLAY_STATE;
  playing: boolean;
  userId: string;
};

// Audio Player Context
export type AudioPlayerState = NewType;
export enum AUDIO_PLAYER {
  SET_PLAYLIST = 'SET_PLAYLIST',
  UPDATE_CURRENT_SECOND = 'UPDATE_CURRENT_SECOND',
  TOGGLE_PLAYING = 'TOGGLE_PLAYING',
  SET_CURRENT_SERMON = 'SET_CURRENT_SERMON_INDEX',
  NEXT_SERMON = 'NEXT_SERMON',
  PREIOUS_SERMON = 'PREVIOUS_SERMON',
  UPDATE_CURRENT_SERMON_URL = 'UPDATE_CURRENT_SERMON_URL',
  SERMON_ENDED = 'SERMON_ENDED',
  SET_USER_ID = 'SET_USER_ID',
}

export type AUDIO_PLAYER_ACTIONS =
  | {
      type: AUDIO_PLAYER.SET_PLAYLIST;
      playlist: Sermon[];
    }
  | { type: AUDIO_PLAYER.SET_USER_ID; userId: string }
  | { type: AUDIO_PLAYER.UPDATE_CURRENT_SECOND; second: number }
  | { type: AUDIO_PLAYER.TOGGLE_PLAYING; isPlaying?: boolean }
  | { type: AUDIO_PLAYER.SET_CURRENT_SERMON; sermon: Sermon }
  | { type: AUDIO_PLAYER.NEXT_SERMON }
  | { type: AUDIO_PLAYER.PREIOUS_SERMON }
  | {
      type: AUDIO_PLAYER.UPDATE_CURRENT_SERMON_URL;
      url: string;
    }
  | { type: AUDIO_PLAYER.SERMON_ENDED };
