@echo off
echo.

SET mypath=%~dp0
SET pp=%mypath:~0,-1%

gulp --gulpfile %pp%\..\gulpfile.js %* --currentDir %cd%