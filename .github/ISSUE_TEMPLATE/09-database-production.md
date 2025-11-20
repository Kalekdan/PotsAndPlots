---
name: Production Database Setup
about: Migrate from H2 in-memory database to production-grade database
title: '[INFRASTRUCTURE] Production Database Setup'
labels: ['infrastructure', 'database', 'high-priority']
assignees: []
---

## Feature Description
Replace the H2 in-memory database with a production-grade persistent database solution (PostgreSQL, MySQL, or similar).

## User Story
As a user, I want my plant data to persist permanently so that I don't lose my collection information when the server restarts.

## Requirements

### Database Selection
- [ ] Choose production database (PostgreSQL recommended)
- [ ] Document decision rationale
- [ ] Set up local development database
- [ ] Configure database connection pooling

### Backend Changes
- [ ] Update application.properties/application.yml for production DB
- [ ] Add database migration tool (Flyway or Liquibase)
- [ ] Create initial database schema migration
- [ ] Update data initialization for production
- [ ] Add environment-specific configurations
- [ ] Remove H2 dependencies for production profile

### Migration Strategy
- [ ] Create database schema migrations
- [ ] Implement seed data for testing
- [ ] Add database backup strategy
- [ ] Create migration rollback procedures
- [ ] Document migration process

### Development Setup
- [ ] Update README with database setup instructions
- [ ] Create Docker Compose for local development database
- [ ] Add database initialization scripts
- [ ] Update .env.example with database credentials
- [ ] Document connection string format

### Production Considerations
- [ ] Set up database hosting (AWS RDS, Heroku Postgres, etc.)
- [ ] Configure SSL connections
- [ ] Set up automated backups
- [ ] Implement monitoring and alerting
- [ ] Add database performance tuning
- [ ] Configure proper indexes

## Acceptance Criteria
- Data persists across server restarts
- Database is properly indexed for performance
- Migration scripts work correctly
- Development environment matches production schema
- Backup and recovery procedures documented
- Database credentials stored securely

## Dependencies
- Issue #8 (Multi-User Support) - user data persistence
- Database hosting service selection

## Technical Notes
- PostgreSQL recommended for JSON support and scalability
- Use environment variables for database credentials
- Never commit database passwords to version control
- Implement connection pool sizing appropriately
- Consider read replicas for scaling
- Use database migrations for all schema changes
