#!/bin/bash

# Circaevum DAO Commit Message Generator
# Usage: ./generate-commit.sh PROBLEM-YIN-004 IN_PROGRESS "Working on mobile optimization"

set -e

PROBLEM_ID="$1"
STATUS="$2"
DESCRIPTION="$3"

if [ -z "$PROBLEM_ID" ] || [ -z "$STATUS" ] || [ -z "$DESCRIPTION" ]; then
    echo "Usage: ./generate-commit.sh PROBLEM-YIN-004 IN_PROGRESS \"Description\""
    echo ""
    echo "Status options:"
    echo "  IN_PROGRESS - Work in progress"
    echo "  COMPLETED   - Problem solved"
    echo "  BLOCKED     - Work blocked by dependency"
    exit 1
fi

# Validate problem ID format
if [[ ! $PROBLEM_ID =~ ^PROBLEM-(YIN|YANG|TAIJI)-[0-9]{3}$ ]]; then
    echo "Error: Problem ID must match format PROBLEM-TYPE-XXX"
    exit 1
fi

# Validate status
case $STATUS in
    IN_PROGRESS|COMPLETED|BLOCKED) ;;
    *) echo "Error: Status must be IN_PROGRESS, COMPLETED, or BLOCKED"; exit 1 ;;
esac

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
COMMIT_MESSAGE="$PROBLEM_ID $STATUS: $DESCRIPTION

- Problem: $PROBLEM_ID
- Type: $PROBLEM_TYPE
- Status: $STATUS
- Token: $TOKEN_TYPE-$PROBLEM_NUM"

echo "✅ Commit message generated!"
echo ""
echo "Problem ID: $PROBLEM_ID"
echo "Status: $STATUS"
echo "Token: $TOKEN_TYPE-$PROBLEM_NUM"
echo ""
echo "Generated commit message:"
echo "---"
echo "$COMMIT_MESSAGE"
echo "---"
echo ""
echo "To use this commit message:"
echo "1. Copy the message above"
echo "2. Use: git commit -m \"$PROBLEM_ID $STATUS: $DESCRIPTION\""
echo "3. Or use: git commit -F - (then paste the full message)"
echo ""
echo "Note: For completed problems, use complete-problem.sh instead"
