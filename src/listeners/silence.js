import { Observable } from 'rxjs';
import createDebug from 'debug';
import _ from 'lodash';

const debug = createDebug('clapper:listener:silence');

export default len => stream => {

  debug('starting to listen for silence');
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
    .map(vals => Math.max(0, ...vals))
    .filter(val => val > 2000)
    .debounce(val => Observable.timer(len))
    .map(val => true);
}
