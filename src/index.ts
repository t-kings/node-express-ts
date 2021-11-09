/**
 * @description Entry file and port linking
 */
import { server } from './main';

const port = process.env.PORT;
server.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});
