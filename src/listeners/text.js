import { Observable } from 'rxjs';
import _ from 'lodash';
import stt from '../clients/stt';
import createDebug from 'debug';

const debug = createDebug('clapper:listener:text');

export default (stream) => {
  const observer = new Observable(subscriber => {
    debug('subscribing to stt stream');
    const transform = stt.createRecognizeStream({ content_type: 'audio/l16; rate=16000' });
    const out = stream.pipe(transform);

    const dataWrapper = (buffer) => {
      const text = buffer.toString('utf-8');
      debug('heard "%s"', text);
      subscriber.next(text);
    }

    out.addListener('data', dataWrapper);

    return () => {
      debug('tearing down');
      out.removeListener('data', dataWrapper);
      stream.unpipe(transform);
      stream.resume();
      out.stop();
    }
  });

  return observer
    .map(str => str.toLowerCase())
    .map(str => str.trim())
    .map(str => str.split(/\s+/))
    .mergeMap(_.identity);
}
