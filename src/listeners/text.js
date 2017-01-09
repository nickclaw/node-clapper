import { Observable } from 'rxjs';
import _ from 'lodash';
import stt from '../clients/stt';
import createDebug from 'debug';

const debug = createDebug('clapper:listener:text');

const transformOptions = {
  content_type: 'audio/l16; rate=16000',
};

export default (stream) => {
  const observer = new Observable(subscriber => {
    debug('connecting to stream');
    const transform = stt.createRecognizeStream(transformOptions);
    const out = stream.pipe(transform);
    transform.once('connect', () => debug('socket connected'));
    transform.once('listening', () => debug('socket listening'));
    transform.once('stopping', () => debug('socket stopping'));

    function dataWrapper(buffer) {
      const text = buffer.toString('utf-8')
        .toLowerCase()
        .trim();

      debug('heard "%s"', text);
      if (text) subscriber.next(text);
    }

    out.addListener('data', dataWrapper);

    return () => {
      debug('tearing down');
      out.removeListener('data', dataWrapper);
      stream.unpipe(transform);
      stream.resume();
      transform.stop();
    }
  });

  return observer
    .map(str => str.split(/\s+/))
    .mergeMap(_.identity);
}
