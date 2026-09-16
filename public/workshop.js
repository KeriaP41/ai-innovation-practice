export const promptFields = [
  ["task", "任务与观众", "请AI完成什么？给谁使用？"],
  ["context", "背景与依据", "提供经过核实的材料；没有材料时说明需要澄清。"],
  ["constraints", "约束与边界", "长度、风格、必须保留什么、不确定时怎么处理？"],
  ["example", "示例（可选）", "用一个输入输出示例说明期望；不等于重新训练模型。"],
  ["format", "输出形式", "段落、表格、分镜、网页文件……"],
  ["criteria", "验收标准", "怎样判断结果可用？列2—3条可检查要求。"],
];
export const templates = {
  text: {
    name: "文字与故事",
    task: "为没有编程经验的高一新生写80字以内的AI社团介绍。",
    context: "社团包含提示词实验、海报创作、网站制作，成员可自选学期作品形式。",
    constraints: "不编造上课地点、时间与获奖信息；避免未解释的术语。",
    example: "",
    format: "一段介绍，最后用一句话邀请读者提出自己的创作想法。",
    criteria: "是否准确使用材料；新生是否能理解；是否在80字以内。",
  },
  image: {
    name: "图像与海报",
    task: "为校园节水主题海报设计主视觉，面向高中学生。",
    context: "主体是一滴水与关闭的水龙头。标题将在生成后人工排版。",
    constraints:
      "蓝白配色，主体放在下半部分，顶部留白；不添加文字或真人肖像。宽高比在平台另设为3:4。",
    example: "",
    format: "一张简洁的海报主视觉。",
    criteria: "主体是否明确；留白是否足够；是否表达节水主题。",
  },
  video: {
    name: "视频与分镜",
    task: "为20秒校园节水短片写分镜，观众是高中学生。",
    context: "使用2—4张图片、字幕和简单镜头移动；不要求AI生成全部视频。",
    constraints: "每个镜头只安排一个核心动作；避免无法表现的抽象描写；时间总和20秒。",
    example: "镜头1：水龙头特写，手伸入关闭水流，5秒，固定镜头。",
    format: "表格：镜头、时长、主体动作、场景、景别与运镜、字幕。",
    criteria: "总时长正确；镜头间逻辑连续；每个镜头可以实际制作。",
  },
  web: {
    name: "网站与互动",
    task: "制作一个介绍三种校园植物的单页网页，给新生使用。",
    context: "植物资料由我提供。学校电脑使用浏览器，作品需要本地打开。",
    constraints: "点击卡片能展开和关闭详情；无需注册；不引入外部付费服务；未知植物事实标记待核实。",
    example: "",
    format: "HTML、CSS、JavaScript，以及打开方式和三条交互检查步骤。",
    criteria: "三张卡都能打开与关闭；键盘可操作；内容来源可追溯。",
  },
  agent: {
    name: "智能体与问答",
    task: "作为校园借阅说明助手，依据规则回答新生的问题。",
    context: "只使用我提供的规则卡；规则卡含编号和更新时间。",
    constraints: "缺少必要信息先追问；没有依据时说明不知道；不修改借阅记录。",
    example: "问：假期开门吗？材料没有假期安排。答：现有规则未提供假期安排，请向图书馆确认。",
    format: "简短步骤说明，并附规则卡编号。",
    criteria: "回答有依据；不会编造缺失信息；异常请求能转人工。",
  },
};
export function assemblePrompt(lab) {
  return promptFields
    .filter(([k]) => typeof lab[k] === "string" && lab[k].trim())
    .map(([k, label]) => `${label}：\n${lab[k].trim()}`)
    .join("\n\n");
}
export const projectFields = [
  ["name", "作品名称"],
  ["audience", "目标观众与要解决的问题"],
  ["evidence", "问题证据与资料来源"],
  ["minimum", "必须完成的最小版本 / 可选扩展"],
  ["roles", "成员代号、具体贡献与轮换计划"],
  ["workflow", "人机分工：输入 → 处理 → 输出 → 核查"],
  ["criteria", "三条可测试的验收标准"],
  ["milestones", "完成节点与下一步"],
  ["iterations", "版本记录、反馈、修改与复测"],
  ["delivery", "最终作品路径 / 链接与打开说明"],
  ["credits", "AI使用、模型与日期、素材来源"],
  ["reflection", "一次失败、一个原理与我的自主决定"],
];
export const stageNames = ["选题中", "制作原型", "测试修改", "准备展示", "已完成"];
export const formatNames = [
  "还没决定",
  "海报 / 文创",
  "漫画 / 绘本",
  "视频 / 动态故事",
  "网站 / 互动作品",
  "智能体 / 工具",
  "数据 / 科学项目",
  "原理讲解 / 竞赛学习",
  "其他形式",
];
export const competition = [
  {
    id: "2",
    title: "工具应用与智能体",
    tag: "赛道 2 · 高中",
    intro:
      "适合喜欢设计校园工具、组织人机协作的同学。共同课上用自己的项目练习需求、工具选择和结果评价。",
    facts:
      "现有首届初赛指南的高中赛道2包含集中测试；作品评审是否开展由当地组织方决定。列出的高中作品项目是“智能体创新开发”，并非任意海报或短片均可直接报送。",
    learn: [
      ["工具适配", "比较查询、生成、分类等任务，说明为什么选某种工具，什么时候交给人。"],
      ["提示词与工作流", "设计输入、参考资料和输出；把复杂任务分成可检查步骤。"],
      ["RAG与工具调用", "检索资料用于回答；工具承担查询或行动；设计资料缺失与工具失败时的行为。"],
      ["评价与反思", "用正常和异常用例测试，记录改动，分析隐私、偏见、来源和责任。"],
    ],
    deliver:
      "课堂可交一个校园助手原型＋工作流＋测试日志。正式作品必须按当届要求独立完成、使用指定范围的平台并提供实际可访问成果。",
    task: "用借阅助手举例，分别写一个正常问题、一个缺失信息问题和一个越界请求，并写出期望行为。",
    q: "助手没有找到节假日开放安排，最合适的响应是？",
    options: ["根据日常安排猜一个答案", "说明资料未提供，并给出确认途径", "假装已查询到最新公告"],
    answer: 1,
    why: "缺少证据时应说明不确定，不能将推测说成查询结果。",
  },
  {
    id: "3",
    title: "数据与科学建模",
    tag: "赛道 3 · 初高中",
    intro: "适合对科学问题、数据和Python感兴趣的同学。在工作室时间用小数据完成一个可以解释的分析。",
    facts:
      "现有首届初赛指南要求基础Python、分类、回归、特征提取、训练与预测，结合科学情境考查信息提取和建模。它不是只提交一个生成式创作作品。",
    learn: [
      ["问题建模", "先写输入与目标：预测是否需要开灯是分类，预测耗电量是回归。"],
      ["数据与特征", "区分样本、特征和标签，检查缺失、异常与代表性。"],
      ["训练和评价", "训练集拟合参数，验证集选择方案，测试集做最终评估；避免泄漏。"],
      ["误差与解释", "分类可算准确率，数值预测可算平均绝对误差；说明指标是否匹配问题。"],
    ],
    deliver: "课堂可交匿名或教学数据、可运行的小程序、模型与简单基线对比、误差说明和限制。",
    task: "真实值为10、12、8，预测值为9、14、8。手算平均绝对误差，再说明为什么只有三个样本还不足以证明模型很好。",
    q: "这三个预测的平均绝对误差是多少？",
    options: ["1", "3", "0"],
    answer: 0,
    why: "绝对误差为1、2、0，平均为(1+2+0)/3=1。这个小例子说明计算方法，不足以评估真实应用。",
  },
  {
    id: "5",
    title: "大语言模型原理",
    tag: "赛道 5 · 高中",
    intro:
      "适合喜欢追问模型如何工作、分析提示词差异的同学。作品可选择原理讲解、实验报告或交互演示。",
    facts:
      "现有首届初赛指南列出AI基础、机器学习、语言建模、大模型概念、提示词、模型架构和应用；初赛题型为客观题。提示词重要，但不能替代其他原理学习。",
    learn: [
      [
        "机器学习与神经网络",
        "理解监督、无监督、强化学习；神经元进行加权计算，损失衡量误差，优化算法更新参数。",
      ],
      [
        "语言建模与注意力",
        "自回归依据已有词元预测后续词元；注意力根据上下文关系组合信息，不是人的主观注意。",
      ],
      [
        "训练阶段",
        "预训练学习数据规律；监督微调使用任务示范；偏好对齐优化偏好的行为。上下文示例通常不更新参数。",
      ],
      ["提示词与RAG", "比较任务、材料、示例、格式和约束；评价事实性与完整性，理解幻觉及边界。"],
    ],
    deliver:
      "课堂可交一组提示词对照实验、概念关系图和错因档案。有比赛目标的成员另做专项题与限时训练。",
    task: "分别解释“增加示例”“加入检索资料”“用训练数据更新权重”改变了什么，并为三者各举一个校园例子。",
    q: "把三个示例放进当前提示词，一般会直接发生什么？",
    options: ["模型参数自动永久更新", "当前上下文改变，模型可以参照示例回答", "模型一定不会再犯错"],
    answer: 1,
    why: "上下文中的示例影响当前条件，通常不是参数训练；效果仍要测试。",
  },
];
export function blankState() {
  return {
    completed: [],
    notes: {},
    checks: {},
    quiz: {},
    lab: {},
    project: {},
    group: "",
    snapshots: [],
    competitionNotes: {},
    competitionQuiz: {},
    brief: null,
  };
}
const obj = (v) => v && typeof v === "object" && !Array.isArray(v);
function textMap(v) {
  if (!obj(v)) return {};
  return Object.fromEntries(
    Object.entries(v)
      .filter(
        ([k, x]) =>
          !["__proto__", "constructor", "prototype"].includes(k) &&
          typeof x === "string" &&
          x.length <= 100000,
      )
      .slice(0, 300),
  );
}
export function sanitizeState(v) {
  if (!obj(v)) throw new Error("不是有效的记录文件");
  const s = blankState();
  s.completed = Array.isArray(v.completed)
    ? [...new Set(v.completed.filter((n) => Number.isInteger(n) && n >= 1 && n <= 15))]
    : [];
  s.notes = textMap(v.notes);
  s.lab = textMap(v.lab);
  s.project = textMap(v.project);
  s.competitionNotes = textMap(v.competitionNotes);
  s.group = typeof v.group === "string" ? v.group.slice(0, 100) : "";
  if (obj(v.checks))
    s.checks = Object.fromEntries(
      Object.entries(v.checks).filter(([k, x]) => /^\d+-\d+$/.test(k) && typeof x === "boolean"),
    );
  for (const [src, dst] of [
    ["quiz", "quiz"],
    ["competitionQuiz", "competitionQuiz"],
  ])
    if (obj(v[src]))
      s[dst] = Object.fromEntries(
        Object.entries(v[src]).filter(
          ([k, x]) => /^\d+$/.test(k) && Number.isInteger(x) && x >= 0 && x <= 2,
        ),
      );
  if (Array.isArray(v.snapshots))
    s.snapshots = v.snapshots
      .slice(-30)
      .filter((x) => obj(x) && typeof x.prompt === "string" && x.prompt.length <= 100000)
      .map((x) => ({
        label: String(x.label || "版本").slice(0, 60),
        prompt: x.prompt,
        date: String(x.date || "").slice(0, 60),
      }));
  if (obj(v.brief) && ["theme", "shot", "light"].every((k) => typeof v.brief[k] === "string"))
    s.brief = {
      theme: v.brief.theme.slice(0, 100),
      shot: v.brief.shot.slice(0, 100),
      light: v.brief.light.slice(0, 100),
    };
  return s;
}
