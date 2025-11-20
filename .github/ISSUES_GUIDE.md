# Guide to Using Issue Templates

This guide explains how to use the issue templates created for PotsAndPlots development.

## 📋 Overview

24 comprehensive issue templates have been created to guide the development of PotsAndPlots into a fully-fledged production application. These templates are organized into 7 development phases as outlined in [ROADMAP.md](./ROADMAP.md).

## 🎯 How to Use These Templates

### For Repository Owners/Maintainers

1. **Review the Templates**
   - All templates are in `.github/ISSUE_TEMPLATE/`
   - Each template follows a consistent structure
   - Templates include YAML frontmatter for GitHub integration

2. **Create Issues from Templates**
   
   **Option A: Via GitHub UI**
   - Go to Issues tab → New Issue
   - Select template from the list
   - Fill in any additional details
   - Apply appropriate labels and assignees
   - Submit the issue

   **Option B: Batch Creation (Recommended)**
   
   You can create all issues at once using GitHub CLI:
   ```bash
   # Install GitHub CLI if not already installed
   # https://cli.github.com/

   # Create issues from templates (example)
   gh issue create --title "[FEATURE] Watering Reminders and Notifications" \
     --body-file .github/ISSUE_TEMPLATE/01-watering-reminders.md \
     --label "enhancement,feature,high-priority"
   ```

   Or use a script to create multiple issues:
   ```bash
   # See create-all-issues.sh (would need to be created)
   ```

3. **Prioritize Issues**
   - Use the roadmap phases to guide prioritization
   - Start with Phase 1 (Core Features) for immediate value
   - Phase 2 (Infrastructure) is critical before production
   - Later phases can be tackled based on user feedback

### For Contributors

1. **Find an Issue to Work On**
   - Browse [Issues](https://github.com/Kalekdan/PotsAndPlots/issues)
   - Look for labels:
     - `good first issue` - Great for first-time contributors
     - `help wanted` - Maintainers seeking help
     - `high-priority` - Important for project

2. **Claim an Issue**
   - Comment on the issue expressing interest
   - Wait for maintainer approval
   - Ask questions if requirements unclear

3. **Follow the Template Structure**
   - Each issue has clear requirements
   - Acceptance criteria define "done"
   - Dependencies list prerequisite work
   - Technical notes provide guidance

4. **Submit Your Work**
   - Follow guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md)
   - Reference the issue in your PR
   - Ensure all acceptance criteria met

## 📊 Issue Template Structure

Each template includes:

### Frontmatter (YAML)
```yaml
---
name: Feature Name
about: Brief description
title: '[LABEL] Title'
labels: ['label1', 'label2']
assignees: []
---
```

### Content Sections

1. **Feature Description**: Overview of what needs to be built
2. **User Story**: Why this feature matters to users
3. **Requirements**: Detailed checklist of tasks
   - Backend changes
   - Frontend changes
   - Additional considerations
4. **Acceptance Criteria**: How to know when it's done
5. **Dependencies**: What needs to be completed first
6. **Technical Notes**: Implementation guidance

## 🏷️ Issue Labels

Issues are tagged with appropriate labels:

- `enhancement` - New feature
- `feature` - User-facing feature
- `infrastructure` - DevOps/deployment
- `database` - Database-related
- `security` - Security improvements
- `testing` - Test coverage
- `quality` - Code quality
- `ux` - User experience
- `accessibility` - Accessibility improvements
- `performance` - Performance optimization
- `mobile` - Mobile-specific
- `pwa` - Progressive Web App
- `documentation` - Documentation
- `i18n` - Internationalization
- `high-priority` - Critical for production
- `analytics` - Analytics/metrics
- `media` - Photo/media features
- `integration` - Third-party integration
- `social` - Community/sharing features

## 📅 Recommended Order

### Quick Start Path (MVP → Production)

1. **Issue #8** - Multi-User Support (authentication)
2. **Issue #9** - Production Database (persistence)
3. **Issue #10** - Deployment & CI/CD (hosting)
4. **Issue #1** - Watering Reminders (core feature)
5. **Issue #4** - Search & Filter (usability)
6. **Issue #19** - Security Audit (production-ready)
7. **Issue #12** - Testing Coverage (quality)
8. **Issue #15** - Error Handling (reliability)

### Feature-First Path (Enhance User Experience)

1. **Issue #1** - Watering Reminders
2. **Issue #4** - Search & Filter
3. **Issue #3** - Photo Gallery
4. **Issue #5** - Mobile Optimization
5. **Issue #2** - Plant Analytics
6. **Issue #7** - Plant History
7. **Issue #8** - Multi-User Support
8. **Issue #9** - Production Database

### Production-Ready Path (Quality First)

1. **Issue #9** - Production Database
2. **Issue #8** - Multi-User Support
3. **Issue #19** - Security Audit
4. **Issue #12** - Testing Coverage
5. **Issue #13** - Accessibility
6. **Issue #14** - Performance
7. **Issue #15** - Error Handling
8. **Issue #10** - Deployment & CI/CD

## 🔄 Updating Templates

As the project evolves, templates may need updates:

1. **Edit Template Files**
   - Templates are in `.github/ISSUE_TEMPLATE/`
   - Make changes directly to markdown files
   - Commit and push changes

2. **Existing Issues**
   - Template changes don't affect existing issues
   - Update issue descriptions manually if needed

3. **Add New Templates**
   - Create new `.md` file in `ISSUE_TEMPLATE/`
   - Use existing templates as reference
   - Update ROADMAP.md if adding new phase

## 💡 Tips for Success

### For Maintainers

- **Break Down Large Issues**: Create sub-tasks for complex features
- **Link Related Issues**: Use "Related to #X" or "Depends on #X"
- **Update Roadmap**: Keep ROADMAP.md current as priorities shift
- **Communicate Progress**: Use milestones and project boards
- **Celebrate Wins**: Acknowledge contributors when issues close

### For Contributors

- **Start Small**: Begin with smaller issues to learn the codebase
- **Ask Questions**: Better to clarify before starting work
- **Follow Guidelines**: Read CONTRIBUTING.md thoroughly
- **Test Thoroughly**: Run all tests before submitting PR
- **Document Changes**: Update docs when changing functionality

## 📞 Getting Help

- **Questions about issues**: Comment on the specific issue
- **General questions**: Open a [Discussion](https://github.com/Kalekdan/PotsAndPlots/discussions)
- **Template problems**: Open an issue with label `meta`
- **Roadmap questions**: Reference ROADMAP.md or start a discussion

## 📈 Tracking Progress

### GitHub Projects (Recommended)

Create a project board to track issue progress:
1. Go to Projects tab
2. Create new project
3. Add issues to appropriate columns
4. Track progress visually

### Milestones

Group related issues into milestones:
- **v0.2.0 - Core Features** (Issues #1, #4, #5)
- **v0.3.0 - Infrastructure** (Issues #8, #9, #10)
- **v1.0.0 - Production Ready** (Quality issues)

### Labels for Tracking

Use labels to track status:
- `in-progress` - Currently being worked on
- `blocked` - Waiting on dependencies
- `needs-review` - Code ready, awaiting review
- `good first issue` - Suitable for new contributors
- `help wanted` - Seeking contributors

## ✅ Issue Completion Checklist

Before closing an issue:

- [ ] All requirements completed
- [ ] Acceptance criteria met
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No breaking changes (or documented)
- [ ] Deployed to staging (if applicable)
- [ ] User feedback collected (for features)

## 🎉 What's Next?

After setting up issues:

1. **Create Issues**: Use templates to create GitHub issues
2. **Set Priorities**: Apply labels and milestones
3. **Organize Board**: Set up project board for tracking
4. **Recruit Contributors**: Share issues, invite participation
5. **Start Development**: Begin with highest priority items
6. **Iterate**: Update roadmap based on progress and feedback

---

*For more information, see:*
- [ROADMAP.md](./ROADMAP.md) - Development phases and timeline
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- [Issues](https://github.com/Kalekdan/PotsAndPlots/issues) - View all issues
