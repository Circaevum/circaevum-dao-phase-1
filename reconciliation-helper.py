#!/usr/bin/env python3
"""
Quarterly Reconciliation Helper Script
=====================================

This script helps automate the quarterly reconciliation process between
the Circaevum DAO README.md and TimeBox CHANGELOG.md.

Usage:
    python reconciliation-helper.py [quarter] [year]
    
Example:
    python reconciliation-helper.py Q2 2025
"""

import os
import sys
import re
from datetime import datetime
from pathlib import Path

class ReconciliationHelper:
    def __init__(self, quarter, year):
        self.quarter = quarter.upper()
        self.year = year
        self.quarter_num = int(self.quarter[1])
        self.quarter_name = f"{self.quarter} {self.year}"
        
        # File paths
        self.readme_path = Path("README.md")
        self.changelog_path = Path("../TimeBox/CHANGELOG.md")
        self.reconciliation_path = Path("quarterly-reconciliation.md")
        
        # Quarter mapping
        self.quarter_months = {
            1: ("January", "March"),
            2: ("April", "June"), 
            3: ("July", "September"),
            4: ("October", "December")
        }
        
        # Version ranges for quarters
        self.version_ranges = {
            1: "v0.4.07-v0.4.09",
            2: "v0.4.10-v0.4.12", 
            3: "v0.4.13-v0.4.15",
            4: "v0.4.16-v0.4.18"
        }

    def validate_quarter(self):
        """Validate quarter format and year."""
        if not re.match(r'Q[1-4]', self.quarter):
            raise ValueError("Quarter must be Q1, Q2, Q3, or Q4")
        
        if not (2025 <= self.year <= 2030):
            raise ValueError("Year must be between 2025 and 2030")

    def get_quarter_dates(self):
        """Get start and end dates for the quarter."""
        start_month, end_month = self.quarter_months[self.quarter_num]
        return f"{start_month} {self.year}", f"{end_month} {self.year}"

    def generate_reconciliation_template(self):
        """Generate a reconciliation template for the current quarter."""
        start_date, end_date = self.get_quarter_dates()
        version_range = self.version_ranges[self.quarter_num]
        
        template = f"""# {self.quarter_name} Reconciliation Template

## Review Checklist
- [ ] Review TimeBox CHANGELOG.md for completed features since last quarter
- [ ] Identify which problems from previous quarter were completed
- [ ] Award YIN tokens for completed backend problems
- [ ] Award YANG tokens for completed frontend problems
- [ ] Update current problems section in README.md
- [ ] Scope next quarter problems based on development velocity
- [ ] Update version numbers to align with quarterly cycles
- [ ] Update reconciliation dates in both documents

## {self.quarter_name} Progress Tracking

**Completed Problems (YIN Tokens Awarded)**:
- [ ] **Problem name** ({version_range})

**In Progress Problems**:
- [ ] **Problem name** (version range)

**Next Quarter Targets**:
- [ ] **Problem name** - Description
- [ ] **Problem name** - Description

## Documentation Updates Required
- [ ] Update README.md current problems section
- [ ] Update CHANGELOG.md quarterly reconciliation summary
- [ ] Update version entries with DAO problem progress
- [ ] Update reconciliation dates
- [ ] Add new problems to next quarter targets

## Token Awards
**YIN Tokens Awarded**: 0
**YANG Tokens Awarded**: 0

## Notes
- Quarter: {self.quarter_name}
- Version Range: {version_range}
- Start Date: {start_date}
- End Date: {end_date}
- Reconciliation Date: {datetime.now().strftime('%B %Y')}
"""
        return template

    def update_reconciliation_file(self):
        """Update the quarterly reconciliation file with new template."""
        template = self.generate_reconciliation_template()
        
        # Read existing file
        if self.reconciliation_path.exists():
            with open(self.reconciliation_path, 'r') as f:
                content = f.read()
            
            # Find the template section and replace it
            pattern = rf"## {self.quarter} {self.year} Reconciliation Template.*?(?=## |$)"
            new_content = re.sub(pattern, template, content, flags=re.DOTALL)
            
            # Update the "Next Reconciliation" date
            next_quarter = self.quarter_num % 4 + 1
            next_year = self.year if self.quarter_num < 4 else self.year + 1
            next_quarter_name = f"Q{next_quarter} {next_year}"
            
            new_content = re.sub(
                r"Next Reconciliation.*?\n",
                f"Next Reconciliation: {next_quarter_name}\n",
                new_content
            )
        else:
            new_content = template
        
        # Write updated content
        with open(self.reconciliation_path, 'w') as f:
            f.write(new_content)
        
        print(f"✅ Updated {self.reconciliation_path} with {self.quarter_name} template")

    def check_file_compatibility(self):
        """Check for compatibility issues between README.md and CHANGELOG.md."""
        issues = []
        
        # Check if files exist
        if not self.readme_path.exists():
            issues.append(f"❌ README.md not found at {self.readme_path}")
        
        if not self.changelog_path.exists():
            issues.append(f"❌ CHANGELOG.md not found at {self.changelog_path}")
        
        if not self.reconciliation_path.exists():
            issues.append(f"❌ quarterly-reconciliation.md not found at {self.reconciliation_path}")
        
        if issues:
            print("Compatibility Issues Found:")
            for issue in issues:
                print(f"  {issue}")
            return False
        
        print("✅ All required files found")
        return True

    def generate_version_suggestions(self):
        """Generate version number suggestions for the quarter."""
        base_version = "0.4"
        start_version = 7 + (self.quarter_num - 1) * 3
        versions = [f"{base_version}.{start_version + i:02d}" for i in range(3)]
        
        print(f"\n📋 Version Suggestions for {self.quarter_name}:")
        print(f"  Start: {versions[0]}")
        print(f"  Middle: {versions[1]}")
        print(f"  End: {versions[2]}")
        
        return versions

    def run(self):
        """Run the reconciliation helper."""
        print(f"🔄 Starting {self.quarter_name} Reconciliation Helper")
        print("=" * 50)
        
        try:
            self.validate_quarter()
            print(f"✅ Validated quarter: {self.quarter_name}")
            
            if not self.check_file_compatibility():
                return
            
            self.update_reconciliation_file()
            self.generate_version_suggestions()
            
            print(f"\n✅ {self.quarter_name} reconciliation template generated successfully!")
            print(f"📝 Next steps:")
            print(f"   1. Review the updated quarterly-reconciliation.md")
            print(f"   2. Complete the checklist items")
            print(f"   3. Update README.md and CHANGELOG.md accordingly")
            print(f"   4. Commit changes with reconciliation summary")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)

def main():
    if len(sys.argv) != 3:
        print("Usage: python reconciliation-helper.py [quarter] [year]")
        print("Example: python reconciliation-helper.py Q2 2025")
        sys.exit(1)
    
    quarter = sys.argv[1]
    year = int(sys.argv[2])
    
    helper = ReconciliationHelper(quarter, year)
    helper.run()

if __name__ == "__main__":
    main()
