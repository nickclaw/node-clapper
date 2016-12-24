import { HueApi } from 'node-hue-api';

export default new HueApi(
  process.env.HUE_HOST,
  process.env.HUE_USER
);;
