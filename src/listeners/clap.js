import { Observable } from 'rxjs';
import _ from 'lodash';
import createDebug from 'debug';
import listenForSound from './sound';

const debug = createDebug('clapper:listener:clap');

export default stream => {
  let lastVal = 0;
  let lastTime = 0;

  return listenForSound(stream)
    .bufferCount(250)
    .map(vals => Math.max(...vals))
    .filter(val => {
      const soundDiff = val - lastVal;
      lastVal = val;

      if (soundDiff < 10000) {
        return false;
      }

      debug('detected loud noise');
      const now = Date.now();
      const diff = now - lastTime;
      lastTime = now;

      if (diff > 100 && diff < 600) {
        debug('detected second clap');
        return true;
      }

      return false;
    })
    .map(v => true);
}
``
