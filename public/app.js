import { lessons, roadmap, phases } from "./content.js";
import {
  promptFields,
  templates,
  assemblePrompt,
  projectFields,
  stageNames,
  formatNames,
  competition,
  blankState,
  sanitizeState,
} from "./workshop.js";
const app = document.querySelector("#app");
const icons = {
  home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  book: "M4 3h7v18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-9",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
  folder: "M3 5h6l2 3h10v12H3Z",
  flag: "M5 22V3h14l-3 5 3 5H5",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  check: "m5 12 4 4L19 6",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  clock: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  screen: "M3 3h18v14H3Zm9 14v5m-5 0h10",
};
const icon = (n) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[n] || icons.spark}"/></svg>`;
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
let state = blankState();
try {
  const stored = JSON.parse(localStorage.getItem("ai-club-v1") || "null");
  if (stored) state = sanitizeState(stored);
} catch {}
let activeFilter = -1;
function save() {
  try {
    localStorage.setItem("ai-club-v1", JSON.stringify(state));
    document
      .querySelectorAll(".save-info")
      .forEach((x) => (x.textContent = "已保存到当前浏览器 · 建议下课前导出备份"));
  } catch {
    toast("浏览器无法保存，请导出备份，避免丢失。");
  }
}
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
}
function route() {
  return (location.hash.slice(1) || "home").split("/");
}
function shell(body, active = "home", label = "社团工作台") {
  app.innerHTML = `<div class="shell"><aside class="side"><a href="#home" class="brand"><img src="./favicon.svg" alt=""> <div>AI创新实践<small>CREATIVE STUDIO</small></div></a><div><div class="nav-label">我们的工作室</div><nav class="nav" aria-label="主导航">${[
    ["home", "home", "社团工作台"],
    ["courses", "book", "15课时路线"],
    ["lab", "spark", "提示词实验室"],
    ["project", "folder", "我的作品档案"],
    ["competition", "flag", "竞赛加油站"],
    ["teacher", "settings", "教师备课台"],
  ]
    .map(
      ([id, i, t]) =>
        `<a href="#${id}" class="${active === id ? "active" : ""}" ${active === id ? 'aria-current="page"' : ""}>${icon(i)}${t}</a>`,
    )
    .join(
      "",
    )}</nav></div><div class="side-footer"><p>从一个想法，到一件作品。</p><div class="side-meter"><span style="width:${(state.completed.length / 15) * 100}%"></span></div><p>${state.completed.length} / 15 课时已完成</p><span>不需要平台账号<br>课程与记录可离线使用</span></div></aside><div class="workspace"><header class="topbar"><span class="breadcrumb">AI创新实践 <span aria-hidden="true"> / </span> ${esc(label)}</span><div class="top-actions"><span class="badge"><i class="status-dot"></i>社团 · 15 × 40分钟</span><button class="btn small" data-action="export">${icon("download")}导出记录</button></div></header><main id="main" tabindex="-1">${body}</main></div></div>`;
}
function cards(limit = 15) {
  return roadmap
    .slice(0, limit)
    .map((t, i) => {
      const l = lessons.find((x) => x.id === i + 1);
      const ph = i === 0 ? 0 : i < 7 ? 1 : i < 14 ? 2 : 3;
      return `<a class="course-card phase-${ph}" href="#lesson/${i + 1}" data-phase="${ph}"><div class="card-top"><span>LESSON ${String(i + 1).padStart(2, "0")}</span><span>${state.completed.includes(i + 1) ? "✓ 已完成" : "40分钟"}</span></div><h3>${t}</h3><p>${esc(l?.question || ["社团共建", "两课时，完成一次尝试", "围绕你的作品持续迭代", "展示作品与过程"][ph])}</p><footer><span>${phases[ph]}</span>${icon("arrow")}</footer></a>`;
    })
    .join("");
}
function home() {
  const current = lessons.find((l) => !state.completed.includes(l.id)) || lessons[0];
  shell(
    `<div class="title-row"><div><div class="eyebrow">IDEAS BECOME REAL</div><h1>欢迎来到我们的创作工作室</h1><p class="subtle">选一个问题，和伙伴一起，创造属于你的答案。</p></div><a class="btn" href="#project">我的学期作品 ${icon("arrow")}</a></div><section class="hero"><div class="hero-copy"><div class="eyebrow">本学期的共同任务</div><h2>把你的想法，<br>做成<em>一件作品。</em></h2><p>海报 / 视频 / 网站 / 智能体 / 你想到的其他形式</p><a class="btn lime" href="#lesson/${current.id}">进入第 ${String(current.id).padStart(2, "0")} 课 ${icon("arrow")}</a></div><div class="path-map" aria-label="学期路线：启航、挑战、创作、展览">${[
      ["启航", [1]],
      ["挑战", [2, 3, 4, 5, 6, 7]],
      ["创作", [8, 9, 10, 11, 12, 13, 14]],
      ["展览", [15]],
    ]
      .map(
        ([label, ns]) =>
          `<div class="map-row"><span>${label}</span>${ns.map((n, j) => `${j ? '<i class="node-line"></i>' : ""}<a href="#lesson/${n}" aria-label="第${n}课" class="node ${n === current.id ? "current" : ""} ${state.completed.includes(n) ? "done" : ""}">${String(n).padStart(2, "0")}</a>`).join("")}</div>`,
      )
      .join(
        "",
      )}</div></section><div class="section-heading"><h2>下一站，开始动手</h2><small>由学生主导 · 原理按需学习</small></div><section class="current-card"><span class="lesson-number">${String(current.id).padStart(2, "0")}</span><div><span class="pill">${phases[current.phase]}</span><h3>${current.short}</h3><p>${current.outcome}</p></div><a class="btn primary" href="#lesson/${current.id}">进入课堂 ${icon("arrow")}</a></section><div class="section-heading"><h2>15课时，走出自己的路线</h2><a class="subtle" href="#courses">查看完整路线 →</a></div><div class="course-grid">${cards(3)}</div><p class="hint">前三个短挑战帮助你发现兴趣；第8课起选择自主作品或竞赛方向。老师是顾问，你和伙伴负责创作决定。</p>`,
  );
}
function courses() {
  shell(
    `<div class="title-row"><div><div class="eyebrow">THE SEMESTER JOURNEY</div><h1>15课时路线</h1><p class="subtle">1次启航 · 3个双课时短挑战 · 7次项目工作室 · 1次作品展</p></div></div><div class="filter-row" aria-label="课时阶段筛选"><button class="filter ${activeFilter === -1 ? "active" : ""}" data-filter="-1">全部课时</button>${phases.map((p, i) => `<button class="filter ${activeFilter === i ? "active" : ""}" data-filter="${i}">${p}</button>`).join("")}</div><div class="course-grid">${cards()}</div>`,
    "courses",
    "课程路线",
  );
  document
    .querySelectorAll("[data-phase]")
    .forEach((x) => (x.hidden = activeFilter !== -1 && Number(x.dataset.phase) !== activeFilter));
}
function lesson(id) {
  const l = lessons.find((x) => x.id === id);
  if (!l) {
    shell(
      '<div class="panel"><h1>没有找到这个课时</h1><p>课程编号为1—15。</p><a class="btn" href="#courses">返回课程路线</a></div>',
      "courses",
      "课程",
    );
    return;
  }
  shell(
    `<div class="actions" style="margin:0 0 20px"><a class="btn small" href="#courses">← 课程路线</a><button class="btn small" data-action="present">${icon("screen")}投屏大字</button><button class="btn small" data-action="print">打印活动单</button></div><section class="lesson-banner"><span class="pill">LESSON ${String(id).padStart(2, "0")} · ${phases[l.phase]}</span><h1>${l.title}</h1><p>${l.intro}</p><div class="lesson-meta"><span>◷ 40分钟</span><span>教师微讲解 + 学生互动创作</span><span>${l.type}</span></div></section><div class="lesson-layout"><div><section class="panel" id="mission"><div class="eyebrow">TODAY'S CHALLENGE</div><h2>${l.question}</h2><p>${l.outcome}</p><div class="checklist">${l.goals.map((g, i) => `<label><input type="checkbox" data-check="${id}-${i}" ${state.checks[`${id}-${i}`] ? "checked" : ""}>${g}</label>`).join("")}</div></section><section class="panel" id="concepts"><h2>${icon("spark")}原理速递</h2>${l.concepts.map(([t, p]) => `<div class="concept"><h3>${t}</h3><p>${p}</p></div>`).join("")}</section><section class="panel" id="activity"><h2>${icon("clock")}今天怎么做</h2><div class="timeline">${l.steps.map(([m, t, p]) => `<div class="step"><span class="time">${m}′</span><div><h3>${t}</h3><p>${p}</p></div></div>`).join("")}</div></section><section class="panel" id="example"><h2>看一个例子，再试一次</h2><p>${l.example.label}</p><div class="example-pair"><div class="example-box"><span>最初的版本</span>${esc(l.example.before)}</div><div class="example-box good"><span>改进的方向</span>${esc(l.example.after)}</div></div><p>${l.example.why}</p><div class="prompt" id="lesson-prompt">${esc(l.prompt)}</div><div class="actions"><button class="btn small" data-action="copy-lesson">复制任务提示</button><a class="btn small" href="#lab">打开提示词实验室 →</a></div></section><section class="panel" id="worksheet"><h2>${icon("folder")}本课活动单</h2><p class="subtle">先独立想，再和伙伴讨论。这里的内容仅保存在当前浏览器。</p>${l.fields.map((f, i) => `<label class="field"><span>${i + 1}. ${f}</span><textarea data-note="${id}-${i}" placeholder="记录你的思考、决定和下一步……">${esc(state.notes[`${id}-${i}`] || "")}</textarea></label>`).join("")}<p class="save-info">输入后自动保存到当前浏览器 · 换电脑前请导出备份</p><div class="actions"><button class="btn" data-action="export-lesson">${icon("download")}导出本课活动单</button></div></section><section class="panel" id="exit"><h2>离开前，想一想</h2><p>${l.quiz.q}</p><div class="quiz-options">${l.quiz.options.map((o, i) => `<button class="quiz-option ${state.quiz[id] === i ? "selected" : ""}" data-answer="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}</div><div id="quiz-feedback" aria-live="polite">${quizFeedback(l)}</div><details><summary>教师提示与竞赛延伸</summary><p>${l.teacher}</p><p>${l.extension}</p></details></section></div><aside class="rail"><div class="rail-box"><h3>本课导航</h3>${[
      ["mission", "今日挑战"],
      ["concepts", "原理速递"],
      ["activity", "互动流程"],
      ["example", "提示词与例子"],
      ["worksheet", "本课活动单"],
      ["exit", "出口问题"],
    ]
      .map(([a, t]) => `<a href="#lesson/${id}" data-scroll="${a}">${t}</a>`)
      .join(
        "",
      )}</div><div class="rail-box"><h3>怎样算完成？</h3><ul>${l.rubric.map((x) => `<li>${x}</li>`).join("")}</ul><div class="actions"><button class="btn primary" data-action="complete">${state.completed.includes(id) ? "✓ 已完成 · 撤销" : "标记本课完成"}</button></div></div></aside></div><div class="lesson-bottom">${id > 1 ? `<a class="btn" href="#lesson/${id - 1}">← 上一课</a>` : "<span></span>"}${id < 15 ? `<a class="btn primary" href="#lesson/${id + 1}">下一课 ${icon("arrow")}</a>` : '<a class="btn primary" href="#project">整理作品档案 →</a>'}</div>`,
    "courses",
    `第${id}课 · ${l.short}`,
  );
}
function quizFeedback(l) {
  const a = state.quiz[l.id];
  return a === undefined
    ? ""
    : `<div class="quiz-result ${a !== l.quiz.answer ? "wrong" : ""}">${a === l.quiz.answer ? "判断正确。" : "再想一想。"}${l.quiz.why}</div>`;
}
function exportFile(name, data, type = "application/json") {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("已复制，可以带到教师指定的平台使用。");
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.append(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    toast(ok ? "已复制" : "请选中提示词后手动复制。");
  }
}
function field(label, key, value, scope = "lab", placeholder = "记录你的想法……") {
  return `<label class="field"><span>${esc(label)}</span><textarea data-${scope}="${key}" placeholder="${esc(placeholder)}">${esc(value || "")}</textarea></label>`;
}
function lab() {
  shell(
    `<div class="title-row"><div><div class="eyebrow">PROMPT LAB</div><h1>提示词实验室</h1><p class="subtle">先明确任务，再比较证据。让每次修改都有理由。</p></div><button class="btn" data-action="save-version">保存当前版本</button></div><div class="hint">这里组装提示词、记录A/B实验，不会自动调用AI或产生费用。实际生成请使用教师提供的入口，或由教师集中操作；将真实结果粘贴回来比较。</div><div class="two-col"><section class="panel"><h2>设计一次清楚的请求</h2><label class="field"><span>从一个示例开始</span><select id="template-select"><option value="">选择示例，仅预览、不覆盖记录</option>${Object.entries(
      templates,
    )
      .map(([k, v]) => `<option value="${k}">${v.name}</option>`)
      .join(
        "",
      )}</select></label><div id="template-preview"></div>${promptFields.map(([k, t, h]) => field(t, k, state.lab[k], "lab", h)).join("")}<p class="save-info">输入自动保存在当前浏览器</p></section><div class="sticky"><section class="panel"><h2>我的完整提示词</h2><div id="assembled-prompt" class="prompt">${esc(assemblePrompt(state.lab) || "填写左侧内容，你的任务说明会在这里组合。")}</div><div class="actions"><button class="btn primary" data-action="copy-prompt">复制提示词</button><button class="btn" data-action="save-version">保存版本</button></div><p class="tool-note" style="margin-top:15px">角色不是必填项。资料、任务、限制和可检查的标准通常更关键。</p></section><section class="panel"><h2>生成前，做四个检查</h2><div class="checklist">${["要求是否相互冲突？", "事实材料是否可靠？", "有没有不必要的隐私信息？", "怎样判断结果成功或失败？"].map((t, i) => `<label><input type="checkbox" data-check="90-${i}" ${state.checks[`90-${i}`] ? "checked" : ""}>${t}</label>`).join("")}</div></section><section class="panel"><h2>版本记录</h2><div id="version-list">${versionList()}</div></section></div></div><section class="panel"><div class="eyebrow">CHANGE ONE THING</div><h2>A/B对照实验台</h2><p>同一任务与模型，每次只改变一个因素。把模型、日期和参数写下来；有条件时每个版本观察两次。</p><div class="two-col">${field("A版：完整输入与真实输出", "abA", state.lab.abA)}${field("B版：完整输入与真实输出", "abB", state.lab.abB)}</div>${field("共同设置与唯一变化因素", "variable", state.lab.variable, "lab", "模型、日期、设置相同；B版仅增加……")}${field("先写评分标准，再记录得分与证据", "evidence", state.lab.evidence, "lab", "准确性0—2、要求覆盖0—2、适合受众0—2；圈出输出证据。")}${field("实验结论、局限与下一次改动", "conclusion", state.lab.conclusion, "lab", "在本次任务中……；还不能证明……；下一次准备……")}<div class="actions"><button class="btn" data-action="export-lab">导出实验记录</button></div></section><section class="panel"><h2>创意抽签器</h2><p>第4课可以抽取一组画面限制，先画草图再生成。抽签只提供创意起点，不是AI生成。</p><div id="brief-result">${briefMarkup()}</div><button class="btn" data-action="draw-brief">抽取一组创意卡</button></section>`,
    "lab",
    "提示词实验室",
  );
}
function briefMarkup() {
  return state.brief
    ? `<div class="step-chips" style="margin:18px 0">${Object.entries(state.brief)
        .map(
          ([k, v]) =>
            `<span class="step-chip">${{ theme: "主题", shot: "构图", light: "光线" }[k]}：${esc(v)}</span>`,
        )
        .join("")}</div>`
    : '<p class="subtle">还没有抽取。可以直接使用自己的想法。</p>';
}
function versionList() {
  return state.snapshots.length
    ? state.snapshots
        .slice()
        .reverse()
        .map(
          (v, i) =>
            `<details><summary>${esc(v.label)} · ${esc(v.date)}</summary><div class="prompt">${esc(v.prompt)}</div><button class="btn small" data-copy-version="${state.snapshots.length - 1 - i}">复制此版本</button></details>`,
        )
        .join("")
    : '<p class="subtle">还没有保存版本。完成一个有意义的改动后，保存下来作比较。</p>';
}
function project() {
  const answered = projectFields.filter(([k]) => state.project[k]?.trim()).length;
  shell(
    `<div class="title-row"><div><div class="eyebrow">MY CREATIVE PROJECT</div><h1>我的作品档案</h1><p class="subtle">你的决定、尝试与修改，和成品一样值得留下。</p></div><button class="btn primary" data-action="export-project">导出作品档案 ${icon("download")}</button></div><div class="panel"><div class="two-col"><label class="field"><span>小组 / 个人代号</span><input type="text" data-group value="${esc(state.group)}" maxlength="100" placeholder="如：绿芽组；无需真实姓名"></label><label class="field"><span>作品形式</span><select data-project="format">${formatNames.map((x) => `<option ${state.project.format === x ? "selected" : ""}>${x}</option>`).join("")}</select></label></div><label class="field"><span>当前阶段</span><select data-project="stage">${stageNames.map((x) => `<option ${state.project.stage === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><p class="tool-note">这是当前浏览器的一份本地档案，填写代号不会切换账号或隔离其他人的记录。共用电脑请分别导出备份；下次可以导入自己的文件。</p></div><div class="two-col"><div>${projectFields.map(([k, t], i) => `<section class="panel">${field(`${String(i + 1).padStart(2, "0")} · ${t}`, k, state.project[k], "project")}</section>`).join("")}</div><aside class="sticky"><section class="panel"><h2>学期交付清单</h2><p class="subtle">${answered} / ${projectFields.length} 项已有记录</p><div class="checklist">${["一件能打开或展示的作品", "关键提示词与版本记录", "一次失败和改进证据", "AI使用与素材来源说明", "每位成员的具体贡献", "90秒作品介绍"].map((x, i) => `<label><input type="checkbox" data-check="91-${i}" ${state.checks[`91-${i}`] ? "checked" : ""}>${x}</label>`).join("")}</div><div class="actions"><button class="btn primary" data-action="export-project">导出作品档案</button></div></section><section class="panel"><h2>备份与换电脑</h2><p>导出备份后保管好JSON文件，在另一台电脑导入。图片、视频和代码文件需要另外保存，档案中的路径只是文字记录。</p><div class="actions"><button class="btn" data-action="export">导出全部记录</button><label class="btn" for="import-file">选择备份文件</label><input id="import-file" type="file" accept="application/json,.json" hidden></div><div id="import-preview" aria-live="polite"></div><p class="save-info">仅保存在当前浏览器，未上传教师端或云端</p></section></aside></div>`,
    "project",
    "作品档案",
  );
}
function competitionPage() {
  shell(
    `<div class="title-row"><div><div class="eyebrow">CHOOSE YOUR NEXT CHALLENGE</div><h1>竞赛加油站</h1><p class="subtle">共同活动之后，把工作室时间用在你选择的方向。</p></div></div><p class="hint">以下依据文件夹中首届大赛初赛指南，属于2026年历史规则参考，不代表下一届安排。学习手册是辅助材料；课程练习为自主编写。正式报名、赛程、平台和作品要求须核对当届通知。</p><div class="step-chips" style="margin-bottom:22px">${competition.map((t) => `<a class="step-chip" href="#competition" data-scroll="track-${t.id}">${t.tag} →</a>`).join("")}</div>${competition.map((t) => `<section class="panel" id="track-${t.id}"><div class="eyebrow">${t.tag}</div><h2>${t.title}</h2><p>${t.intro}</p><p class="hint">${t.facts}</p><div class="two-col">${t.learn.map(([h, p]) => `<div class="concept"><h3>${h}</h3><p>${p}</p></div>`).join("")}</div><p><strong>工作室成果：</strong>${t.deliver}</p><div class="question-card"><h3>给自己一个小挑战</h3><p>${t.task}</p></div>${field("思考、错因与下一次学习计划", t.id, state.competitionNotes[t.id], "track")}<details><summary>检查一个关键概念</summary><p>${t.q}</p><div class="quiz-options">${t.options.map((x, i) => `<button class="quiz-option ${state.competitionQuiz[t.id] === i ? "selected" : ""}" data-track-answer="${t.id}-${i}">${String.fromCharCode(65 + i)}. ${x}</button>`).join("")}</div><div id="track-feedback-${t.id}" aria-live="polite">${trackFeedback(t)}</div></details></section>`).join("")}<section class="panel"><h2>和全班保持同一项目节奏</h2><div class="table-wrap"><table class="mini-table"><thead><tr><th>课时</th><th>共同节点</th><th>竞赛成员自主任务</th></tr></thead><tbody><tr><td>8—10</td><td>选题、调研、提案</td><td>选赛道，核对范围，做一次基础诊断</td></tr><tr><td>11—12</td><td>原型与测试</td><td>工具流程 / 数据基线 / 原理题错因</td></tr><tr><td>13—14</td><td>改进与准备</td><td>复测、限时练习、规则与材料核查</td></tr><tr><td>15</td><td>作品展</td><td>展示原型、数据故事或原理实验，解释下一阶段计划</td></tr></tbody></table></div><p style="margin-top:16px">不会强迫所有成员刷竞赛题，也不会把一般社团作品直接视为可参赛作品。</p></section>`,
    "competition",
    "竞赛加油站",
  );
}
function trackFeedback(t) {
  const a = state.competitionQuiz[t.id];
  return a === undefined
    ? ""
    : `<div class="quiz-result ${a !== t.answer ? "wrong" : ""}">${a === t.answer ? "判断正确。" : "再想一想。"}${t.why}</div>`;
}
let timerEnd = 0,
  timerRemaining = 300;
function timerMarkup() {
  return `<label class="field"><span>活动计时（分钟）</span><input id="timer-minutes" type="number" min="1" max="40" value="5" style="width:100px;padding:10px;border:1px solid #cbd7d9;border-radius:8px"></label><div class="timer"><strong id="timer-display" aria-live="off">${timerText()}</strong><button class="btn small" data-action="timer-start">开始</button><button class="btn small" data-action="timer-pause">暂停</button><button class="btn small" data-action="timer-reset">重设</button></div>`;
}
function timerText() {
  const n = timerEnd ? Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000)) : timerRemaining;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}
function teacher() {
  shell(
    `<div class="title-row"><div><div class="eyebrow">TEACHER'S DESK</div><h1>教师备课台</h1><p class="subtle">微讲解提供支点，课堂时间交给学生。</p></div><button class="btn" data-action="print">打印备课安排</button></div><div class="two-col"><section class="panel"><h2>这一学期怎样组织</h2><p>第1课成立社团、选社长、调研需求；第2—7课完成三个两课时挑战；第8—14课自主项目；第15课作品展。每课40分钟，讲解通常4—7分钟，其余是讨论、设计、制作与反馈。</p><div class="flow"><b>学生提问</b><span>→</span><b>教师微讲解</b><span>→</span><b>尝试与评价</b><span>→</span><b>自主决定</b></div><p>2—4人一组，每两课轮换部分职责。社长主持短站会、互评和展示；费用、平台账号与密钥由教师管理。</p></section><section class="panel"><h2>课堂计时器</h2><p>适合提示词会诊、短路演、同伴测试。计时在页面内进行，不会影响记录。</p>${timerMarkup()}</section></div><section class="panel"><h2>逐课备课速查</h2><div class="table-wrap"><table class="mini-table"><thead><tr><th>课时</th><th>内容</th><th>课前准备 / 课堂提示</th></tr></thead><tbody>${lessons.map((l) => `<tr><td>${String(l.id).padStart(2, "0")}</td><td><a href="#lesson/${l.id}">${l.short} →</a></td><td>${l.teacher}</td></tr>`).join("")}</tbody></table></div></section><section class="panel"><h2>生成额度怎样分配</h2><p>优先保障第3课的文本对照与第5课的视觉体验，再支持自主项目关键素材。生视频作为可选项；视频组可以用静态图片、字幕与动画形成作品。</p><div class="table-wrap"><table class="mini-table"><thead><tr><th>阶段</th><th>建议组织</th><th>额度不足时</th></tr></thead><tbody><tr><td>第2、4、6、7课</td><td>先写提示词、草图、流程与测试用例</td><td>纸面与本地活动即可进行</td></tr><tr><td>第3课</td><td>全班集中跑2组A/B，每版尽量2次</td><td>使用预先保存并注明来源的真实输出</td></tr><tr><td>第5课</td><td>每组先生成1—2张候选图</td><td>用教师素材练习筛选与后期，注明来源</td></tr><tr><td>第11—13课</td><td>按提案分配配额，申请时说明用途</td><td>保留核心任务，缩小生成范围</td></tr></tbody></table></div><div class="hint"><strong>云端生成尚未接入。</strong>本版是课程与本地活动网站，不包含收费模型调用。提示词实验室的“复制”只复制文本。后续接入需要选定服务、预算和教师端密钥；密钥不能放在学生网页里。</div><p>学生可以免平台注册使用教师管理的课堂入口，但仍需服务端管理请求、限制额度和保存真实生成记录。课堂创作币不等于平台价格，不能替代实际预算上限。</p></section><section class="panel"><h2>不同作品怎样评价</h2><p>社团共同量规：创意与问题价值20%、学生贡献20%、AI与原理理解20%、迭代与测试20%、最终效果与表达20%。这是课程建议，不是官方赛事分值。</p><div class="two-col"><div><h3>收集过程证据</h3><p>第一课兴趣卡、A/B实验、视觉草图、流程图、项目提案、失败复测与个人反思，都能成为评价依据。</p></div><div><h3>学生主导的互评</h3><p>要求说出“我看见……证据是……建议……”。反馈由作者判断是否采纳，不把同伴的偏好强制变成所有作品的标准。</p></div></div></section><section class="panel"><h2>材料依据与使用边界</h2><ul class="source-list"><li>《首届全国青少年人工智能大赛初赛指南（参赛选手版）》：印刷页10—11，高中赛道2；12—13，赛道3；18—21，赛道5。作为历史规则依据。</li><li>《首届全国青少年人工智能大赛初赛指南说明（协办单位及指导教师版）》：组织信息参考；旧日期不写入新学期安排。</li><li>《高中赛道二人工智能工具应用学习手册》：提示词、人机协作、工具适配、原理与责任章节；属于辅助材料。</li><li>赛道3、赛道5学习手册及现有选修课讲义：用于选择原理深度。所有本网站校园案例、活动和出口题均为自编。</li></ul><p>强调概念边界：RAG不保证消除幻觉；上下文示例不等于权重微调；角色表演不等于运行智能体；图像生成方式不只一种；课堂分组不能代替比赛独立完成要求。</p></section><section class="panel"><h2>机房使用与记录</h2><p>教师启动网站后，学生输入启动窗口给出的校园网络地址。网络必须允许设备互访；首次打开需要教师服务在线。每台电脑浏览器保存自己的记录，不会自动汇总、同步或统计全班投票。</p><p>需求调研、社长投票和作品展投票建议用匿名纸票。活动单与作品档案可以导出，学生按学校允许的方式交给教师。JSON备份用于恢复文字记录；作品媒体与代码另外保存。</p><div class="actions"><a class="btn" href="#project">打开档案与备份</a><a class="btn" href="#lesson/1">开始第一课 →</a></div></section>`,
    "teacher",
    "教师备课台",
  );
  document
    .querySelector("#main")
    .insertAdjacentHTML(
      "afterbegin",
      '<div class="actions" style="margin:0 0 24px"><a class="btn primary" href="./活动材料卡.html" target="_blank" rel="noopener">打开可打印的课堂材料卡 ↗</a><span class="subtle">兴趣卡、提示词病历、视觉卡、智能体规则包、互评卡</span></div>',
    );
}
function render() {
  const [r, id] = route();
  if (r === "lesson") lesson(Number(id));
  else if (r === "courses") courses();
  else if (r === "lab") lab();
  else if (r === "project") project();
  else if (r === "competition") competitionPage();
  else if (r === "teacher") teacher();
  else if (r === "home") home();
  else
    shell(
      '<div class="panel"><h1>没有找到这个页面</h1><p>请回到课程路线继续。</p><a href="#courses" class="btn primary">进入课程</a></div>',
    );
  document.title = `${r === "lesson" ? (lessons.find((l) => l.id === Number(id))?.short || "课程") + " · " : ""}AI创新实践`;
}
app.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.note) {
    state.notes[el.dataset.note] = el.value;
    save();
  }
});
app.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.lab) {
    state.lab[el.dataset.lab] = el.value;
    save();
    const output = document.querySelector("#assembled-prompt");
    if (output)
      output.textContent = assemblePrompt(state.lab) || "填写左侧内容，你的任务说明会在这里组合。";
  }
  if (el.dataset.project) {
    state.project[el.dataset.project] = el.value;
    save();
  }
  if (el.hasAttribute("data-group")) {
    state.group = el.value;
    save();
  }
  if (el.dataset.track) {
    state.competitionNotes[el.dataset.track] = el.value;
    save();
  }
});
let pendingImport = null;
app.addEventListener("change", async (e) => {
  const el = e.target;
  if (el.id === "timer-minutes") {
    const n = Number(el.value);
    if (!timerEnd && Number.isFinite(n) && n >= 1 && n <= 40) {
      timerRemaining = Math.round(n * 60);
      document.querySelector("#timer-display").textContent = timerText();
    }
  }
  if (el.id === "template-select") {
    const t = templates[el.value];
    document.querySelector("#template-preview").innerHTML = t
      ? `<details open><summary>预览：${esc(t.name)}</summary><div class="prompt">${esc(assemblePrompt(t))}</div><button class="btn small" data-template="${el.value}">用此示例填入上方任务表（覆盖当前任务字段）</button></details>`
      : "";
  }
  if (el.id === "import-file") {
    const file = el.files?.[0];
    if (!file) return;
    try {
      if (file.size > 3_000_000) throw new Error("文件超过3MB，请选择本网站导出的文字记录备份。");
      const parsed = JSON.parse(await file.text());
      if (parsed.version !== 1) throw new Error("备份版本不匹配，请选择本网站导出的JSON记录。");
      pendingImport = sanitizeState(parsed);
      document.querySelector("#import-preview").innerHTML =
        `<div class="hint">备份：${esc(pendingImport.group || "未命名小组")}，${pendingImport.completed.length}课已完成，${Object.keys(pendingImport.notes).length}项活动记录。<br>确认后会替换当前浏览器记录；会先尝试下载一份当前记录备份，请确认下载成功后再使用。</div><div class="actions"><button class="btn primary" data-action="confirm-import">备份当前记录并导入</button><button class="btn" data-action="cancel-import">取消</button></div>`;
    } catch (error) {
      pendingImport = null;
      document.querySelector("#import-preview").textContent = error.message;
      toast("没有导入，现有记录保持不变。");
    }
    el.value = "";
  }
});
app.addEventListener("click", (e) => {
  const el = e.target.closest("button");
  if (!el) return;
  const a = el.dataset.action;
  if (el.dataset.template) {
    const t = templates[el.dataset.template];
    if (t) {
      for (const [k] of promptFields) state.lab[k] = t[k] || "";
      save();
      lab();
      toast("已填入示例，可按你的作品修改。");
    }
  }
  if (el.dataset.copyVersion !== undefined) {
    const v = state.snapshots[Number(el.dataset.copyVersion)];
    if (v) copy(v.prompt);
  }
  if (el.dataset.trackAnswer) {
    const [id, n] = el.dataset.trackAnswer.split("-");
    const t = competition.find((x) => x.id === id);
    if (t) {
      state.competitionQuiz[id] = Number(n);
      save();
      document.querySelector(`#track-feedback-${id}`).innerHTML = trackFeedback(t);
      document
        .querySelectorAll(`[data-track-answer^="${id}-"]`)
        .forEach((x) => x.classList.toggle("selected", x === el));
    }
  }
  if (a === "copy-prompt") {
    const p = assemblePrompt(state.lab);
    p ? copy(p) : toast("先填写一项任务说明。");
  }
  if (a === "save-version") {
    const p = assemblePrompt(state.lab);
    if (!p) {
      toast("先写一条提示词再保存版本。");
      return;
    }
    if (state.snapshots.length >= 30) {
      toast("已保存30个版本，请先导出记录；可在活动单继续记录。");
      return;
    }
    state.snapshots.push({
      label: `版本 ${state.snapshots.length + 1}`,
      prompt: p,
      date: new Date().toLocaleString("zh-CN"),
    });
    save();
    document.querySelector("#version-list").innerHTML = versionList();
    toast("版本已保留，可展开比较。");
  }
  if (a === "draw-brief") {
    const choose = (xs) => xs[Math.floor(Math.random() * xs.length)];
    state.brief = {
      theme: choose([
        "校园节水",
        "未来图书馆",
        "校园植物",
        "社团招新",
        "午后的操场",
        "给新生的欢迎礼",
      ]),
      shot: choose([
        "前景特写，背景虚化",
        "俯视构图",
        "主体放在右侧，左侧留白",
        "对称构图",
        "低视角仰拍",
        "三格连续画面",
      ]),
      light: choose([
        "清晨柔和侧光",
        "明亮阴天",
        "夕阳背光",
        "冷色环境与暖色主体",
        "平面剪纸风格",
        "高对比黑白",
      ]),
    };
    save();
    document.querySelector("#brief-result").innerHTML = briefMarkup();
  }
  if (a === "export-project") {
    exportFile(
      "AI创新实践-作品档案.md",
      `# AI创新实践 · 作品档案\n\n代号：${state.group || "未填写"}\n形式：${state.project.format || "未选择"}\n阶段：${state.project.stage || "选题中"}\n\n${projectFields.map(([k, t]) => `## ${t}\n\n${state.project[k] || "（待填写）"}`).join("\n\n")}\n\n注：作品文件请单独保存，本档案不包含媒体或代码文件。`,
      "text/markdown;charset=utf-8",
    );
  }
  if (a === "export-lab") {
    exportFile(
      "AI创新实践-提示词实验.md",
      `# 提示词实验\n\n${assemblePrompt(state.lab)}\n\n${[
        ["variable", "共同设置与变量"],
        ["abA", "A版输入输出"],
        ["abB", "B版输入输出"],
        ["evidence", "评分与证据"],
        ["conclusion", "结论与局限"],
      ]
        .map(([k, t]) => `## ${t}\n\n${state.lab[k] || "（待填写）"}`)
        .join(
          "\n\n",
        )}\n\n## 历史版本\n\n${state.snapshots.map((v) => `### ${v.label} · ${v.date}\n\n${v.prompt}`).join("\n\n")}`,
      "text/markdown;charset=utf-8",
    );
  }
  if (a === "confirm-import" && pendingImport) {
    exportFile("AI创新实践-导入前备份.json", JSON.stringify({ version: 1, ...state }, null, 2));
    state = pendingImport;
    pendingImport = null;
    save();
    project();
    toast("记录已导入当前浏览器。作品文件需要另外保存。");
  }
  if (a === "cancel-import") {
    pendingImport = null;
    document.querySelector("#import-preview").innerHTML = "";
  }
  if (a === "timer-start") {
    if (!timerEnd) {
      if (timerRemaining <= 0) timerRemaining = 300;
      timerEnd = Date.now() + timerRemaining * 1000;
      toast("计时开始。");
    }
  }
  if (a === "timer-pause") {
    if (timerEnd) timerRemaining = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
    timerEnd = 0;
  }
  if (a === "timer-reset") {
    const n = Number(document.querySelector("#timer-minutes").value);
    if (!Number.isFinite(n) || n < 1 || n > 40) {
      toast("请输入1—40分钟。");
      return;
    }
    timerEnd = 0;
    timerRemaining = Math.round(n * 60);
    document.querySelector("#timer-display").textContent = timerText();
  }
});
setInterval(() => {
  if (timerEnd && Date.now() >= timerEnd) {
    timerRemaining = 0;
    timerEnd = 0;
    toast("本轮活动时间到，请保存进度。");
  }
  const display = document.querySelector("#timer-display");
  if (display) display.textContent = timerText();
}, 500);
const toolsLifecycle = new AbortController();
if (document.modelContext?.registerTool) {
  const definitions = [
    {
      name: "read_ai_club_course",
      title: "读取社团课程",
      description: "读取15课时内容和本地完成状态。不会访问云端。",
      inputSchema: {
        type: "object",
        properties: { lessonId: { type: "integer", minimum: 1, maximum: 15 } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== "object" || Object.keys(input).some((k) => k !== "lessonId"))
          throw new Error("输入必须是可选lessonId对象");
        if (input.lessonId !== undefined) {
          if (!Number.isInteger(input.lessonId) || input.lessonId < 1 || input.lessonId > 15)
            throw new Error("课时必须为1—15");
          return lessons.find((l) => l.id === input.lessonId);
        }
        return {
          lessons: lessons.map((l) => ({ id: l.id, title: l.title, question: l.question })),
          completed: state.completed,
        };
      },
    },
    {
      name: "open_ai_club_lesson",
      title: "打开社团课时",
      description: "仅导航到指定课时，不标记完成或修改活动记录。",
      inputSchema: {
        type: "object",
        properties: { lessonId: { type: "integer", minimum: 1, maximum: 15 } },
        required: ["lessonId"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (
          !input ||
          Object.keys(input).some((k) => k !== "lessonId") ||
          !Number.isInteger(input.lessonId) ||
          input.lessonId < 1 ||
          input.lessonId > 15
        )
          throw new Error("课时必须为1—15");
        location.hash = `lesson/${input.lessonId}`;
        render();
        return { openedLesson: input.lessonId };
      },
    },
  ];
  for (const tool of definitions)
    try {
      Promise.resolve(
        document.modelContext.registerTool(tool, { signal: toolsLifecycle.signal }),
      ).catch(() => {});
    } catch {}
}
window.addEventListener("pagehide", () => toolsLifecycle.abort(), { once: true });
app.addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.check) {
    state.checks[el.dataset.check] = el.checked;
    save();
  }
});
app.addEventListener("click", (e) => {
  const el = e.target.closest("button,a");
  if (!el) return;
  const l = lessons.find((x) => x.id === Number(route()[1]));
  if (el.dataset.scroll) {
    e.preventDefault();
    document.getElementById(el.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (el.dataset.filter !== undefined) {
    activeFilter = Number(el.dataset.filter);
    courses();
    return;
  }
  if (el.dataset.answer !== undefined && l) {
    state.quiz[l.id] = Number(el.dataset.answer);
    save();
    document.querySelector("#quiz-feedback").innerHTML = quizFeedback(l);
    document
      .querySelectorAll("[data-answer]")
      .forEach((b) => b.classList.toggle("selected", b === el));
    return;
  }
  const a = el.dataset.action;
  if (a === "export")
    exportFile("AI创新实践-记录备份.json", JSON.stringify({ version: 1, ...state }, null, 2));
  if (a === "copy-lesson" && l) copy(l.prompt);
  if (a === "complete" && l) {
    state.completed = state.completed.includes(l.id)
      ? state.completed.filter((x) => x !== l.id)
      : [...state.completed, l.id];
    save();
    lesson(l.id);
  }
  if (a === "present") {
    document.body.classList.toggle("present");
    if (document.body.classList.contains("present")) {
      const b = document.createElement("button");
      b.className = "btn present-toggle";
      b.textContent = "退出投屏 · Esc";
      b.onclick = () => {
        document.body.classList.remove("present");
        b.remove();
      };
      document.body.append(b);
    }
  }
  if (a === "print") {
    document.body.classList.toggle("print-worksheet", Boolean(l));
    window.print();
  }
  if (a === "export-lesson" && l) {
    const md = `# AI创新实践 · 第${l.id}课 ${l.title}\n\n${l.fields.map((f, i) => `## ${f}\n\n${state.notes[`${l.id}-${i}`] || "（待填写）"}`).join("\n\n")}`;
    exportFile(`第${l.id}课-活动单.md`, md, "text/markdown;charset=utf-8");
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.body.classList.remove("present");
    document.querySelector(".present-toggle")?.remove();
  }
});
window.addEventListener("beforeprint", () => {
  document.querySelectorAll("textarea").forEach((el) => {
    const copy = document.createElement("div");
    copy.className = "print-copy";
    copy.textContent = el.value || "（在此记录）";
    el.after(copy);
  });
});
window.addEventListener("afterprint", () => {
  document.querySelectorAll(".print-copy").forEach((el) => el.remove());
  document.body.classList.remove("print-worksheet");
});
window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
});
render();
