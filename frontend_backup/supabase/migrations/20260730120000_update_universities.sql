-- Add new columns for the extended university data
ALTER TABLE universities ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS classification text;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS accreditation text;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS campus_acreage text;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS undergrad_count integer;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS graduate_count integer;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS graduation_rate text;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS housing_capacity text;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS student_faculty_ratio text;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS athletics jsonb DEFAULT '{}';
ALTER TABLE universities ADD COLUMN IF NOT EXISTS local_insights jsonb DEFAULT '{}';

-- Wait for the real data import script/CSV for inserting data
-- and deleting old dummy universities.
