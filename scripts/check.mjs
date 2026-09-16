import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { lessons, roadmap } from "../public/content.js";
import {
  blankState,
  sanitizeState,
  assemblePrompt,
  templates,
  competition,
} from "../public/workshop.js";

assert.equal(lessons.length, 15);
assert.deepEqual(
  lessons.map((l) => l.id),
  Array.from({ length: 15 }, (_, i) => i + 1),
);
for (const l of lessons) {
  assert.equal(l.short, roadmap[l.id - 1]);
  assert.equal(
    l.steps.reduce((s, [m]) => s + m, 0),
    40,
    `第${l.id}课时间`,
  );
  assert.equal(l.concepts.length, 3);
  assert.equal(l.fields.length, 4);
  assert.equal(l.quiz.options.length, 3);
  assert(l.quiz.answer >= 0 && l.quiz.answer < 3);
  assert(l.title?.length > 0, `第${l.id}课缺少title`);
  for (const k of ["intro", "outcome", "question", "teacher", "extension", "prompt"])
    assert(l[k]?.length > 8, `第${l.id}课缺少${k}`);
  for (const [title, body] of l.concepts)
    assert(title.length && body.length > 50, `第${l.id}课原理内容`);
  for (const [minutes, title, body] of l.steps)
    assert(minutes > 0 && title.length && body.length > 20);
  assert(!/TODO|TBD|稍后补充/.test(JSON.stringify(l)));
}
for (const t of Object.values(templates)) assert(assemblePrompt(t).includes("验收标准"));
assert.equal(
  assemblePrompt({ task: "  为新生写说明  ", context: "  " }),
  "任务与观众：\n为新生写说明",
);
const malformed = JSON.parse(
  '{"completed":[1,1,16,-2,"3"],"notes":{"1-0":"</textarea><script>alert(1)</script>","x":9,"__proto__":"x"},"quiz":{"2":9,"3":0},"project":null,"snapshots":[{}]}',
);
const cleaned = sanitizeState(malformed);
assert.deepEqual(cleaned.completed, [1]);
assert.equal(cleaned.notes["1-0"], "</textarea><script>alert(1)</script>");
assert.equal(Object.hasOwn(cleaned.notes, "__proto__"), false);
assert.deepEqual(cleaned.quiz, { 3: 0 });
assert.deepEqual(cleaned.project, {});
assert.equal(cleaned.snapshots.length, 0);
assert.deepEqual(sanitizeState(blankState()), blankState());
assert.throws(() => sanitizeState(null));
assert.equal(competition.length, 3);
const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
assert(index.includes("<title>AI创新实践</title>"));
for (const name of [
  "app.js",
  "style.css",
  "content.js",
  "challenges.js",
  "projects.js",
  "workshop.js",
  "favicon.svg",
])
  assert((await readFile(new URL(`../public/${name}`, import.meta.url))).length > 0);
console.log(
  "通过：15课完整内容、600分钟安排、45段原理、60项活动记录、18道课堂/竞赛题、提示词组装与备份清洗。",
);
