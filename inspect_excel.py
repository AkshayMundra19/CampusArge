import pandas as pd
import json

file_path = 'C:/Users/aksha/Downloads/info_university .xlsx'
df = pd.read_excel(file_path)

# Print columns and first 5 rows
print("Columns:", df.columns.tolist())
print("First 5 rows:")
print(df.head(5).to_json(orient='records', indent=2))
