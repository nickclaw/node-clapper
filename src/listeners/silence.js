import h from 'highland';
import createDebug from 'debug';
import _ from 'lodash';

const debug = createDebug('clapper:listener:silence');

export default len => stream => {
  const out = h();
  let timeout = 0;

  h(stream)
    .map(_.toArray)
    .flatten()
    .batch(2)
    .map(chunk => {
      let [a, b] = chunk;
      if (b > 128) b -= 256;
      return Math.abs(b * 256 + a);
    })
    .each(val => {
      if (timeout && val > 2000) {
        debug('too loud, clearing');
        clearTimeout(timeout);
        timeout = null;
        return;
      }

      if (!timeout && val < 2000) {
        debug('starting timer');
        timeout = setTimeout(() => {
          debug('%s ms of silence', len);
          out.write(true);
          timeout = null;
        }, len);
        return;
      }
    });

    return out;
}
