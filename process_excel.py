import pandas as pd
import json
import re

file_path = 'C:/Users/aksha/Downloads/info_university .xlsx'
df = pd.read_excel(file_path)

# Fill NaNs with empty string
df = df.fillna('')

universities = []
seen_names = set()

idx = 1

def fix_encoding(text):
    if not isinstance(text, str):
        return text
    return text.replace('â€“', '–').replace('â€”', '—').replace('Ã©', 'é')

for index, row in df.iterrows():
    name = row['University'].strip()
    
    # Apply Encoding Fixes
    name = fix_encoding(name)
    description = fix_encoding(row['Description'])
    about = fix_encoding(row['About'])
    research = fix_encoding(row['Research'])
    programs_str = fix_encoding(row['Programs'])
    website = row['Website'].strip()
    
    # Antioch University Rule:
    if name.startswith('Antioch University '):
        continue  # skip branch campuses
    
    # Aquinas Rule:
    if name == 'Aquinas College':
        if 'Grand Rapids' in description or 'Grand Rapids' in about:
            name = 'Aquinas College (Grand Rapids, MI)'
        elif 'Nashville' in description or 'Nashville' in about:
            name = 'Aquinas College (Nashville, TN)'
            
    # Deduplication Rule:
    check_name = name
    if 'Wheaton College' in name:
        check_name = 'Wheaton College'
        
    if check_name in seen_names:
        continue
    
    seen_names.add(check_name)
    
    country = 'United States'
    city = None
    # rough extraction of city from description "in City, State"
    match = re.search(r'in ([A-Z][a-zA-Z\s]+), ([A-Z][a-zA-Z\s]+)', description)
    if match:
        city = match.group(1).strip()
        
    u_type = 'public'
    if 'Private' in description or 'private' in description:
        u_type = 'private'
        
    # Get domain from website for logo
    logo_url = None
    if website:
        # e.g., https://www.mit.edu
        domain_match = re.search(r'https?://(?:www\.)?([^/]+)', website)
        if domain_match:
            logo_url = f"https://www.google.com/s2/favicons?sz=128&domain_url={domain_match.group(1)}"
            
    programs = [p.strip() for p in programs_str.split(',') if p.strip()] if programs_str else []
    
    uni = {
        "id": f"u_{idx}",
        "name": name,
        "country": country,
        "country_code": "US",
        "city": city,
        "state": None,
        "qs_rank": None,
        "logo_url": logo_url,
        "banner_url": None,
        "campus_image_url": None,
        "campus_image_attribution": None,
        "gallery_urls": None,
        "website": website,
        "description": description,
        "university_type": u_type,
        "tuition_min": None,
        "tuition_max": None,
        "cost_of_attendance": None,
        "currency": "USD",
        "scholarships_available": False,
        "scholarship_info": None,
        "programs": programs,
        "admission_details": None,
        "campus_facilities": None,
        "established_year": None,
        "student_count": None,
        "verified_faculty_count": 0,
        "is_featured": False,
        "created_at": "2026-08-27T12:00:00.000Z"
    }
    universities.append(uni)
    idx += 1

ts_content = f"""import type {{ University }} from '@/types';

export const REAL_UNIVERSITIES: University[] = {json.dumps(universities, indent=2)};
"""

with open('d:/Mentoring Path/frontend/src/lib/universitiesData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully generated universitiesData.ts with {len(universities)} records.")
