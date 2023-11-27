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
        EXECUTE 'CREATE ROLE mp_dev LOGIN PASSWORD "#h&{^52405F7"';
    END IF;

    -- Check if database exists
    SELECT 1 INTO db_exists
    FROM pg_catalog.pg_database
    WHERE datname = 'marketplace';

    IF db_exists IS NULL THEN
        -- Database doesn't exist, create it
        EXECUTE 'CREATE DATABASE marketplace';
        
        -- Grant privileges
        EXECUTE 'GRANT ALL PRIVILEGES ON DATABASE marketplace TO mp_dev';
    ELSE
        RAISE NOTICE 'DB "marketplace" already exists. Skipping.';
    END IF;
END $do$;

-- CREATE USER mp_dev WITH PASSWORD '#h&{^52405F7';
-- ALTER USER mp_dev CREATEDB;
-- CREATE DATABASE marketplace;
-- GRANT ALL PRIVILEGES ON DATABASE marketplace TO mp_dev;


