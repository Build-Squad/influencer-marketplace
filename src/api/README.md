# Setting Up the Code Locally

## Getting Started

It is recommended to use Docker to run the project as it will automatically set up the environment for you.  
The steps to run the project using Docker in the [README.md](
  https://github.com/Build-Squad/influencer-marketplace/blob/main/README.md) file in the root directory.

To run the project locally without Docker, follow the steps below:

### Pre-requisites:-

Before setting up the code locally, ensure the following prerequisites are met:

1. PostgreSQL installed on your machine. [PostgreSQL](https://www.postgresql.org/download/)
2. Python installed on your machine. [Python](https://www.python.org/downloads/)

### Setting up the project

Follow these steps to set up the code locally:

1. Clone the repository -   
```git clone https://github.com/Build-Squad/influencer-marketplace```

2. Change into the project directory -  
```cd influencer-marketplace/src/api/marketplace``` 

3. Create Virtual Environment 
+ On Linux/Mac  
```python3 -m venv venv```

+ On Windows  
```python -m venv venv```

4. Activate Virtual Environment

+ On Linux/Mac  
```source venv/bin/activate```    

+ On Windows  
```.\venv\Scripts\activate```

5. Install dependencies  
```pip install -r requirements.txt```  

6. Database Configuration:  

+ Ensure PostgreSQL is running.      
+ Create a PostgreSQL database for the project.

7. Create env file based on .env.example -  
```cp .env.example .env```

9. Update the environment variables in the .env file according to your local environment.

8. Apply Migrations  
```python3 manage.py migrate```
9. Run dev server  
```python3 manage.py runsslserver```

10. Create Superuser and Access the Admin Interface:   
```python3 manage.py createsuperuser```

Visit https://127.0.01:8000/admin/ and log in with the superuser credentials.  
Explore and manage the application through the Django admin interface.

12. Start Developing:

You're all set! Start developing and building awesome features!
