import {
  Timestamp,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { Sermon, FirebaseSermon, PLAY_STATE } from '../context/types';
import { getDateString } from '../utils/sermonUtils';
/* This converter takes care of converting a Sermon to a FirebaseSermon on upload
 *  and a FirebaseSermon to a Sermon on download.
 */
export const sermonConverter = {
  toFirestore: (sermon: Sermon): FirebaseSermon => {
    return { ...sermon, date: Timestamp.fromMillis(sermon.dateMillis) };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<FirebaseSermon>,
    options: SnapshotOptions
  ): Sermon => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { date, ...data } = snapshot.data(options);
    return {
      ...data,
      dateMillis: snapshot.data(options).date.toMillis(),
      dateString: getDateString(snapshot.data(options).date.toDate()),
    };
  },
};

export const emptySermon: Sermon = {
  key: '',
  title: '',
  subtitle: '',
  dateMillis: 0,
  durationSeconds: 0,
  playedState: {
    playPositionMilliseconds: 0,
    state: PLAY_STATE.NOT_STARTED,
  },
  description: '',
  speaker: [],
  scripture: '',
  topic: [],
  dateString: undefined,
};
