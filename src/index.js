import Mic from 'mic';

import listenForClap from './listeners/clap';
import listenForSilence from './listeners/silence';
import toggleLights from './actions/toggle-lights';

const mic = new Mic({
  rate: '16000',
  channels: '1',
});

const stream = mic.getAudioStream();

listenForClap(stream)
  .each(toggleLights);


listenForSilence(5000)(stream)
  .each(() => console.log('silence'));


mic.start();
