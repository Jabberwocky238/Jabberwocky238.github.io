@echo off
chcp 65001

@REM npm run build

git add .
if %errorlevel% neq 0 (
    echo ERROR "git add ."
    echo 错误代码：%errorlevel%
    pause
) 

git commit -m "脚本更新 %date% %time%"
if %errorlevel% neq 0 (
    echo ERROR git commit -m "脚本更新 %date% %time%"
    echo 错误代码：%errorlevel%
    pause
) 

git push github main
if %errorlevel% neq 0 (
    echo ERROR git push github main
    echo 错误代码：%errorlevel%
    pause
) 

pause