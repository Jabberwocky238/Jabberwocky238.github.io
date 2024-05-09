@echo off
chcp 65001

@REM npm run build

git add .

git commit -m "脚本更新 %date% %time%"

git push github master

pause