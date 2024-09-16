@echo off

:: Reverse TCP port for ADB
adb reverse tcp:5000 tcp:5000

:: Start Apache Ignite in a new window so the script can continue
start "" cmd /c "cd /d C:\apache-ignite-2.16.0-bin && bin\ignite.bat"

:: Change to the directory of the current script and run view.py
cd /d %~dp0
python views.py
