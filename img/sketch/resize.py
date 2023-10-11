from PIL import Image
import os

# Set the directory containing your images
image_directory = r'C:\Users\liq32\Desktop\IT\2308_website\ludwigpeking.github.io\img\sketch\places-resize'

# Set the new width to which you want to resize your images
new_width = 400

# Loop through all images from 001 to 100
for i in range(1, 101):
    # Create the file name, assuming the files are named as 001.jpg, 002.jpg, etc.
    file_name = f"{i:03d}.jpg"
    file_path = os.path.join(image_directory, file_name)

    if os.path.exists(file_path):
        # Open an image file
        with Image.open(file_path) as img:
            # Calculate the proportional height
            width_percent = (new_width / float(img.size[0]))
            new_height = int((float(img.size[1]) * float(width_percent)))

            # Resize the image
            img = img.resize((new_width, new_height), Image.ANTIALIAS)
            
            # Save the image back to the same file, overwriting the old image
            img.save(file_path)
            print(f"Resized and saved {file_name}")
    else:
        print(f"{file_name} does not exist")
