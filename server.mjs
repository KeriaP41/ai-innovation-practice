import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("./public/", import.meta.url)));
const port = Number(process.env.CLUB_PORT || 4185);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};
const server = createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405);
    res.end();
    return;
  }
  try {
    const requested = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const filename = path.resolve(root, "." + (requested === "/" ? "/index.html" : requested));
    if (!filename.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const body = await readFile(filename);
    res.writeHead(200, {
      "Content-Type": mime[path.extname(filename)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("没有找到此页面。请返回首页。");
  }
});
server.on("error", (e) => {
  console.error(
    e.code === "EADDRINUSE"
      ? `端口 ${port} 已被占用，请关闭先前的社团网站窗口或设置 CLUB_PORT。`
      : e.message,
  );
  process.exitCode = 1;
});
server.listen(port, "0.0.0.0", () => {
  console.log(`AI创新实践\n本机打开：http://localhost:${port}`);
  for (const item of Object.values(networkInterfaces()).flat())
    if (item && item.family === "IPv4" && !item.internal)
      console.log(`学生打开：http://${item.address}:${port}`);
  console.log("师生设备需在互通的校园网络。保持窗口开启；按 Control + C 关闭。");
});
