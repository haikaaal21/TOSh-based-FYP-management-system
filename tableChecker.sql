-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
-- -- ! TRIGGER
-- CREATE OR REPLACE FUNCTION set_default_is_student()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.is_student IS NULL THEN
--         NEW.is_student := false;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER check_is_student
-- BEFORE INSERT ON spares_user
-- FOR EACH ROW
-- EXECUTE FUNCTION set_default_is_student();
select *
from spares_academic_staff