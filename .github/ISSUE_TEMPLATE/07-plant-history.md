---
name: Plant History and Lifecycle Events
about: Track detailed plant history including changes, relocations, and lifecycle events
title: '[FEATURE] Plant History and Lifecycle Tracking'
labels: ['enhancement', 'feature']
assignees: []
---

## Feature Description
Implement comprehensive history tracking for all plant changes, relocations, health status updates, and lifecycle events.

## User Story
As a plant owner, I want to see a complete history of my plant's lifecycle so that I can track its journey and learn from past care decisions.

## Requirements

### Backend
- [ ] Create plant_events table with polymorphic event types
- [ ] Track health status changes with timestamps
- [ ] Record location changes (area/plot moves)
- [ ] Log plant attribute updates (name, species, notes)
- [ ] Track watering events (from Issue #1)
- [ ] Record lifecycle milestones (flowering, fruiting, dormant, etc.)
- [ ] Add user notes/journal entries
- [ ] Create API endpoints to retrieve event history

### Frontend
- [ ] Create timeline view component
- [ ] Display events chronologically with icons
- [ ] Add event filtering by type
- [ ] Show event details in expandable cards
- [ ] Create "Add Note" functionality
- [ ] Display milestone badges on plant cards
- [ ] Add export history feature (CSV/PDF)
- [ ] Show "days since" for key events

### Event Types to Track
- [ ] Plant added to collection
- [ ] Health status changes
- [ ] Location changes (moves)
- [ ] Watering events
- [ ] Repotting
- [ ] Fertilizing
- [ ] Pruning
- [ ] Pest/disease treatment
- [ ] Flowering/fruiting
- [ ] Propagation
- [ ] Custom notes

## Acceptance Criteria
- Complete event history displays for each plant
- Events show timestamp and description
- Users can add custom notes/entries
- Timeline is easy to read and navigate
- Events can be filtered by type
- Historical data persists correctly
- Automatic events generate from system actions

## Dependencies
- Issue #1 (Watering Reminders) - watering events
- Issue #2 (Plant Analytics) - data for analytics

## Technical Notes
- Use event sourcing pattern for consistency
- Consider soft deletes for historical integrity
- Implement pagination for long histories
- Add search within plant history
- Consider adding event photos (from Issue #3)
