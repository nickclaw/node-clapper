import { Observable } from 'rxjs';
import _ from 'lodash';

export default stream => {
  return Observable.fromEvent(stream, 'data')
    .map(_.toArray)
    .mergeMap(_.identity)
    .bufferCount(2)
    .map(chunk => {
      let [a, b] = chunk;
      if (b > 128) b -= 256;
      return Math.abs(b * 256 + a);
    });
}
``
