import { Observable } from 'rxjs';
import createDebug from 'debug';
import _ from 'lodash';

import listenForClap from './clap';
import listenForSilence from './silence';
import listenForText from './text';

const debug = createDebug('clapper:listener:complex');

export default stream => {
  return new Observable(subscriber => {
    const toUnsubscribe = [];

    const clapListener = listenForClap(stream).subscribe(() => {
      debug('heard double clap');
      const words = [];

      const textListener = listenForText(stream).subscribe(word => {
        debug('heard "%s"', word);
        words.push(word);
      });

      const silenceListener = listenForSilence(5000)(stream)
        .first()
        .subscribe(() => {
          debug('got silence, pushing "%s"', words.join(' '));

          // unsubscribe
          unsubscribe();

          // push words
          subscriber.next(words);
        });

      function unsubscribe() {
        textListener.unsubscribe();
        silenceListener.unsubscribe();
        _.pull(toUnsubscribe, unsubscribe);
      }

      toUnsubscribe.push(unsubscribe);
    });

    return () => {
      debug('tearing down');
      toUnsubscribe.forEach(sub => sub.unsubscribe());
      clapListener.unsubscribe();
    }
  });
}
