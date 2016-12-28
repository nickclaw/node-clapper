import Mic from 'mic';

import textAfterClap from './listeners/text-after-clap';
import listenForClap from './listeners/clap';
import toggleLights from './actions/toggle-lights';

const mic = new Mic({
  rate: '16000',
  channels: '1',
});

const stream = mic.getAudioStream();

textAfterClap(stream)
  .subscribe(words => {
    switch(words[0]) {
      case 'lights': toggleLights();
    }
  })

mic.start();
