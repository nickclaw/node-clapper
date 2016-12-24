import Mic from 'mic';

import listenForClap from './listeners/clap';
import toggleLights from './actions/toggle-lights';

const mic = new Mic({
  rate: '16000',
  channels: '1',
});

const stream = mic.getAudioStream();

listenForClap(stream)
  .each(toggleLights);

mic.start();
