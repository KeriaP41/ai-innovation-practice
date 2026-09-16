// 在Node中检查页面模板与事件逻辑；不是浏览器视觉或校园终端测试。
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import * as content from "../public/content.js";
import * as workshop from "../public/workshop.js";

const listeners = { app: {}, window: {} };
const elements = new Map();
const stored = new Map();
const downloads = [];
function element(id = "") {
  const classes = new Set();
  return {
    id,
    innerHTML: "",
    textContent: "",
    dataset: {},
    value: "",
    insertAdjacentHTML(position, html) {
      this.innerHTML += html;
    },
    classList: {
      add: (x) => classes.add(x),
      remove: (x) => classes.delete(x),
      contains: (x) => classes.has(x),
      toggle(x, force) {
        const next = force === undefined ? !classes.has(x) : force;
        next ? classes.add(x) : classes.delete(x);
        return next;
      },
    },
    addEventListener(type, fn) {
      (listeners.app[type] ??= []).push(fn);
    },
    append() {},
    remove() {},
    select() {},
    after() {},
    click() {},
    scrollIntoView() {},
    hasAttribute() {
      return false;
    },
  };
}
function get(id) {
  if (!elements.has(id)) elements.set(id, element(id));
  return elements.get(id);
}
const document = {
  querySelector: get,
  querySelectorAll: () => [],
  getElementById: (id) => get("#" + id),
  createElement: () => element(),
  body: element("body"),
  title: "",
  execCommand: () => true,
};
const location = { hash: "#home" };
const context = vm.createContext({
  ...content,
  ...workshop,
  document,
  location,
  console,
  Blob,
  AbortController,
  Date,
  Math,
  JSON,
  URL: {
    createObjectURL: (b) => {
      downloads.push(b);
      return "blob:test";
    },
    revokeObjectURL() {},
  },
  navigator: { clipboard: { writeText: async () => {} } },
  localStorage: { getItem: (k) => stored.get(k) || null, setItem: (k, v) => stored.set(k, v) },
  setInterval: () => 1,
  setTimeout: () => 1,
  clearTimeout() {},
  window: {
    addEventListener(type, fn) {
      (listeners.window[type] ??= []).push(fn);
    },
    scrollTo() {},
    print() {},
    setTimeout: () => 1,
    clearTimeout() {},
  },
});
const source = (await readFile(new URL("../public/app.js", import.meta.url), "utf8")).replace(
  /import\s+[\s\S]*?\s+from\s+["'][^"']+["'];/g,
  "",
);
vm.runInContext(source, context);
const evaluate = (s) => vm.runInContext(s, context);
async function dispatch(type, target) {
  target.closest = () => target;
  target.hasAttribute = target.hasAttribute || (() => false);
  for (const fn of listeners.app[type] || []) await fn({ target, preventDefault() {} });
}
function navigate(hash) {
  location.hash = hash;
  evaluate("render()");
  return get("#app").innerHTML;
}
for (const hash of [
  "#home",
  "#courses",
  "#lab",
  "#project",
  "#competition",
  "#teacher",
  ...content.lessons.map((l) => "#lesson/" + l.id),
]) {
  const html = navigate(hash);
  assert(html.includes('id="main"'), hash);
  assert(!html.includes("undefined"), hash);
  assert(!html.includes("正在准备"), hash);
  assert.equal(
    (html.match(/<a\s/g) || []).length,
    (html.match(/<\/a>/g) || []).length,
    `${hash}链接闭合`,
  );
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
  assert.equal(new Set(ids).size, ids.length, `${hash}重复ID`);
}
assert(navigate("#lesson/999").includes("没有找到这个课时"));
navigate("#lesson/2");
await dispatch("input", { dataset: { note: "2-0" }, value: "我们将面向新生，测试受众信息。" });
assert.equal(JSON.parse(stored.get("ai-club-v1")).notes["2-0"], "我们将面向新生，测试受众信息。");
await dispatch("click", { dataset: { answer: "1" } });
assert(get("#quiz-feedback").innerHTML.includes("判断正确"));
await dispatch("click", { dataset: { action: "complete" } });
assert.deepEqual(JSON.parse(stored.get("ai-club-v1")).completed, [2]);
await dispatch("click", { dataset: { action: "complete" } });
assert.deepEqual(JSON.parse(stored.get("ai-club-v1")).completed, []);
navigate("#lab");
await dispatch("input", { dataset: { lab: "task" }, value: "为新生写说明" });
assert(get("#assembled-prompt").textContent.includes("为新生写说明"));
await dispatch("click", { dataset: { action: "save-version" } });
assert.equal(JSON.parse(stored.get("ai-club-v1")).snapshots.length, 1);
await dispatch("input", { dataset: { lab: "task" }, value: "改成一个网站任务" });
assert(JSON.parse(stored.get("ai-club-v1")).snapshots[0].prompt.includes("为新生写说明"));
navigate("#project");
await dispatch("input", {
  dataset: { project: "name" },
  value: "</textarea><script>alert(1)</script>",
});
assert(!navigate("#project").includes("<script>alert(1)</script>"));
assert(navigate("#project").includes("&lt;script&gt;"));
await dispatch("click", { dataset: { action: "export" } });
const exported = JSON.parse(await downloads.at(-1).text());
assert.equal(exported.version, 1);
assert.equal(exported.notes["2-0"], "我们将面向新生，测试受众信息。");
const goodBackup = { version: 1, ...workshop.blankState(), group: "新小组", completed: [1, 2, 3] };
await dispatch("change", {
  id: "import-file",
  dataset: {},
  files: [{ size: 100, text: async () => JSON.stringify(goodBackup) }],
  value: "file",
});
assert.equal(JSON.parse(stored.get("ai-club-v1")).group, ""); // 预览不应直接覆盖。
await dispatch("click", { dataset: { action: "confirm-import" } });
assert.equal(JSON.parse(stored.get("ai-club-v1")).group, "新小组");
assert.equal(
  JSON.parse(await downloads.at(-1).text()).notes["2-0"],
  "我们将面向新生，测试受众信息。",
);
await dispatch("change", {
  id: "import-file",
  dataset: {},
  files: [{ size: 10, text: async () => "not-json" }],
  value: "file",
});
assert.equal(JSON.parse(stored.get("ai-club-v1")).group, "新小组");
assert(get("#import-preview").textContent);
navigate("#competition");
await dispatch("click", { dataset: { trackAnswer: "3-0" } });
assert(get("#track-feedback-3").innerHTML.includes("判断正确"));
console.log(
  "通过：21个页面模板、无效课时、活动单保存、完成撤销、答题反馈、提示词快照、备份导出/导入确认、非法文件保护、用户内容转义。未执行浏览器视觉测试。",
);
