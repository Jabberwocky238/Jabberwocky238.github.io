@echo off
chcp 65001

setlocal
:: 设置源文件夹和目标文件夹
set "SOURCE_FOLDER=%1"
set "DESTINATION_FOLDER=%2"

:: 检查源文件夹是否存在
if not exist "%SOURCE_FOLDER%" (
    echo 源文件夹 "%SOURCE_FOLDER%" 不存在。
    exit /b
)

:: 检查目标文件夹是否存在，如果不存在则创建
if not exist "%DESTINATION_FOLDER%" mkdir "%DESTINATION_FOLDER%"

:: 复制源文件夹到目标文件夹
xcopy "%SOURCE_FOLDER%\*.*" "%DESTINATION_FOLDER%" /E /I

if exist "%DESTINATION_FOLDER%\.obsidian" (
    rmdir /s /q "%DESTINATION_FOLDER%\.obsidian"
)

echo 文件夹内容已同步 %SOURCE_FOLDER%
endlocal

pause
