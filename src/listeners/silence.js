import { Observable } from 'rxjs';
import createDebug from 'debug';
import _ from 'lodash';
import listenForSound from './sound';

const debug = createDebug('clapper:listener:silence');

export default len => stream => {

  debug('starting to listen for silence');
  return listenForSound(stream)
    .bufferCount(250)
    .map(vals => Math.max(0, ...vals))
    .filter(val => val > 2000)
    .debounce(val => Observable.timer(len))
    .map(val => true);
}
