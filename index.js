import Mic from 'mic';
import _ from 'lodash';
import h from 'highland';
import hue, { HueApi, lightState } from 'node-hue-api';

const mic = new Mic({
  rate: '16000',
  channels: '1',
});

const api = new HueApi(
  process.env.HUE_HOST,
  process.env.HUE_USER
);

const stream = mic.getAudioStream();

h(stream)
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
  .each(record);

mic.start();

let lastVal = 0;
let lastTime = 0;

function record(val) {
  if (val - lastVal > 10000) {
    const now = Date.now();
    const diff = now - lastTime;

    if (lastTime && diff > 100 && diff < 600) {
      lastTime = 0;
      toggleLights();
    } else {
      lastTime = now;
    }
  }

  lastVal = val;
}

async function toggleLights() {
  const state = await api.getFullState();
  const lights = state.groups[1].lights
    .map(id => _.extend(
      state.lights[id],
      { id, }
    ));

  const res = await Promise.all(lights.map(light => {
    const action = light.state.on
      ? lightState.create().off()
      : lightState.create().on();

    return api.setLightState(light.id, action)
  }));
}
