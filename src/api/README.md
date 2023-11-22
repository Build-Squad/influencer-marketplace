# Setting Up the Code Locally

## Prerequisites:-

Before setting up the code locally, ensure the following prerequisites are met:

Python Installation:

Make sure Python is installed on your machine. If not, download and install Python from python.org.

PostgreSQL Installation:

PostgreSQL must be installed on your machine. Install using Homebrew (for Mac) or Download and install it from postgresql.org.

## Setup Steps:-

Follow these steps to set up the code locally:

1. Clone the Repository
   
2. cd /src/api/marketplace

3. Create Virtual Environment 
On Linux/Mac
python3 -m venv venv

On Windows
python -m venv venv

4. Activate Virtual Environment

On Linux/Mac
source venv/bin/activate

On Windows
.\venv\Scripts\activate

5. Install dependencies

pip install -r requirements.txt

6. Database Configuration:

Ensure PostgreSQL is running.
Create a PostgreSQL database for the project.

7. Update Database Settings:

Create .env file inside src/api/marketplace and update database credentials 

DB_NAME=marketplace
DB_USER=mp_dev
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

8. Apply Migrations
python3 manage.py migrate

9. Run dev server
python3 manage.py runserver

10. Create Superuser and Access the Admin Interface:
    
python3 manage.py createsuperuser

Visit http://localhost:8000/admin/ and log in with the superuser credentials.
Explore and manage the application through the Django admin interface.

12. Start Developing:

You're all set! Start developing and building awesome features.
