CREATE OR REPLACE FUNCTION update_tag()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the projecttype already exists in the Tag table
    IF EXISTS (SELECT 1 FROM "Tag" WHERE tagname = NEW.projecttype) THEN
        -- If it exists, increase the tagcount by 1
        UPDATE "Tag" SET tagcount = tagcount + 1 WHERE tagname = NEW.projecttype;
    ELSE
        -- If it doesn't exist, insert a new row with the projecttype and tagcount = 1
        INSERT INTO "Tag" (tagname, tagcount) VALUES (NEW.projecttype, 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag
AFTER INSERT ON "Project"
FOR EACH ROW EXECUTE FUNCTION update_tag();