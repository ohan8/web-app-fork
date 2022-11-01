import { logger, https } from 'firebase-functions';
import axios, { AxiosResponse } from 'axios';
import { authenticateSubsplash, createAxiosConfig } from './subsplashUtils';

export interface UPLOAD_TO_SUBSPLASH_INCOMING_DATA {
  title: string;
  subtitle: string;
  speakers: string[];
  autoPublish: boolean;
  audioTitle: string;
  audioUrl: string;
  topics?: string[];
  description?: string;
}

const createAudioRef = async (title: string, bearerToken: string): Promise<string> => {
  const data = { app_key: '9XTSHD', title: title };
  const axiosConfig = createAxiosConfig(' https://core.subsplash.com/files/v1/audios', bearerToken, 'POST', data);
  return (await axios(axiosConfig)).data.id;
};

const transcodeAudio = async (audioSrc: string, audioId: string, bearerToken: string): Promise<AxiosResponse> => {
  const data = {
    app_key: '9XTSHD',
    file_name: audioSrc,
    _embedded: {
      audio: {
        id: audioId,
      },
      source: {
        id: '1c2eb938-c8a9-4be3-9ad9-6cded7e63b59',
      },
    },
  };
  const axiosConfig = createAxiosConfig('https://core.subsplash.com/transcoder/v1/jobs', bearerToken, 'POST', data);
  return await axios(axiosConfig);
};

const uploadToSubsplash = https.onCall(async (data: UPLOAD_TO_SUBSPLASH_INCOMING_DATA, context): Promise<unknown> => {
  if (context.auth?.token.role !== 'admin') {
    return { status: 'Not Authorized' };
  }
  if (process.env.EMAIL == undefined || process.env.PASSWORD == undefined) {
    return 'Email or Password are not set in .env file';
  }
  logger.log('data', data);
  try {
    const bearerToken = await authenticateSubsplash();
    // create media item with title
    let tags: string[] = [];
    if (Array.isArray(data.speakers)) {
      if (data.speakers.length > 3) {
        throw new Error('Too many speakers: Max 3 speakers allowed');
      }
      tags = tags.concat(data.speakers.map((speaker: string) => `speaker:${speaker}`));
    }
    if (Array.isArray(data.topics)) {
      if (data.topics.length > 10) {
        throw new Error('Too many topics: Max 10 topics allowed');
      }
      tags = tags.concat(data.topics.map((topic: string) => `topic:${topic}`));
    }
    // Post the audio and retrieve the audio id
    const audioId = await createAudioRef(data.audioTitle, bearerToken);
    logger.info(`Audio ID: ${audioId}`);
    // transcode the audio from a public url tagged to the audio id
    const transcodeResponse = await transcodeAudio(data.audioUrl, audioId, bearerToken);
    logger.info(`Transcode Statues: ${transcodeResponse.data.status}`);
    // uploadToSubsplash with the audio id

    const requestData = JSON.stringify({
      app_key: '9XTSHD',
      scriptures: [],
      tags: tags,
      title: data.title,
      subtitle: data.subtitle,
      summary: data.description,
      date: new Date(),
      auto_publish: data.autoPublish ?? false,
      _embedded: {
        images: [
          { id: '30b301b5-16f2-4982-b248-6a96a2093a1f', type: 'square' },
          { id: '3597957d-26e5-4c95-a21f-30d61d0274c5', type: 'wide' },
          { id: '090bf8b2-3bb7-4826-b4bc-b278b2927228', type: 'banner' },
        ],
        audio: { id: audioId },
      },
    });
    const config = createAxiosConfig(
      'https://core.subsplash.com/media/v1/media-items',
      bearerToken,
      'POST',
      requestData
    );
    return (await axios(config)).data;
  } catch (error) {
    logger.error(error);
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    return message;
  }
});

export default uploadToSubsplash;