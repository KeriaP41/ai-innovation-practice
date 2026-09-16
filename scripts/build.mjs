import { cp, mkdir, writeFile } from "node:fs/promises";
import { lessons } from "../public/content.js";
await import("./check.mjs");
const root = new URL("../", import.meta.url);
await mkdir(new URL("dist/", root), { recursive: true });
await cp(new URL("public/", root), new URL("dist/", root), { recursive: true });
const doc =
  "# AI创新实践 · 15课时课程内容\n\n每课40分钟，三个双课时短挑战、自主作品与竞赛自选路线。\n\n" +
  lessons
    .map(
      (l) =>
        `## 第${l.id}课 ${l.title}\n\n${l.intro}\n\n**挑战：**${l.question}\n\n**成果：**${l.outcome}\n\n### 学习目标\n\n${l.goals.map((x) => "- " + x).join("\n")}\n\n### 原理速递\n\n${l.concepts.map(([t, p]) => `#### ${t}\n\n${p}`).join("\n\n")}\n\n### 活动流程（40分钟）\n\n${l.steps.map(([m, t, p]) => `- **${t} · ${m}分钟：**${p}`).join("\n")}\n\n### 例子\n\n${l.example.label}\n\n原始：${l.example.before}\n\n改进：${l.example.after}\n\n解释：${l.example.why}\n\n### 任务提示\n\n${l.prompt}\n\n### 活动单\n\n${l.fields.map((f, i) => `${i + 1}. ${f}`).join("\n")}\n\n### 出口问题\n\n${l.quiz.q}\n\n${l.quiz.options.map((x, i) => `${String.fromCharCode(65 + i)}. ${x}`).join("\n")}\n\n答案：${String.fromCharCode(65 + l.quiz.answer)}。${l.quiz.why}\n\n### 教师提示\n\n${l.teacher}\n\n### 竞赛延伸\n\n${l.extension}`,
    )
    .join("\n\n---\n\n");
await writeFile(new URL("课程内容全集.md", root), doc);
console.log("课程静态文件已构建至 dist，完整课程文本已生成。无须下载依赖。");
