import express, { Express, Request, Response } from "express";

const host = process.env.LOCAL_PATH;
const port = Number(process.env.LOCAL_PORT) || 3000; // Default to port 3000 if LOCAL_PORT is not set

export function initServer(): Express {
  const app: Express = express();

  // Enable CORS for all routes
  app.options("/*", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.sendStatus(200);
  });

  // JSON middleware
  const jsonMiddleware = express.json();
  app.use(jsonMiddleware);

  // Start the server
  app.listen(port, host, () => {
    console.log(`Server running on http://${host || "localhost"}:${port}`);
  });

  return app;
}
