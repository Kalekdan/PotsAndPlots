# Quick Guide: Creating Issues from Templates

This guide provides quick commands and scripts to create GitHub issues from the templates.

## 🚀 Quick Start

### Option 1: GitHub Web UI (Easiest)

1. Go to: https://github.com/Kalekdan/PotsAndPlots/issues/new/choose
2. Select a template
3. Fill in any additional details
4. Click "Submit new issue"

### Option 2: GitHub CLI (Batch Creation)

Install GitHub CLI: https://cli.github.com/

```bash
# Authenticate
gh auth login

# Create a single issue from template
gh issue create \
  --title "[FEATURE] Watering Reminders and Notifications" \
  --label "enhancement,feature,high-priority" \
  --body "$(cat .github/ISSUE_TEMPLATE/01-watering-reminders.md | tail -n +7)"
```

### Option 3: Automated Script

Save this as `create-all-issues.sh`:

```bash
#!/bin/bash

# Create all issues from templates
# Usage: ./create-all-issues.sh

echo "Creating issues from templates..."

# Issue #1 - Watering Reminders
gh issue create \
  --title "[FEATURE] Watering Reminders and Notifications" \
  --label "enhancement,feature,high-priority" \
  --body "See .github/ISSUE_TEMPLATE/01-watering-reminders.md for details"

# Issue #2 - Plant Analytics
gh issue create \
  --title "[FEATURE] Plant Analytics and Growth Tracking" \
  --label "enhancement,feature,analytics" \
  --body "See .github/ISSUE_TEMPLATE/02-plant-analytics.md for details"

# Issue #3 - Photo Gallery
gh issue create \
  --title "[FEATURE] Plant Photo Gallery" \
  --label "enhancement,feature,media" \
  --body "See .github/ISSUE_TEMPLATE/03-photo-gallery.md for details"

# Issue #4 - Search & Filter
gh issue create \
  --title "[FEATURE] Search and Filter Plants" \
  --label "enhancement,feature,ux" \
  --body "See .github/ISSUE_TEMPLATE/04-search-filter.md for details"

# Issue #5 - Mobile Optimization
gh issue create \
  --title "[FEATURE] Mobile Optimization and Responsive Design" \
  --label "enhancement,mobile,ux" \
  --body "See .github/ISSUE_TEMPLATE/05-mobile-optimization.md for details"

# Issue #6 - Weather Integration
gh issue create \
  --title "[FEATURE] Weather Integration for Smart Watering" \
  --label "enhancement,feature,integration" \
  --body "See .github/ISSUE_TEMPLATE/06-weather-integration.md for details"

# Issue #7 - Plant History
gh issue create \
  --title "[FEATURE] Plant History and Lifecycle Tracking" \
  --label "enhancement,feature" \
  --body "See .github/ISSUE_TEMPLATE/07-plant-history.md for details"

# Issue #8 - Multi-User Support
gh issue create \
  --title "[FEATURE] Multi-User Support and Authentication" \
  --label "enhancement,feature,security,high-priority" \
  --body "See .github/ISSUE_TEMPLATE/08-multi-user-support.md for details"

# Issue #9 - Production Database
gh issue create \
  --title "[INFRASTRUCTURE] Production Database Setup" \
  --label "infrastructure,database,high-priority" \
  --body "See .github/ISSUE_TEMPLATE/09-database-production.md for details"

# Issue #10 - Deployment & CI/CD
gh issue create \
  --title "[INFRASTRUCTURE] Deployment and CI/CD Pipeline" \
  --label "infrastructure,devops,high-priority" \
  --body "See .github/ISSUE_TEMPLATE/10-deployment-ci-cd.md for details"

# Issue #11 - Documentation
gh issue create \
  --title "[DOCUMENTATION] Comprehensive Documentation" \
  --label "documentation" \
  --body "See .github/ISSUE_TEMPLATE/11-documentation.md for details"

# Issue #12 - Testing Coverage
gh issue create \
  --title "[TESTING] Comprehensive Testing Coverage" \
  --label "testing,quality" \
  --body "See .github/ISSUE_TEMPLATE/12-testing-coverage.md for details"

# Issue #13 - Accessibility
gh issue create \
  --title "[ACCESSIBILITY] WCAG 2.1 AA Compliance" \
  --label "accessibility,ux" \
  --body "See .github/ISSUE_TEMPLATE/13-accessibility.md for details"

# Issue #14 - Performance
gh issue create \
  --title "[PERFORMANCE] Application Performance Optimization" \
  --label "performance,enhancement" \
  --body "See .github/ISSUE_TEMPLATE/14-performance-optimization.md for details"

# Issue #15 - Error Handling
gh issue create \
  --title "[QUALITY] Error Handling and Logging System" \
  --label "quality,infrastructure" \
  --body "See .github/ISSUE_TEMPLATE/15-error-handling.md for details"

# Issue #16 - Data Import/Export
gh issue create \
  --title "[FEATURE] Data Import and Export" \
  --label "enhancement,feature" \
  --body "See .github/ISSUE_TEMPLATE/16-data-import-export.md for details"

# Issue #17 - Plant Care Guides
gh issue create \
  --title "[FEATURE] Plant Care Guides and Encyclopedia" \
  --label "enhancement,feature,content" \
  --body "See .github/ISSUE_TEMPLATE/17-plant-care-guides.md for details"

# Issue #18 - Notifications
gh issue create \
  --title "[FEATURE] Advanced Notifications System" \
  --label "enhancement,feature" \
  --body "See .github/ISSUE_TEMPLATE/18-notifications-system.md for details"

# Issue #19 - Security Audit
gh issue create \
  --title "[SECURITY] Security Audit and Hardening" \
  --label "security,high-priority" \
  --body "See .github/ISSUE_TEMPLATE/19-security-audit.md for details"

# Issue #20 - Internationalization
gh issue create \
  --title "[FEATURE] Internationalization and Localization" \
  --label "enhancement,feature,i18n" \
  --body "See .github/ISSUE_TEMPLATE/20-internationalization.md for details"

# Issue #21 - PWA
gh issue create \
  --title "[FEATURE] Progressive Web App Implementation" \
  --label "enhancement,feature,mobile,pwa" \
  --body "See .github/ISSUE_TEMPLATE/21-pwa-implementation.md for details"

# Issue #22 - Social Sharing
gh issue create \
  --title "[FEATURE] Social Sharing and Community Features" \
  --label "enhancement,feature,social" \
  --body "See .github/ISSUE_TEMPLATE/22-plant-social-sharing.md for details"

# Issue #23 - Backup & Restore
gh issue create \
  --title "[FEATURE] Automated Backup and Restore" \
  --label "enhancement,feature,data-protection" \
  --body "See .github/ISSUE_TEMPLATE/23-backup-restore.md for details"

# Issue #24 - Plant Journal
gh issue create \
  --title "[FEATURE] Plant Journal and Enhanced Notes" \
  --label "enhancement,feature" \
  --body "See .github/ISSUE_TEMPLATE/24-plant-journal.md for details"

echo "✅ All issues created!"
echo "View issues at: https://github.com/Kalekdan/PotsAndPlots/issues"
```

Make it executable:
```bash
chmod +x create-all-issues.sh
```

Run it:
```bash
./create-all-issues.sh
```

## 📋 Priority-Based Creation

### High Priority Issues Only

Create critical issues first:

```bash
# Infrastructure essentials
gh issue create --title "[FEATURE] Multi-User Support and Authentication" --label "enhancement,feature,security,high-priority"
gh issue create --title "[INFRASTRUCTURE] Production Database Setup" --label "infrastructure,database,high-priority"
gh issue create --title "[INFRASTRUCTURE] Deployment and CI/CD Pipeline" --label "infrastructure,devops,high-priority"
gh issue create --title "[SECURITY] Security Audit and Hardening" --label "security,high-priority"

# Core features
gh issue create --title "[FEATURE] Watering Reminders and Notifications" --label "enhancement,feature,high-priority"
```

### Phase-by-Phase Creation

Create issues by development phase:

**Phase 1 - Core Features:**
```bash
gh issue create --title "[FEATURE] Watering Reminders and Notifications" --label "enhancement,feature,high-priority"
gh issue create --title "[FEATURE] Search and Filter Plants" --label "enhancement,feature,ux"
gh issue create --title "[FEATURE] Mobile Optimization and Responsive Design" --label "enhancement,mobile,ux"
```

**Phase 2 - Infrastructure:**
```bash
gh issue create --title "[FEATURE] Multi-User Support and Authentication" --label "enhancement,feature,security,high-priority"
gh issue create --title "[INFRASTRUCTURE] Production Database Setup" --label "infrastructure,database,high-priority"
gh issue create --title "[INFRASTRUCTURE] Deployment and CI/CD Pipeline" --label "infrastructure,devops,high-priority"
```

## 🏷️ Issue Labels Reference

Apply these labels when creating issues:

- `enhancement` - New feature
- `feature` - User-facing feature
- `infrastructure` - DevOps/deployment
- `high-priority` - Critical
- `security` - Security-related
- `testing` - Testing improvements
- `quality` - Code quality
- `ux` - User experience
- `mobile` - Mobile-specific
- `documentation` - Docs

## 📊 Tracking with Milestones

Create milestones for each phase:

```bash
gh api repos/:owner/:repo/milestones \
  -f title="v0.2.0 - Core Features" \
  -f description="Phase 1: Core MVP enhancements" \
  -f due_on="2025-02-01T00:00:00Z"

gh api repos/:owner/:repo/milestones \
  -f title="v0.3.0 - Infrastructure" \
  -f description="Phase 2: User management and production setup" \
  -f due_on="2025-04-01T00:00:00Z"

gh api repos/:owner/:repo/milestones \
  -f title="v1.0.0 - Production Ready" \
  -f description="Production-ready release with quality assurance" \
  -f due_on="2025-08-01T00:00:00Z"
```

## 🎯 Recommended Workflow

1. **Review Templates**: Read through all templates in `.github/ISSUE_TEMPLATE/`
2. **Plan Priorities**: Decide which issues to create first
3. **Create Core Issues**: Start with high-priority infrastructure
4. **Add Labels & Milestones**: Organize issues properly
5. **Assign Owners**: Assign issues to team members
6. **Start Development**: Begin work on highest priority

## 📞 Need Help?

- Templates: `.github/ISSUE_TEMPLATE/`
- Roadmap: `.github/ROADMAP.md`
- Contributing: `.github/CONTRIBUTING.md`
- Guide: `.github/ISSUES_GUIDE.md`

---

**Pro Tip**: You can edit templates at any time. Changes to templates won't affect already-created issues, but will apply to new issues created from the template.
