## Bicycle Shop

Welcome to the Bicycle sho repository! This document provides an overview of the system's architecture, design, and database, along with relevant diagrams for better understanding.
C4 Model Diagrams

2 main diagrams from C4 Model:
<details>
<summary>System Context Diagram</summary>

![System Context Diagram](assets/context-diagram.jpg)

</details> 

<details> 
<summary>Container Diagram</summary>

![Container Diagram](assets/container-diagrams.jpg)

</details>

## Flow Diagram

The Flow for a client of the shop

<details> 
<summary>User Flow Diagram</summary>

![User Flow Diagram](assets/flow-diagram.png)

</details>

<details> 
<summary>Markus add product Flow Diagram</summary>

![Flow Diagram](assets/flow-markus.png)

</details>

## Architecture Design: Monolith

This project uses a Monolith Architecture design.     
- [Why this desion was made](./architecture-decision.md) 

## Used tools:
- Node.js + Nest.js as main frameworks
- Redis for cache
- Postgress for database
- Swagger for API documentations (in progress)
- AWS API Gateway for handling requests 
- AWS ALB for balancing load between instances
- AWS EC2 for hosting 
- AWS S3 for hosting objects
- AWS CloudWatch and Sentry for loging and monitoring (in progress)