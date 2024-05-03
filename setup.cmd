SET AlloyMVC=samples\ManagementSite

IF EXIST %AlloyMVC%\App_Data (
    ECHO Remove all files from the app data folder
    DEL %AlloyMVC%\App_Data\*.* /F /Q || Exit /B 1
) ELSE (
    MKDIR %AlloyMVC%\App_Data || Exit /B 1
)

COPY /y build\database\DefaultSiteContent.episerverdata %AlloyMVC%\App_Data\DefaultSiteContent.episerverdata || Exit /B 1
REM copy the database with ACL
XCOPY /y/i/k build\database\Alloy.mdf %AlloyMVC%\App_Data\ || Exit /B 1



@ECHO OFF
SETLOCAL

SET BASE=.\samples\musicfestival-backend-dotnet\App_Data

IF EXIST %BASE%\blobs\ RMDIR %BASE%\blobs\ /S/Q || EXIT /B 1
IF EXIST %BASE%\musicfestival.mdf DEL %BASE%\musicfestival.mdf /F/Q || EXIT /B 1
IF EXIST %BASE%\musicfestival_log.ldf DEL %BASE%\musicfestival_log.ldf /F/Q || EXIT /B 1
ECHO Removed all files from the App_Data folder

XCOPY %BASE%\blobs_default %BASE%\blobs /Y/E/C/I || EXIT /B 1
ECHO Created new blobs

XCOPY %BASE%\db.mdf %BASE%\musicfestival.mdf* /Y/C || EXIT /B 1
ECHO Created new database

EXIT /B %ERRORLEVEL%