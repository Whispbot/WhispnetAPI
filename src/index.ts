import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sessionMiddleware } from "./middleware/session.js";

// ES module is not available by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:3001",
  "https://beta.whisp.bot",
  "https://whisp.bot"
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

// i. Create express app
const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);

app.use(cors(corsOptions));
app.use(express.json());
app.use(sessionMiddleware);

// ii. Load routes
const routesDir = path.join(__dirname, "routes");

const printRouteTree = (path: string, methods: string[], depth = 0) => {
  const indent = "    ".repeat(depth);
  console.log(`${indent}└── /${path.split("/").pop()}`);
  methods.forEach((method, i, arr) => {
    const prefix =
      i === arr.length - 1 ? `${indent}    └── ` : `${indent}    ├── `;
    console.log(`${prefix}${method.toUpperCase()}`);
  });
};

const loadRoutes = async (dir: string, basePath = "") => {
  if (basePath === "") console.log(`\nlocalhost:${PORT}`);

  fs.readdirSync(dir).forEach(async (item) => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      const router = express.Router();
      const loadedMethods: string[] = [];

      const routeSegment = item.includes(":") ? item : item;
      const currentPath = basePath
        ? `${basePath}/${routeSegment}`
        : routeSegment;

      const methods: (keyof express.Router)[] = [
        "get",
        "post",
        "put",
        "delete",
        "patch"
      ];
      methods.forEach(async (method) => {
        const methodPath = path.join(fullPath, `${method}.js`);
        if (fs.existsSync(methodPath)) {
          loadedMethods.push(method);
          const module = await import(`file://${methodPath}`);
          const route = module.default;
          const middleware = module.ratelimiter ? [module.ratelimiter] : [];

          (router[method as keyof express.Router] as Function)(
            "/",
            ...middleware,
            (req: Request, res: Response) => route(req, res, req.params)
          );
        }
      });

      printRouteTree(
        currentPath,
        loadedMethods,
        currentPath.split("/").length - 1
      );

      await loadRoutes(fullPath, currentPath);

      app.use(`/${currentPath}`, router);
    }
  });
};

const init = async () => {
  await loadRoutes(routesDir);

  app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}`);
  });
};

init().catch(console.error);
