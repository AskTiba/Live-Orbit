@echo off
setlocal enabledelayedexpansion

:: Set the full path to your git.exe.
set "git_executable=C:\Program Files\Git\cmd\git.exe"

:: This script updates your local repository with the latest from the remote.
:: It fetches all branches, updates your main branch, and ensures you have a local copy of every branch from the remote.

echo Fetching all remote branches and pruning any that have been deleted...
"%git_executable%" fetch --all --prune

echo Identifying the default remote branch (main or master)...
for /f "tokens=*" %%a in ('"%git_executable%" symbolic-ref refs/remotes/origin/HEAD') do (
    set head_ref=%%a
)
set default_branch=!head_ref:refs/remotes/origin/=!

echo Switching to the default branch (!default_branch!) and pulling the latest changes...
"%git_executable%" checkout !default_branch!
"%git_executable%" pull origin !default_branch!

echo Checking for new remote branches and creating local copies...
for /f "tokens=*" %%b in ('"%git_executable%" branch -r') do (
    set remote_branch_full=%%b
    
    :: Skip the HEAD pointer
    if not "!remote_branch_full:->=!" == "!remote_branch_full!" (
        echo Skipping HEAD pointer: !remote_branch_full!
    ) else (
        :: Trim whitespace
        for /f "tokens=* delims=" %%t in ("!remote_branch_full!") do set remote_branch_trimmed=%%t
        
        :: Remove "origin/" prefix to get the local branch name
        set local_branch=!remote_branch_trimmed:origin/=!
        
        :: Check if the local branch already exists
        "%git_executable%" rev-parse --verify --quiet "refs/heads/!local_branch!" >nul 2>&1
        if !errorlevel! neq 0 (
            echo Creating local branch '!local_branch!' to track '!remote_branch_trimmed!'...
            "%git_executable%" checkout --track "!remote_branch_trimmed!"
        ) else (
            echo Local branch '!local_branch!' already exists. Pulling latest changes...
            "%git_executable%" checkout !local_branch!
            "%git_executable%" pull
        )
    )
)

echo.
echo Switching back to the default branch (!default_branch!)...
"%git_executable%" checkout !default_branch!

echo.
echo Update complete! Your local repository is now up-to-date with the remote.
echo All remote branches should now have a corresponding local branch.

endlocal