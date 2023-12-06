# Influencer Marketplace

### Description
A marketplace for influencers and businesses to connect and collaborate. The marketplace will allow influencers to create a profile and list their services. Businesses will be able to search for influencers based on their services and contact them for collaborations.

The payments will be handled by the marketplace. Businesses will pay the marketplace and the marketplace will pay the influencers. The marketplace will take a percentage of the payment as a fee.

The transactions will be carried out using cryptocurrencies.

## Tech Stack

### [Front-End](https://github.com/Build-Squad/influencer-marketplace/tree/main/src/ui):
+ Next.js (SSR)
+ MUI (Material UI)

The instructions for running the front-end are in the README.md file in the ui folder.

Front End can be found here:   
``` cd src/ui ```

### [Back-End](https://github.com/Build-Squad/influencer-marketplace/tree/main/src/api/marketplace):
+ Django
+ Django Rest Framework
+ PostgreSQL

The instructions for running the back-end are in the README.md file in the api folder.

Back End can be found here:    
``` cd src/api/marketplace ```

Docker 

Prerequisites

Before you begin, ensure you have met the following requirements:
• Docker installed on your machine.

Clone the repository -
git clone project_name

Change into the project directory -
cd influencer-marketplace

Build the Docker image -
docker compose up —build

Create env file based on .env.example (both ui and api) -
cp .env.example .env

To start the app -
docker-compose up

To stop the app -
docker-compose down
