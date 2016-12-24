import SpeechToText from 'watson-developer-cloud/speech-to-text/v1';

export default new SpeechToText({
  username: process.env.TTS_USER,
  password: process.env.TTS_PASS,
});
