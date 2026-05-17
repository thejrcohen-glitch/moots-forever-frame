import express, { type Express } from "express";
import rateLimit from "express-rate-limit";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer, type UserConfig } from "vite";
import viteConfig from "../../vite.config";

const createHtmlLimiter = (max: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });

const viteHtmlLimiter = createHtmlLimiter(100);
const staticHtmlFallbackLimiter = createHtmlLimiter(200);

export async function setupVite(app: Express, server: Server) {
  const typedViteConfig = viteConfig as UserConfig;
  const serverOptions = {
    ...(typedViteConfig.server ?? {}),
    middlewareMode: true,
    hmr: { server },
  };

  const vite = await createViteServer({
    ...typedViteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", viteHtmlLimiter, async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", staticHtmlFallbackLimiter, (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
