import { app } from './app';
import { config } from '../config/env';

const port = config.server.port;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});