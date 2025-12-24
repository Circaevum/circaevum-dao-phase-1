#!/bin/bash

# Circaevum DAO Problem Completion Script
# Usage: ./complete-problem.sh PROBLEM-YIN-004 COMMIT_HASH "Description"

set -e

PROBLEM_ID="$1"
COMMIT_HASH="$2"
DESCRIPTION="$3"

if [ -z "$PROBLEM_ID" ] || [ -z "$COMMIT_HASH" ] || [ -z "$DESCRIPTION" ]; then
    echo "Usage: ./complete-problem.sh PROBLEM-YIN-004 COMMIT_HASH \"Description\""
    exit 1
fi

# Validate problem ID format
if [[ ! $PROBLEM_ID =~ ^PROBLEM-(YIN|YANG|TAIJI)-[0-9]{3}$ ]]; then
    echo "Error: Problem ID must match format PROBLEM-TYPE-XXX"
    exit 1
fi

# Validate commit hash format
if [[ ! $COMMIT_HASH =~ ^[a-f0-9]{8,}$ ]]; then
    echo "Error: Invalid commit hash format"
    exit 1
fi

# Extract problem type and number
PROBLEM_TYPE=$(echo $PROBLEM_ID | cut -d'-' -f2)
PROBLEM_NUM=$(echo $PROBLEM_ID | cut -d'-' -f3)

# Determine token type
case $PROBLEM_TYPE in
    YIN) TOKEN_TYPE="YIN" ;;
    YANG) TOKEN_TYPE="YANG" ;;
    TAIJI) TOKEN_TYPE="TAIJI" ;;
    *) echo "Error: Invalid problem type"; exit 1 ;;
esac

# Generate commit message
COMMIT_MESSAGE="$PROBLEM_ID COMPLETED: $DESCRIPTION

- Problem: $PROBLEM_ID
- Type: $PROBLEM_TYPE
- Status: COMPLETED
- Token: $TOKEN_TYPE-$PROBLEM_NUM
- Commit: $COMMIT_HASH"

# Generate README update
README_UPDATE="
- ✅ **$PROBLEM_ID** ([$COMMIT_HASH](https://github.com/Circaevum/TimeBox/commit/$COMMIT_HASH))"

echo "✅ Problem marked as completed!"
echo ""
echo "Problem ID: $PROBLEM_ID"
echo "Commit Hash: $COMMIT_HASH"
echo "Token Awarded: $TOKEN_TYPE-$PROBLEM_NUM"
echo ""
echo "Generated commit message:"
echo "---"
echo "$COMMIT_MESSAGE"
echo "---"
echo ""
echo "README.md update:"
echo "$README_UPDATE"
echo ""
echo "Next steps:"
echo "1. Update the problem registry status to COMPLETED"
echo "2. Add the README update to the completed problems section"
echo "3. Award the $TOKEN_TYPE-$PROBLEM_NUM token"
echo "4. Update version numbers if needed"
