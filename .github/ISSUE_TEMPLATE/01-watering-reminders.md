---
name: Watering Reminders Feature
about: Implement watering reminder notifications based on plant schedules
title: '[FEATURE] Watering Reminders and Notifications'
labels: ['enhancement', 'feature', 'high-priority']
assignees: []
---

## Feature Description
Implement a watering reminder system that notifies users when plants need attention based on their watering schedules.

## User Story
As a plant owner, I want to receive notifications when my plants need watering so that I never forget to care for them.

## Requirements

### Backend
- [ ] Add last watered date field to Plant model
- [ ] Create watering history tracking table
- [ ] Implement API endpoint to get plants needing water today
- [ ] Create API endpoint to mark plant as watered
- [ ] Add logic to calculate next watering date based on schedule
- [ ] Implement notification scheduling system

### Frontend
- [ ] Create "Needs Watering Today" section on dashboard
- [ ] Add "Mark as Watered" button for each plant
- [ ] Display days until next watering on plant cards
- [ ] Add watering history view in plant details page
- [ ] Implement browser notification API integration
- [ ] Add notification permission request flow
- [ ] Create notification preferences page

### Additional Considerations
- [ ] Handle different watering schedules (daily, weekly, bi-weekly, monthly, custom)
- [ ] Consider timezone handling for notifications
- [ ] Add snooze/remind later functionality
- [ ] Track watering history for analytics

## Acceptance Criteria
- Users can see which plants need watering today
- Users can mark plants as watered with a single click
- Browser notifications appear when enabled
- Watering dates update correctly based on schedule
- Historical watering data is tracked and viewable

## Dependencies
- None

## Technical Notes
- Consider using Web Push API for notifications
- May need to implement service worker for persistent notifications
- Store notification preferences in localStorage or user settings
