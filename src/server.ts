import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from "@angular/ssr/node";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { join } from "node:path";
import { API_CONFIG } from "./app/resources/api.constants";

const browserDistFolder = join(import.meta.dirname, "../browser");

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  "/api",
  createProxyMiddleware({
    target: API_CONFIG.BASE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

app.use(
  express.static(browserDistFolder, {
    maxAge: "1y",
    index: false,
    redirect: false,
  })
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env["PORT"] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
  });
}

export const reqHandler = createNodeRequestHandler(app);
