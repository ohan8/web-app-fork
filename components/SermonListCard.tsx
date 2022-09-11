/**
 * SermonListCard: A component to display sermons in a list
 */
import { Dispatch, FunctionComponent, memo } from 'react';
// import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import styles from '../styles/SermonListCard.module.css';
// import { Sermon } from '../types/Sermon';
import { formatRemainingTime } from '../utils/audioUtils';
import {
  AUDIO_PLAYER,
  AUDIO_PLAYER_ACTIONS,
  PlayedState,
  PLAY_STATE,
  Sermon,
} from '../context/types';

interface Props {
  sermon: Sermon;
  playing: boolean;
  currentPlayedState: PlayedState;
  dispatch: Dispatch<AUDIO_PLAYER_ACTIONS>;
  // handleSermonClick: (sermon: Sermon) => void;
}

const SermonListCard: FunctionComponent<Props> = ({
  sermon,
  playing,
  currentPlayedState,
  dispatch,
}: Props) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        // handleSermonClick(sermon);
      }}
      className={styles.cardContainer}
    >
      <hr className={styles['horizontal-line']}></hr>
      <div className={styles.cardContent}>
        <div className={styles.divImage}></div>
        <div className={styles.divText}>
          <h1
            className={styles.title}
          >{`${sermon.title}: ${sermon.subtitle}`}</h1>
          <p className={styles.description}>{sermon.description}</p>
          <div className={styles.bottomDiv}>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: AUDIO_PLAYER.SET_CURRENT_SERMON,
                  sermon: sermon,
                });
                dispatch({
                  type: AUDIO_PLAYER.TOGGLE_PLAYING,
                  isPlaying: !playing,
                });
                // TODO(1): Handle CLICK EVENT
              }}
            >
              {playing ? <PauseCircleIcon /> : <PlayCircleIcon />}
            </IconButton>
            <div className={styles.bottomDivText}>
              <span className={styles.date}>{sermon.dateString}</span>
              <span>·</span>
              {currentPlayedState.state === PLAY_STATE.COMPLETED ? (
                <>
                  <span>Played</span>
                  <span style={{ color: 'lightgreen' }}> &#10003;</span>
                </>
              ) : (
                <>
                  <span className={styles.timeLeft}>
                    {formatRemainingTime(
                      Math.floor(sermon.durationSeconds) -
                        currentPlayedState.playPositionMilliseconds
                    ) +
                      (currentPlayedState.state === PLAY_STATE.IN_PROGRESS
                        ? ' left'
                        : '')}
                  </span>
                </>
              )}
            </div>
            {currentPlayedState.state === PLAY_STATE.IN_PROGRESS && (
              <progress
                className={styles.songProgress}
                value={currentPlayedState.playPositionMilliseconds}
                max={Math.floor(sermon.durationSeconds)}
              />
            )}
            <span style={{ width: '100%' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SermonListCard, (prevProps, nextProps) => {
  const memoized =
    prevProps.playing === nextProps.playing &&
    JSON.stringify(prevProps.currentPlayedState) ===
      JSON.stringify(nextProps.currentPlayedState) &&
    JSON.stringify(prevProps.sermon) === JSON.stringify(nextProps.sermon) &&
    prevProps.dispatch === nextProps.dispatch;
  if (!memoized) console.log(`${nextProps.sermon.title} rerendered!`);
  return memoized;
});
