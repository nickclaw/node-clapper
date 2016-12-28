import { Observable } from 'rxjs';
import _ from 'lodash';
import createDebug from 'debug';

const debug = createDebug('clapper:listener:clap');

export default stream => {
  let lastVal = 0;
  let lastTime = 0;

  return Observable.fromEvent(stream, 'data')
    .map(_.toArray)
    .mergeMap(_.identity)
    .bufferCount(2)
    .map(chunk => {
      let [a, b] = chunk;
      if (b > 128) b -= 256;
      return Math.abs(b * 256 + a);
    })
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
