import app from "./app.js";

if (process.env.NODE_ENV !== "production") {
  const { config } = await import("dotenv");
  config();
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
