import app from './app';

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});