@echo off
setlocal enabledelayedexpansion

:: 获取当前日期
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (
    set day=%%c
    set month=%%b
    set year=%%a
)

:: 格式化月份和日期
if %month% LSS 10 set month=%month%
if %day% LSS 10 set day=%day%

:: 创建随机字符串
set randomStr=
for /L %%i in (1,1,8) do (
    set /a rand=!random!%%26
    if !rand! LSS 10 (
        set "randomStr=!randomStr!0!rand!"
    ) else (
        set "randomStr=!randomStr!!rand!"
    )
)

:: 创建文件名
set filename=%year%-%month%-%day%-%randomStr%.md

:: 创建文件
type nul > "blog/%filename%"

:: 在文件开头写入YAML front matter
(
echo ---
echo slug: md-blog-post
echo title: MD Blog Post
echo authors: [jabberwocky238]
echo ---
) > "blog/%filename%"

endlocal