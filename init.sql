-- Check and create role
DO $do$
DECLARE
    db_exists INTEGER;
BEGIN
    -- Check if role exists
    IF EXISTS (
        SELECT 1
        FROM pg_catalog.pg_roles
        WHERE rolname = 'mp_dev'
    ) THEN
        RAISE NOTICE 'Role "mp_dev" already exists. Skipping.';

    ELSE
        EXECUTE 'CREATE ROLE mp_dev LOGIN PASSWORD xsdrt1768 WITH SUPERUSER';
    END IF;
    EXECUTE 'ALTER ROLE mp_dev WITH SUPERUSER';   
END $do$;

SELECT 'CREATE DATABASE marketplace'
WHERE NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'marketplace')

-- EXECUTE 'ALTER DATABASE marketplace OWNER TO mp_dev';

-- CREATE USER mp_dev WITH PASSWORD '#h&{^52405F7';
-- ALTER USER mp_dev CREATEDB;
-- CREATE DATABASE marketplace;
-- GRANT ALL PRIVILEGES ON DATABASE marketplace TO mp_dev;


