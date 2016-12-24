import h from 'highland';
import _ from 'lodash';
import stt from '../clients/stt';

export default (stream) => {
  const transform = stt.createRecognizeStream({ content_type: 'audio/l16; rate=16000' });
  const out = stream.pipe(transform);

  return h(out)
    .filter(_.identity)
    .map(buf => buf.toString('utf-8'))
    .map(str => str.toLowerCase())
    .map(str => str.trim())
    .map(str => str.split(/\s+/))
    .sequence();
}
