import _ from 'lodash';
import { lightState } from 'node-hue-api';
import createDebug from 'debug';
import hue from '../clients/hue';

const debug = createDebug('clapper:actions:toggle-lights');

export default async () => {
  debug('finding lights...');
  const state = await hue.getFullState();
  const lights = state.groups[1].lights
    .map(id => _.extend(
      state.lights[id],
      { id, }
    ));

  debug('...found %s lights', lights.length);

  const res = await Promise.all(lights.map(light => {
    debug('toggling light %s', light.id);
    const action = light.state.on
      ? lightState.create().off()
      : lightState.create().on();

    return hue.setLightState(light.id, action);
  }))
}
