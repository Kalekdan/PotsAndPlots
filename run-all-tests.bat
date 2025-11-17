@echo off
echo ================================
echo Running Pots and Plots Test Suite
echo ================================
echo.

echo Step 1: Installing/updating frontend dependencies...
pnpm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    exit /b 1
)

echo.
echo Step 2: Running backend tests...
cd backend
.\gradlew clean test --info
set BACKEND_EXIT_CODE=%errorlevel%
cd ..

echo.
echo Step 3: Running frontend tests...
pnpm test:ci
set FRONTEND_EXIT_CODE=%errorlevel%

echo.
echo ================================
echo Test Results Summary
echo ================================
if %BACKEND_EXIT_CODE% equ 0 (
    echo ✓ Backend tests: PASSED
) else (
    echo ✗ Backend tests: FAILED
)

if %FRONTEND_EXIT_CODE% equ 0 (
    echo ✓ Frontend tests: PASSED
) else (
    echo ✗ Frontend tests: FAILED
)

echo.
if %BACKEND_EXIT_CODE% equ 0 if %FRONTEND_EXIT_CODE% equ 0 (
    echo 🎉 All tests passed!
    exit /b 0
) else (
    echo ❌ Some tests failed. Please check the output above.
    exit /b 1
)
