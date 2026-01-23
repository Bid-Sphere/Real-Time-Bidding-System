-- ================================
-- ORGANIZATION CONTACT PERSON SYNC TRIGGER
-- ================================

-- Create trigger function to sync organization contact_person with users full_name
CREATE OR REPLACE FUNCTION sync_organization_contact_person_to_user_full_name()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the user's full_name when organization contact_person is updated
    UPDATE users 
    SET full_name = NEW.contact_person,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
    
    -- Log the sync operation
    RAISE NOTICE 'Synced contact_person "%" to full_name for user_id %', NEW.contact_person, NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
CREATE TRIGGER trigger_sync_organization_contact_person_insert
    AFTER INSERT ON organization
    FOR EACH ROW
    WHEN (NEW.contact_person IS NOT NULL AND NEW.contact_person != '')
    EXECUTE FUNCTION sync_organization_contact_person_to_user_full_name();

-- Create trigger for UPDATE operations
CREATE TRIGGER trigger_sync_organization_contact_person_update
    AFTER UPDATE OF contact_person ON organization
    FOR EACH ROW
    WHEN (NEW.contact_person IS DISTINCT FROM OLD.contact_person 
          AND NEW.contact_person IS NOT NULL 
          AND NEW.contact_person != '')
    EXECUTE FUNCTION sync_organization_contact_person_to_user_full_name();

-- Also create a reverse sync trigger to update contact_person when user's full_name is updated
-- (This handles cases where full_name is updated directly)
CREATE OR REPLACE FUNCTION sync_user_full_name_to_organization_contact_person()
RETURNS TRIGGER AS $$
BEGIN
    -- Only sync if the user is an ORGANISATION role
    IF NEW.role = 'ORGANISATION' THEN
        -- Update the organization's contact_person when user's full_name is updated
        UPDATE organization 
        SET contact_person = NEW.full_name,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.id;
        
        -- Log the sync operation
        RAISE NOTICE 'Synced full_name "%" to contact_person for user_id %', NEW.full_name, NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user full_name updates
CREATE TRIGGER trigger_sync_user_full_name_to_organization
    AFTER UPDATE OF full_name ON users
    FOR EACH ROW
    WHEN (NEW.full_name IS DISTINCT FROM OLD.full_name 
          AND NEW.full_name IS NOT NULL 
          AND NEW.full_name != ''
          AND NEW.role = 'ORGANISATION')
    EXECUTE FUNCTION sync_user_full_name_to_organization_contact_person();

-- Add comment for documentation
COMMENT ON FUNCTION sync_organization_contact_person_to_user_full_name() IS 
'Automatically syncs organization.contact_person to users.full_name when contact_person is updated';

COMMENT ON FUNCTION sync_user_full_name_to_organization_contact_person() IS 
'Automatically syncs users.full_name to organization.contact_person when full_name is updated for ORGANISATION users';