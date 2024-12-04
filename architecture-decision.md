# Architecture Decision

## Context

- Small bicycle shop with MAU 100k that sells customized bicycles.
- Less than 5 employees. 
- Plans for expansion with new product categories and more traffic.
- Customization logic is complex. 
- Development team is small

## Decision

Monolith Architecture structured into feature-based modules.

## Consequences

### Benefits
- Simple setup and development flow for a small team.
- Single deployable unit minimizes operational overhead.
- Shared database ensures consistency and acts as the single source of truth.
- Low infrastructure and operational costs.
- Modules are loosely coupled and can be refactored into microservices as the business grows.
- Easier onboarding for new developers due to the unified codebase.

### Difficulties
- Performance issues in one module can affect the entire application.
- Transitioning to microservices later will require careful planning and effort.
