import os

folder_path = "C:\\Users\\liq32\\Desktop\\IT\\2308_website\\ludwigpeking.github.io\\img\\sketch\\places"

# List all files in the directory
files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]

# Filter only jpg files
jpg_files = [f for f in files if f.endswith('.jpg')]

# Sort files to make sure they are renamed in order
jpg_files.sort()

# Rename files
for idx, filename in enumerate(jpg_files, start=1):
    new_name = f"{idx:03}.jpg"  # Updated to 4-digit format
    old_path = os.path.join(folder_path, filename)
    new_path = os.path.join(folder_path, new_name)

    os.rename(old_path, new_path)
    print(f"Renamed {filename} to {new_name}")
