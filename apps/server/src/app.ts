import e, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app: Express = e();

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.status(200).send('Hello from Lumen!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: "Lumen's API is running and rocking!!!!" });
});

export default app;
