#!/bin/zsh
cd "${0:A:h}"
echo "正在启动 AI创新实践……"
if command -v node >/dev/null 2>&1; then
  node server.mjs
elif [ -x "/Users/shuyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]; then
  /Users/shuyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.mjs
else
  echo "未找到 Node.js。教师电脑需安装 Node.js 20 或更新版本。学生电脑只需浏览器。"
fi
echo "网站已关闭。按回车退出。"
read
