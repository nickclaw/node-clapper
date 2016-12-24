import h from 'highland';
import createDebug from 'debug';
import _ from 'lodash';

const debug = createDebug('clapper:listener:silence');

export default len => stream => {

  return h(stream)
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
    .filter(val => val > 2000)
    .debounce(len)
    .map(val => true);
}
