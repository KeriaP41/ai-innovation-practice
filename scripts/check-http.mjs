import assert from "node:assert/strict";
const origin = "http://localhost:4185";
for (const [file, type] of [
  ["/", "text/html"],
  ["/app.js", "text/javascript"],
  ["/content.js", "text/javascript"],
  ["/challenges.js", "text/javascript"],
  ["/projects.js", "text/javascript"],
  ["/workshop.js", "text/javascript"],
  ["/style.css", "text/css"],
  ["/favicon.svg", "image/svg+xml"],
  ["/活动材料卡.html", "text/html"],
]) {
  const r = await fetch(origin + file);
  assert.equal(r.status, 200, file);
  assert(r.headers.get("content-type").includes(type));
  assert((await r.text()).length > 30);
}
for (const file of ["/not-found", "/server.mjs", "/package.json", "/.env"])
  assert.equal((await fetch(origin + file)).status, 404, file);
assert.equal((await fetch(origin + '/..%2fserver.mjs')).status, 403);
assert.equal((await fetch(origin, { method: "POST" })).status, 405);
assert.equal((await fetch(origin, { method: "HEAD" })).status, 200);
console.log("通过：9个课程静态资源、中文材料页面、缺失资源、服务端文件不可访问、方法限制。");
