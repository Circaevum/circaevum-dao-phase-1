#!/bin/bash

# Circaevum DAO Problem Tracking Script
# Usage: ./track-problem.sh PROBLEM-YIN-005 "Problem Title"

set -e

PROBLEM_ID="$1"
PROBLEM_TITLE="$2"

if [ -z "$PROBLEM_ID" ] || [ -z "$PROBLEM_TITLE" ]; then
    echo "Usage: ./track-problem.sh PROBLEM-YIN-005 \"Problem Title\""
    exit 1
fi

# Validate problem ID format
if [[ ! $PROBLEM_ID =~ ^PROBLEM-(YIN|YANG|TAIJI)-[0-9]{3}$ ]]; then
    echo "Error: Problem ID must match format PROBLEM-TYPE-XXX"
    echo "Types: YIN, YANG, TAIJI"
    echo "Example: PROBLEM-YIN-005"
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

# Create problem entry
PROBLEM_ENTRY="
- \`$PROBLEM_ID\`: $PROBLEM_TITLE 📋 PLANNED
  - **Versions**: [Future development]
  - **Commits**: [Future development]
  - **Token**: $TOKEN_TYPE-$PROBLEM_NUM pending
  - **Description**: $PROBLEM_TITLE"

echo "✅ Problem tracked successfully!"
echo ""
echo "Problem ID: $PROBLEM_ID"
echo "Title: $PROBLEM_TITLE"
echo "Type: $PROBLEM_TYPE"
echo "Token: $TOKEN_TYPE-$PROBLEM_NUM"
echo ""
echo "Add this entry to the problem registry:"
echo "$PROBLEM_ENTRY"
echo ""
echo "Next steps:"
echo "1. Add this problem to the README.md current problems section"
echo "2. Update the problem registry in problem-tracking-system.md"
echo "3. Create a commit with this problem ID when development begins"
