@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo 请先在教师电脑安装 Node.js 20 或更新版本。学生电脑仅需要浏览器。
  pause
  exit /b 1
)
node server.mjs
pause
