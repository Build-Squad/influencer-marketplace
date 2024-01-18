# Influencer Marketplace

### Description
A marketplace for influencers and businesses to connect and collaborate. The marketplace will allow influencers to create a profile and list their services. Businesses will be able to search for influencers based on their services and contact them for collaborations.

The payments will be handled by the marketplace. Businesses will pay the marketplace and the marketplace will pay the influencers. The marketplace will take a percentage of the payment as a fee.

The transactions will be carried out using cryptocurrencies.

## Tech Stack

### [Front-End](https://github.com/Build-Squad/influencer-marketplace/tree/main/src/ui):
+ Next.js
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


### Prerequisites

Before you begin, ensure you have met the following requirements:  
1. Docker installed on your machine. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. PostgreSQL installed on your machine. [PostgreSQL](https://www.postgresql.org/download/)
3. Python installed on your machine. [Python](https://www.python.org/downloads/)
4. Node.js installed on your machine. [Node.js](https://nodejs.org/en/download/)

### Setting up the project

1. Clone the repository -   
```git clone https://github.com/Build-Squad/influencer-marketplace```

2. Change into the project directory -  
```cd influencer-marketplace```

3. Build the Docker image -  
```docker compose up —build```

4. Create env file based on .env.example (both ui and api) -  
```cp .env.example .env```

5. Fill in the environment variables in the .env file according to your local environment.
 
6. To start the app -  
```docker-compose up```

7. To stop the app -  
```docker-compose down```

All the commands:
```bash
git clone https://github.com/Build-Squad/influencer-marketplace

cd influencer-marketplace

docker compose up —build

cp .env.example .env

# Fill in the environment variables in the .env file according to your local environment.

docker-compose up
```

### Accessing the project

The project will start at the following endpoint:
+ Frontend:   
  http://127.0.0.1:3000/
+ Backend:   
  https://127.0.0.1:8000/
  
+ The admin panel can be accessed at the following endpoint:  
https://127.0.0.1:8000/admin/  

To access the admin panel, 

1. Head to the Docker terminal and run the following command -   
```python manage.py createsuperuser```

2. Enter your desired username, email and password.

3. Head to the admin panel and login with the credentials you just created.