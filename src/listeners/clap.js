import h from 'highland';
import createDebug from 'debug';
import _ from 'lodash';

const debug = createDebug('clapper:listener:clap');

export default (stream, onClap) => {
  let lastVal = 0;
  let lastTime = 0;

  h(stream)
    .map(_.toArray)
    .flatten()
    .batch(2)
    .map(chunk => {
      let [a, b] = chunk;
      if (b > 128) b -= 256;
      return Math.abs(b * 256 + a);
    })
    .batch(250)
    .map(vals => Math.max(0, ...vals))
    .each(val => {
      const soundDiff = val - lastVal;
      lastVal = val;

      if (soundDiff > 10000) {
        debug('detected loud noise');
        const now = Date.now();
        const diff = now - lastTime;

        if (lastTime && diff > 100 && diff < 600) {
          debug('detected second clap');
          lastTime = 0;
          onClap();
        } else {
          debug('detected first clap');
          lastTime = now;
        }
      }
    });
}
