#!/bin/bash

# Circaevum DAO Commit Tracker
# Advanced progress tracking with quarter/year and dot-level contribution codes
# Usage: ./commit-tracker.sh [command] [args]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Problem types and their symbols (using functions instead of associative arrays)
get_problem_symbol() {
    case "$1" in
        "YIN") echo "🔧" ;;
        "YANG") echo "🎨" ;;
        "TAIJI") echo "⚖️" ;;
        *) echo "❓" ;;
    esac
}

get_progress_symbol() {
    case "$1" in
        "PLANNED") echo "📋" ;;
        "STARTED") echo "🚀" ;;
        "IN_PROGRESS") echo "🔄" ;;
        "TESTING") echo "🧪" ;;
        "COMPLETED") echo "✅" ;;
        "BLOCKED") echo "🚫" ;;
        *) echo "❓" ;;
    esac
}

get_branch_symbol() {
    case "$1" in
        "main") echo "🌳" ;;
        "feature") echo "🌿" ;;
        "bugfix") echo "🐛" ;;
        "hotfix") echo "🔥" ;;
        "release") echo "🏷️" ;;
        *) echo "🌿" ;;
    esac
}

# Initialize problem registry file
PROBLEM_REGISTRY="problem-registry.json"

# Dot structure: 18 YANG + 18 YIN + 1 TAIJI = 37 total dots
# YANG_NEW: 18 (positions 1-18)
# YANG_UPKEEP: 18 (positions 19-36)
# TAIJI: 1 (position 37)
# YIN_NEW: 18 (positions 38-55)
# YIN_UPKEEP: 18 (positions 56-73)

init_registry() {
    if [ ! -f "$PROBLEM_REGISTRY" ]; then
        cat > "$PROBLEM_REGISTRY" << EOF
{
    "problems": {},
    "branches": {},
    "tokens": {},
    "dot_progress": {},
    "last_updated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
        echo -e "${GREEN}✅ Problem registry initialized${NC}"
    fi
}

# Get current quarter and year
get_current_quarter() {
    local month=$(date +%m)
    local year=$(date +%y)
    
    case $month in
        01|02|03) echo "${year}Q1" ;;
        04|05|06) echo "${year}Q2" ;;
        07|08|09) echo "${year}Q3" ;;
        10|11|12) echo "${year}Q4" ;;
    esac
}

# Generate semantic version number in CalVer style: vYY.Q.TT (TT = zero-padded TAIJI)
generate_semantic_version() {
    local quarter_year="$1"
    local taiji="$2"
    
    # Parse quarter
    local year=$(echo "$quarter_year" | cut -c1-2)
    local quarter=$(echo "$quarter_year" | cut -c3-4)
    
    # Convert quarter to number (Q1=1, Q2=2, Q3=3, Q4=4)
    local quarter_num=${quarter#Q}
    
    # Version format: vYY.Q.TT (Calendar-based Versioning)
    echo "v${year}.${quarter_num}.$(printf "%02d" $taiji)"
}

# Generate detailed version code (long form for commit history)
generate_detailed_version() {
    local quarter_year="$1"
    local yang_center="$2"
    local yang_new="$3"
    local yang_upkeep="$4"
    local taiji="$5"
    local yin_center="$6"
    local yin_new="$7"
    local yin_upkeep="$8"
    
    # Parse quarter
    local year=$(echo "$quarter_year" | cut -c1-2)
    local quarter=$(echo "$quarter_year" | cut -c3-4)
    local quarter_num=${quarter#Q}
    
    # Detailed version format (CalVer + 6-6-1 per side, TAIJI in between)
    echo "v${year}.${quarter_num}.$(printf "%02d" $taiji) ${yang_new}-${yang_upkeep}-${yang_center} ${taiji} ${yin_new}-${yin_upkeep}-${yin_center}"
}

# Get versions for current quarter
get_current_versions() {
    local quarter_year=$(get_current_quarter)
    local progress=$(calculate_accumulated_progress "$quarter_year")
    
    # Parse progress to get components
    IFS=' ' read -ra PARTS <<< "$progress"
    local yang_section="${PARTS[1]}"
    local taiji="${PARTS[2]}"
    local yin_section="${PARTS[3]}"
    
    # Parse YANG section (center-new-upkeep)
    IFS='-' read -ra YANG_PARTS <<< "$yang_section"
    local yang_center="${YANG_PARTS[0]}"
    local yang_new="${YANG_PARTS[1]}"
    local yang_upkeep="${YANG_PARTS[2]}"
    
    # Parse YIN section (center-new-upkeep)
    IFS='-' read -ra YIN_PARTS <<< "$yin_section"
    local yin_center="${YIN_PARTS[0]}"
    local yin_new="${YIN_PARTS[1]}"
    local yin_upkeep="${YIN_PARTS[2]}"
    
    # Generate both versions
    local semantic_version=$(generate_semantic_version "$quarter_year" "$taiji")
    local detailed_version=$(generate_detailed_version "$quarter_year" "$yang_center" "$yang_new" "$yang_upkeep" "$taiji" "$yin_center" "$yin_new" "$yin_upkeep")
    
    echo "$semantic_version|$detailed_version"
}

# Generate dot progress code with detailed section tracking
generate_dot_progress_code() {
    local quarter_year="$1"
    local yang_center="$2"   # 1 digit (0-9) - central dot in YANG area
    local yang_new="$3"      # 6 digits (000000-999999)
    local yang_upkeep="$4"   # 6 digits (000000-999999)
    local taiji_center="$5"  # 1 digit (0-9) - main central TAIJI dot
    local yin_center="$6"    # 1 digit (0-9) - central dot in YIN area
    local yin_new="$7"       # 6 digits (000000-999999)
    local yin_upkeep="$8"    # 6 digits (000000-999999)
    
    # Internal format (center-new-upkeep) kept for accumulation; display will be 6-6-1
    echo "${quarter_year} ${yang_center}-${yang_new}-${yang_upkeep} ${taiji_center} ${yin_center}-${yin_new}-${yin_upkeep}"
}

# Calculate accumulated dot progress from registry
calculate_accumulated_progress() {
    local quarter_year="$1"
    
    # Initialize section totals
    local yang_center_total="0"
    local yang_new_total="000000"
    local yang_upkeep_total="000000"
    local taiji_center_total="0"
    local yin_center_total="0"
    local yin_new_total="000000"
    local yin_upkeep_total="000000"
    
    # This would read from the actual registry in practice
    # For now, return a sample accumulation
    case $quarter_year in
        "25Q1")
            echo "${quarter_year} 0-001000-000000 9 0-009000-000000"
            ;;
        "25Q2")
            echo "${quarter_year} 1-002000-001000 8 1-018000-002000"
            ;;
        "25Q3")
            echo "${quarter_year} 2-003000-002000 7 2-027000-003000"
            ;;
        *)
            echo "${quarter_year} 0-000000-000000 0 0-000000-000000"
            ;;
    esac
}

# Update dot progress with new contribution
update_dot_progress() {
    local current_progress="$1"
    local dot_position="$2"
    local contribution="$3"
    
    # Parse current progress
    IFS=' ' read -ra PARTS <<< "$current_progress"
    local quarter="${PARTS[0]}"
    local yang_section="${PARTS[1]}"
    local taiji_center="${PARTS[2]}"
    local yin_section="${PARTS[3]}"
    
    # Parse YANG section (center-new-upkeep)
    IFS='-' read -ra YANG_PARTS <<< "$yang_section"
    local yang_center="${YANG_PARTS[0]}"
    local yang_new="${YANG_PARTS[1]}"
    local yang_upkeep="${YANG_PARTS[2]}"
    
    # Parse YIN section (center-new-upkeep)
    IFS='-' read -ra YIN_PARTS <<< "$yin_section"
    local yin_center="${YIN_PARTS[0]}"
    local yin_new="${YIN_PARTS[1]}"
    local yin_upkeep="${YIN_PARTS[2]}"
    
    # Update based on dot position
    if [ "$dot_position" -eq 18 ]; then
        # YANG Center (position 18) - central dot in YANG area
        yang_center=$((yang_center + contribution))
        if [ "$yang_center" -gt 9 ]; then yang_center=9; fi
    elif [ "$dot_position" -le 17 ]; then
        # YANG New (positions 1-17)
        local current_value=$(echo "$yang_new" | sed 's/^0*//')
        current_value=${current_value:-0}
        local new_value=$((current_value + contribution))
        yang_new=$(printf "%06d" $new_value)
    elif [ "$dot_position" -le 35 ]; then
        # YANG Upkeep (positions 19-35)
        local current_value=$(echo "$yang_upkeep" | sed 's/^0*//')
        current_value=${current_value:-0}
        local new_value=$((current_value + contribution))
        yang_upkeep=$(printf "%06d" $new_value)
    elif [ "$dot_position" -eq 37 ]; then
        # TAIJI Center (position 37) - main central TAIJI dot
        taiji_center=$((taiji_center + contribution))
        if [ "$taiji_center" -gt 9 ]; then taiji_center=9; fi
    elif [ "$dot_position" -eq 55 ]; then
        # YIN Center (position 55) - central dot in YIN area
        yin_center=$((yin_center + contribution))
        if [ "$yin_center" -gt 9 ]; then yin_center=9; fi
    elif [ "$dot_position" -le 54 ]; then
        # YIN New (positions 38-54)
        local current_value=$(echo "$yin_new" | sed 's/^0*//')
        current_value=${current_value:-0}
        local new_value=$((current_value + contribution))
        yin_new=$(printf "%06d" $new_value)
    else
        # YIN Upkeep (positions 56-73)
        local current_value=$(echo "$yin_upkeep" | sed 's/^0*//')
        current_value=${current_value:-0}
        local new_value=$((current_value + contribution))
        yin_upkeep=$(printf "%06d" $new_value)
    fi
    
    echo "${quarter} ${yang_center}-${yang_new}-${yang_upkeep} ${taiji_center} ${yin_center}-${yin_new}-${yin_upkeep}"
}

# Generate human-interpretable progress code
generate_progress_code() {
    local problem_type="$1"
    local problem_num="$2"
    local status="$3"
    local branch="$4"
    local dot_position="$5"
    local contribution_value="$6"
    
    local symbol=$(get_problem_symbol "$problem_type")
    local status_symbol=$(get_progress_symbol "$status")
    local branch_symbol=$(get_branch_symbol "$branch")
    
    # Format: 🔧YIN-001✅🌳@37:8 (problem@dot_position:contribution)
    echo "${symbol}${problem_type}-${problem_num}${status_symbol}${branch_symbol}@${dot_position}:${contribution_value}"
}

# Parse dot progress code
parse_dot_progress() {
    local code="$1"
    
    # Split by dashes
    IFS='-' read -ra PARTS <<< "$code"
    
    if [ ${#PARTS[@]} -ne 6 ]; then
        echo -e "${RED}❌ Invalid dot progress code format${NC}"
        return 1
    fi
    
    local quarter_year="${PARTS[0]}"
    local yang_new="${PARTS[1]}"
    local yang_upkeep="${PARTS[2]}"
    local taiji="${PARTS[3]}"
    local yin_new="${PARTS[4]}"
    local yin_upkeep="${PARTS[5]}"
    
    echo "Quarter: $quarter_year"
    echo "YANG New: $yang_new"
    echo "YANG Upkeep: $yang_upkeep"
    echo "TAIJI: $taiji"
    echo "YIN New: $yin_new"
    echo "YIN Upkeep: $yin_upkeep"
}

# Calculate dot position based on problem type and number
calculate_dot_position() {
    local problem_type="$1"
    local problem_num="$2"
    
    case $problem_type in
        "YANG")
            if [ "$problem_num" -le 35 ]; then
                echo "$problem_num"  # Map directly: 1-17 New, 18 Center, 19-35 Upkeep
            else
                echo "0"
            fi
            ;;
        "YIN")
            if [ "$problem_num" -le 18 ]; then
                echo "$((problem_num + 37))"  # YIN New (positions 38-55)
            else
                echo "$((problem_num - 18 + 55))"  # YIN Upkeep (positions 56-73)
            fi
            ;;
        "TAIJI")
            echo "37"  # TAIJI position (always 37)
            ;;
        *)
            echo "0"
            ;;
    esac
}

# Add or update a problem
track_problem() {
    local problem_id="$1"
    local title="$2"
    local status="${3:-PLANNED}"
    local branch="${4:-main}"
    local contribution="${5:-0}"
    
    # Validate problem ID format
    if [[ ! $problem_id =~ ^PROBLEM-(YIN|YANG|TAIJI)-[0-9]{3}$ ]]; then
        echo -e "${RED}❌ Invalid problem ID format. Use: PROBLEM-TYPE-XXX${NC}"
        exit 1
    fi
    
    # Extract components
    local problem_type=$(echo $problem_id | cut -d'-' -f2)
    local problem_num=$(echo $problem_id | cut -d'-' -f3)
    local dot_position=$(calculate_dot_position "$problem_type" "$problem_num")
    
    # Generate progress codes
    local progress_code=$(generate_progress_code "$problem_type" "$problem_num" "$status" "$branch" "$dot_position" "$contribution")
    local quarter_year=$(get_current_quarter)
    
    # Create problem entry
    local problem_entry=$(cat << EOF
{
    "id": "$problem_id",
    "title": "$title",
    "type": "$problem_type",
    "status": "$status",
    "branch": "$branch",
    "dot_position": "$dot_position",
    "contribution": "$contribution",
    "progress_code": "$progress_code",
    "quarter_year": "$quarter_year",
    "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "updated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "commits": [],
    "token": "${problem_type}-${problem_num}"
}
EOF
)
    
    echo -e "${GREEN}✅ Problem tracked: $progress_code${NC}"
    echo "Problem: $title"
    echo "Status: $status"
    echo "Branch: $branch"
    echo "Dot Position: $dot_position"
    echo "Contribution: $contribution"
    echo "Token: ${problem_type}-${problem_num}"
    echo "Quarter: $quarter_year"
}

# Update problem status and contribution
update_status() {
    local problem_id="$1"
    local new_status="$2"
    local contribution="${3:-0}"
    local commit_hash="${4:-}"
    local branch="${5:-main}"
    
    # Validate status
    case $new_status in
        PLANNED|STARTED|IN_PROGRESS|TESTING|COMPLETED|BLOCKED) ;;
        *)
            echo -e "${RED}❌ Invalid status. Use: PLANNED, STARTED, IN_PROGRESS, TESTING, COMPLETED, BLOCKED${NC}"
            exit 1
            ;;
    esac
    
    # Extract components
    local problem_type=$(echo $problem_id | cut -d'-' -f2)
    local problem_num=$(echo $problem_id | cut -d'-' -f3)
    local dot_position=$(calculate_dot_position "$problem_type" "$problem_num")
    
    # Generate new progress code
    local progress_code=$(generate_progress_code "$problem_type" "$problem_num" "$new_status" "$branch" "$dot_position" "$contribution")
    
    echo -e "${GREEN}✅ Status updated: $progress_code${NC}"
    echo "Contribution: $contribution"
    
    if [ "$new_status" = "COMPLETED" ] && [ -n "$commit_hash" ]; then
        echo -e "${PURPLE}🎉 Problem completed! Token ${problem_type}-${problem_num} awarded${NC}"
        echo "Commit: $commit_hash"
    fi
}

# Generate commit message with dot progress
generate_commit() {
    local problem_id="$1"
    local action="$2"
    local description="$3"
    local contribution="${4:-0}"
    local branch="${5:-main}"
    local additional_dots="${6:-}"
    
    # Extract components
    local problem_type=$(echo $problem_id | cut -d'-' -f2)
    local problem_num=$(echo $problem_id | cut -d'-' -f3)
    local dot_position=$(calculate_dot_position "$problem_type" "$problem_num")
    local progress_code=$(generate_progress_code "$problem_type" "$problem_num" "$action" "$branch" "$dot_position" "$contribution")
    local quarter_year=$(get_current_quarter)
    
    # Generate accumulated dot progress code and version
    local dot_progress=$(calculate_accumulated_progress "$quarter_year")
    
    # Parse dot progress to get values for versions
    IFS=' ' read -ra PARTS <<< "$dot_progress"
    local yang_section="${PARTS[1]}"
    local taiji="${PARTS[2]}"
    local yin_section="${PARTS[3]}"
    
    # Parse YANG section (center-new-upkeep)
    IFS='-' read -ra YANG_PARTS <<< "$yang_section"
    local yang_center="${YANG_PARTS[0]}"
    local yang_new="${YANG_PARTS[1]}"
    local yang_upkeep="${YANG_PARTS[2]}"
    
    # Parse YIN section (center-new-upkeep)
    IFS='-' read -ra YIN_PARTS <<< "$yin_section"
    local yin_center="${YIN_PARTS[0]}"
    local yin_new="${YIN_PARTS[1]}"
    local yin_upkeep="${YIN_PARTS[2]}"
    
    local semantic_version=$(generate_semantic_version "$quarter_year" "$taiji")
    local detailed_version=$(generate_detailed_version "$quarter_year" "$yang_center" "$yang_new" "$yang_upkeep" "$taiji" "$yin_center" "$yin_new" "$yin_upkeep")

    # Display dot progress in 6-6-1 per side with TAIJI between
    local dot_progress_display="${quarter_year} ${yang_new}-${yang_upkeep}-${yang_center} ${taiji} ${yin_new}-${yin_upkeep}-${yin_center}"
    
    # Generate commit message
    local commit_message="$progress_code $description

- Problem: $problem_id
- Action: $action
- Branch: $branch
- Dot Position: $dot_position
- Contribution: $contribution
- Token: ${problem_type}-${problem_num}
- Quarter: $quarter_year
- Semantic Version: $semantic_version
- Detailed Version: $detailed_version
- Dot Progress: $dot_progress_display"

    # Add additional dots if specified
    if [ -n "$additional_dots" ]; then
        commit_message="$commit_message
- Additional Dots: $additional_dots"
    fi

    echo -e "${CYAN}📝 Generated commit message:${NC}"
    echo "---"
    echo "$commit_message"
    echo "---"
    echo ""
    # Concise subject for git log: vYY.Q.TT <YANG_new>-<YANG_upkeep>-<YANG_center> <TAIJI> <YIN_new>-<YIN_upkeep>-<YIN_center> <desc>
    local subject_dot_progress="${yang_new}-${yang_upkeep}-${yang_center} ${taiji} ${yin_new}-${yin_upkeep}-${yin_center}"
    local concise_subject="${semantic_version} ${subject_dot_progress} ${description}"
    echo -e "${YELLOW}To use:${NC}"
    echo "git commit -m \"$concise_subject\""
    echo ""
    echo -e "${BLUE}Dot Progress Code:${NC}"
    echo "$dot_progress"
}

# Generate multi-dot commit message
generate_multi_dot_commit() {
    local primary_problem_id="$1"
    local action="$2"
    local description="$3"
    local dot_changes="$4"
    local branch="${5:-main}"
    
    # Parse dot changes (format: "38:5,1:3,37:2" for dot:contribution pairs)
    local quarter_year=$(get_current_quarter)
    local yang_new="000000"
    local yang_upkeep="000000"
    local taiji="0"
    local yin_new="000000"
    local yin_upkeep="000000"
    
    # Process each dot change
    IFS=',' read -ra CHANGES <<< "$dot_changes"
    local change_summary=""
    
    for change in "${CHANGES[@]}"; do
        IFS=':' read -ra PARTS <<< "$change"
        local dot_pos="${PARTS[0]}"
        local contribution="${PARTS[1]}"
        
        # Determine which section this dot belongs to and update accordingly
        if [ "$dot_pos" -eq 18 ]; then
            # YANG Center (position 18) - central dot in YANG area
            change_summary="$change_summary YANG-Center@$dot_pos:$contribution"
        elif [ "$dot_pos" -le 17 ]; then
            # YANG New (positions 1-17)
            change_summary="$change_summary YANG-New@$dot_pos:$contribution"
        elif [ "$dot_pos" -le 35 ]; then
            # YANG Upkeep (positions 19-35)
            change_summary="$change_summary YANG-Upkeep@$dot_pos:$contribution"
        elif [ "$dot_pos" -eq 37 ]; then
            # TAIJI Center (position 37) - main central TAIJI dot
            change_summary="$change_summary TAIJI-Center@$dot_pos:$contribution"
        elif [ "$dot_pos" -eq 55 ]; then
            # YIN Center (position 55) - central dot in YIN area
            change_summary="$change_summary YIN-Center@$dot_pos:$contribution"
        elif [ "$dot_pos" -le 54 ]; then
            # YIN New (positions 38-54)
            change_summary="$change_summary YIN-New@$dot_pos:$contribution"
        else
            # YIN Upkeep (positions 56-73)
            change_summary="$change_summary YIN-Upkeep@$dot_pos:$contribution"
        fi
    done
    
    # Generate accumulated dot progress code and version for this commit
    local commit_dot_progress=$(calculate_accumulated_progress "$quarter_year")
    
    # Parse dot progress to get values for versions
    IFS=' ' read -ra PARTS <<< "$commit_dot_progress"
    local yang_section="${PARTS[1]}"
    local taiji="${PARTS[2]}"
    local yin_section="${PARTS[3]}"
    
    # Parse YANG section (center-new-upkeep)
    IFS='-' read -ra YANG_PARTS <<< "$yang_section"
    local yang_center="${YANG_PARTS[0]}"
    local yang_new="${YANG_PARTS[1]}"
    local yang_upkeep="${YANG_PARTS[2]}"
    
    # Parse YIN section (center-new-upkeep)
    IFS='-' read -ra YIN_PARTS <<< "$yin_section"
    local yin_center="${YIN_PARTS[0]}"
    local yin_new="${YIN_PARTS[1]}"
    local yin_upkeep="${YIN_PARTS[2]}"
    
    local semantic_version=$(generate_semantic_version "$quarter_year" "$taiji")
    local detailed_version=$(generate_detailed_version "$quarter_year" "$yang_center" "$yang_new" "$yang_upkeep" "$taiji" "$yin_center" "$yin_new" "$yin_upkeep")
    
    # Generate commit message
    local commit_message="🌐MULTI-DOT $description

- Primary Problem: $primary_problem_id
- Action: $action
- Branch: $branch
- Quarter: $quarter_year
- Semantic Version: $semantic_version
- Detailed Version: $detailed_version
- Dot Changes: $change_summary
    # Display-friendly commit dot progress
    local commit_dot_progress_display="${quarter_year} ${yang_new}-${yang_upkeep}-${yang_center} ${taiji} ${yin_new}-${yin_upkeep}-${yin_center}"

- Commit Dot Progress: $commit_dot_progress_display"

    echo -e "${CYAN}📝 Generated multi-dot commit message:${NC}"
    echo "---"
    echo "$commit_message"
    echo "---"
    echo ""
    # Concise subject for multi-dot as well
    local subject_dot_progress="${yang_new}-${yang_upkeep}-${yang_center} ${taiji} ${yin_new}-${yin_upkeep}-${yin_center}"
    local concise_subject="${semantic_version} ${subject_dot_progress} ${description}"
    echo -e "${YELLOW}To use:${NC}"
    echo "git commit -m \"$concise_subject\""
    echo ""
    echo -e "${BLUE}Commit Dot Progress Code:${NC}"
    echo "$commit_dot_progress"
    echo ""
    echo -e "${PURPLE}📋 Change Summary:${NC}"
    echo "$change_summary"
}

# Show progress dashboard with dot progress
show_dashboard() {
    echo -e "${BLUE}🌐 Circaevum DAO Progress Dashboard${NC}"
    echo "=================================="
    echo ""
    
    local quarter_year=$(get_current_quarter)
    echo -e "${CYAN}📅 Current Quarter: $quarter_year${NC}"
    echo ""
    
    # Show by problem type with dot positions
    for type in YIN YANG TAIJI; do
        local symbol=$(get_problem_symbol "$type")
        echo -e "${CYAN}${symbol} $type Problems:${NC}"
        
        # This would read from the registry in practice
        case $type in
            YIN)
                echo "  🔧YIN-001✅🌳@38:8 Nakama Device Authentication"
                echo "  🔧YIN-002✅🌳@39:9 Google Calendar Integration"
                echo "  🔧YIN-003✅🌳@40:7 Sleep Data Visualization"
                echo "  🔧YIN-004🔄🌿@41:5 Mobile Device Optimization"
                ;;
            YANG)
                echo "  🎨YANG-001✅🌳@1:9 Space Station Memory Palace UI"
                echo "  🎨YANG-002📋🌿@2:0 ISS Data Pod Visualization"
                echo "  🎨YANG-003📋🌿@3:0 User Login Flow Enhancement"
                ;;
            TAIJI)
                echo "  ⚖️TAIJI-001✅🌳@37:8 Space Station Memory Palace Architecture"
                ;;
        esac
        echo ""
    done
    
    # Show dot progress summary
    echo -e "${CYAN}🎯 Dot Progress Summary:${NC}"
    echo "  YANG New (1-18): 1 completed, 2 planned"
    echo "  YANG Upkeep (19-36): 0 active"
    echo "  TAIJI (37): 1 completed"
    echo "  YIN New (38-55): 3 completed, 1 in progress"
    echo "  YIN Upkeep (56-73): 0 active"
    echo ""
    
    # Show current dot progress code and versions
    local current_dot_progress=$(calculate_accumulated_progress "$quarter_year")
    local versions=$(get_current_versions)
    IFS='|' read -ra VERSION_PARTS <<< "$versions"
    local semantic_version="${VERSION_PARTS[0]}"
    local detailed_version="${VERSION_PARTS[1]}"
    
    # Parse for display
    IFS=' ' read -ra PARTS <<< "$current_dot_progress"
    local yang_section_d="${PARTS[1]}"
    local taiji_d="${PARTS[2]}"
    local yin_section_d="${PARTS[3]}"
    IFS='-' read -ra YANG_D <<< "$yang_section_d"
    IFS='-' read -ra YIN_D <<< "$yin_section_d"
    local dot_progress_display="${quarter_year} ${YANG_D[1]}-${YANG_D[2]}-${YANG_D[0]} ${taiji_d} ${YIN_D[1]}-${YIN_D[2]}-${YIN_D[0]}"
    echo -e "${CYAN}📊 Current Dot Progress Code:${NC}"
    echo "  $dot_progress_display"
    echo -e "${CYAN}🏷️ Semantic Version:${NC}"
    echo "  $semantic_version"
    echo -e "${CYAN}📋 Detailed Version:${NC}"
    echo "  $detailed_version"
    echo ""
    
    # Show token summary
    echo -e "${CYAN}🏆 Tokens Awarded:${NC}"
    echo "  YIN: 3 tokens (001, 002, 003)"
    echo "  YANG: 1 token (001)"
    echo "  TAIJI: 1 token (001)"
    echo ""
}

# Show help
show_help() {
    echo -e "${BLUE}Circaevum DAO Commit Tracker${NC}"
    echo "================================"
    echo ""
    echo "Usage: ./commit-tracker.sh [command] [args]"
    echo ""
    echo "Commands:"
    echo "  track <problem_id> <title> [status] [branch] [contribution]"
    echo "    Track a new problem"
    echo "    Example: ./commit-tracker.sh track PROBLEM-YIN-005 \"Adaptive Rendering\""
    echo ""
    echo "  update <problem_id> <status> [contribution] [commit_hash] [branch]"
    echo "    Update problem status and contribution"
    echo "    Example: ./commit-tracker.sh update PROBLEM-YIN-004 COMPLETED 8 abc123"
    echo ""
    echo "  commit <problem_id> <action> <description> [contribution] [branch]"
    echo "    Generate commit message"
    echo "    Example: ./commit-tracker.sh commit PROBLEM-YIN-004 IN_PROGRESS \"Working on mobile\" 5"
    echo ""
    echo "  multi-dot <primary_problem_id> <action> <description> <dot_changes> [branch]"
    echo "    Generate multi-dot commit message for coordinated changes"
    echo "    Example: ./commit-tracker.sh multi-dot PROBLEM-YIN-004 IN_PROGRESS \"Mobile+UI sync\" \"38:5,1:3,37:2\""
    echo ""
    echo "  dashboard"
    echo "    Show progress dashboard"
    echo ""
    echo "  help"
    echo "    Show this help"
    echo ""
    echo "Progress Codes:"
    echo "  🔧YIN-XXX - Backend problems"
    echo "  🎨YANG-XXX - Frontend problems"
    echo "  ⚖️TAIJI-XXX - Coordination problems"
    echo ""
    echo "Dot Progress Code Format:"
    echo "  25Q3 001000-000000-0 8 027000-003000-2"
    echo "  Quarter YANG_New-Upkeep-Center TAIJI YIN_New-Upkeep-Center"
    echo ""
    echo "Contribution Values:"
    echo "  0-9: Individual dot progress/contribution level"
    echo "  Higher values = more progress/contribution"
}

# Main command handler
main() {
    local command="$1"
    
    case $command in
        "track")
            if [ $# -lt 3 ]; then
                echo -e "${RED}❌ Usage: ./commit-tracker.sh track <problem_id> <title> [status] [branch] [contribution]${NC}"
                exit 1
            fi
            track_problem "$2" "$3" "${4:-PLANNED}" "${5:-main}" "${6:-0}"
            ;;
        "update")
            if [ $# -lt 3 ]; then
                echo -e "${RED}❌ Usage: ./commit-tracker.sh update <problem_id> <status> [contribution] [commit_hash] [branch]${NC}"
                exit 1
            fi
            update_status "$2" "$3" "${4:-0}" "${5:-}" "${6:-main}"
            ;;
        "commit")
            if [ $# -lt 4 ]; then
                echo -e "${RED}❌ Usage: ./commit-tracker.sh commit <problem_id> <action> <description> [contribution] [branch]${NC}"
                exit 1
            fi
            generate_commit "$2" "$3" "$4" "${5:-0}" "${6:-main}"
            ;;
        "multi-dot")
            if [ $# -lt 5 ]; then
                echo -e "${RED}❌ Usage: ./commit-tracker.sh multi-dot <primary_problem_id> <action> <description> <dot_changes> [branch]${NC}"
                echo -e "${YELLOW}Example: ./commit-tracker.sh multi-dot PROBLEM-YIN-004 IN_PROGRESS \"Mobile+UI sync\" \"38:5,1:3,37:2\"${NC}"
                exit 1
            fi
            generate_multi_dot_commit "$2" "$3" "$4" "$5" "${6:-main}"
            ;;
        "dashboard")
            show_dashboard
            ;;
        "help"|"")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $command${NC}"
            echo "Use './commit-tracker.sh help' for usage information"
            exit 1
            ;;
    esac
}

# Initialize and run
init_registry
main "$@"
