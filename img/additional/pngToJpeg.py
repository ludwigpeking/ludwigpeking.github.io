from PIL import Image
import os

def png_to_jpg(png_file_path, jpg_file_path):
    # Open the PNG file
    with Image.open(png_file_path) as image:
        # Convert the image to RGB mode as JPG does not support alpha channel
        rgb_image = image.convert('RGB')
        # Save the image in JPG format
        rgb_image.save(jpg_file_path, 'JPEG')

def convert_all_pngs_in_folder(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith(".png"):
            png_file_path = os.path.join(folder_path, filename)
            jpg_file_path = os.path.join(folder_path, os.path.splitext(filename)[0] + '.jpg')
            png_to_jpg(png_file_path, jpg_file_path)
            print(f"Converted {filename} to JPG")

# Example usage
folder_path = r'C:\Users\liq32\Desktop\IT\2308_website\ludwigpeking.github.io\img\additional'
convert_all_pngs_in_folder(folder_path)
