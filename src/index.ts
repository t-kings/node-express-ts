/**
 * @description Entry file and port linking
 */
import { server } from './main';
import { initWorkers } from './workers';

const port = process.env.PORT;

// Start workers
initWorkers();

// Listen to port
server.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});
