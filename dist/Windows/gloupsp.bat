@echo off
echo.

:: see : https://stackoverflow.com/questions/1894967/how-to-request-administrator-access-inside-a-batch-file
:-------------------------------------
if not "%1"=="am_admin" (powershell -WindowStyle Hidden start -verb runas '%0' am_admin & exit /b)
:--------------------------------------   

:: get current directory
SET mypath=%~dp0

:: strip the last back slash from the current directory path
SET pp=%mypath:~0,-1%

:: check if gloups is part of the windows environment path
echo "%PATH%" | findstr /r /i "Gloups" >nul 2>&1

:: add gloups to windows system environment path
if errorlevel 1 (Powershell.exe -executionpolicy remotesigned -File "%pp%\addGloups.ps1") && echo %pp% added to system paths

:: waiting user input to close
set /p DUMMY=Gloups set successfuly, Hit ENTER to continue...
exit