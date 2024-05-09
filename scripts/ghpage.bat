@echo off
chcp 65001

call npm run build
@REM if %errorlevel% neq 0 (
@REM     echo "[ERROR]" npm run build
@REM     echo 错误代码：%errorlevel%
@REM     pause
@REM     @REM exit /b
@REM ) 

git add .
if %errorlevel% neq 0 (
    echo "[ERROR]" "git add ."
    echo 错误代码：%errorlevel%
    pause
    @REM exit /b
) 

git commit -m "脚本更新 %date% %time%"
if %errorlevel% neq 0 (
    echo "[ERROR]" git commit -m "脚本更新 %date% %time%"
    echo 错误代码：%errorlevel%
    pause
    @REM exit /b
) 

git push github main
if %errorlevel% neq 0 (
    echo "[ERROR]" git push github main
    echo 错误代码：%errorlevel%
    pause
    @REM exit /b
) 

pause