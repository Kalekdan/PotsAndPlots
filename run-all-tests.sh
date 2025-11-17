#!/bin/bash

echo "================================"
echo "Running Pots and Plots Test Suite"
echo "================================"
echo

echo "Step 1: Installing/updating frontend dependencies..."
pnpm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo
echo "Step 2: Running backend tests..."
cd backend
./gradlew clean test --info
BACKEND_EXIT_CODE=$?
cd ..

echo
echo "Step 3: Running frontend tests..."
pnpm test:ci
FRONTEND_EXIT_CODE=$?

echo
echo "================================"
echo "Test Results Summary"
echo "================================"
if [ $BACKEND_EXIT_CODE -eq 0 ]; then
    echo "✓ Backend tests: PASSED"
else
    echo "✗ Backend tests: FAILED"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "✓ Frontend tests: PASSED"
else
    echo "✗ Frontend tests: FAILED"
fi

echo
if [ $BACKEND_EXIT_CODE -eq 0 ] && [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "❌ Some tests failed. Please check the output above."
    exit 1
fi
