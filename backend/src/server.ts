import 'dotenv/config';
import { createApp } from './app';
import connectDB from './config/db';
import setUpSocket from './socket/socket-setup.socket';
// import { cronJob } from './utils/cron-job.service';
const PORT = process.env.PORT;

const startServer = async () => {
    const app = createApp();
    await connectDB();
    const server = app.listen(PORT, () => {
        console.log('Server is listening on the http://localhost: ', PORT);
    });
    setUpSocket(server);
    // cronJob();
};

startServer();
