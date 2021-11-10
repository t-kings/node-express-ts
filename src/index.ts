/**
 * @description Entry file and port linking
 */
import { server } from './main';
import { initWorkers } from './workers';
import cluster from 'cluster';
import os from 'os';
const port = process.env.PORT;

const startServer = () => {
  process.on('unhandledRejection', (error) => {
    /**
     * would normally log this unhandled rejection
     * no log in this project
     * * using console
     */
    console.error('something went wrong', error);
  });

  try {
    // Use cluster for performance
    if (cluster.isPrimary) {
      // Start workers
      initWorkers();
      for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
      }
    } else {
      // If we're not on the master thread, start the express server
      // Listen to port
      server.listen(port, () => {
        console.info(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    console.error('something went wrong');
  }
};

// Start the server
startServer();
