@echo off
chcp 65001

call npm run build
if %errorlevel% neq 0 (
    echo "[ERROR]" npm run build
    echo 错误代码：%errorlevel%
    pause
    exit /b
) 

call git add .
if %errorlevel% neq 0 (
    echo "[ERROR]" "git add ."
    echo 错误代码：%errorlevel%
    pause
    exit /b
) 

call git commit -m "脚本更新 %date% %time%"
if %errorlevel% neq 0 (
    echo "[ERROR]" git commit -m "脚本更新 %date% %time%"
    echo 错误代码：%errorlevel%
    pause
    exit /b
) 

call git push github main
if %errorlevel% neq 0 (
    echo "[ERROR]" git push github main
    echo 错误代码：%errorlevel%
    pause
    exit /b
) 

pause