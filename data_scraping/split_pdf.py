import os
from pdf2image import convert_from_path
import pytesseract


def pdf_to_text(input_file, output_dir, file, chunk_size=50 * 1024):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Convert PDF to images
    try:
        images = convert_from_path(input_file)
    except Exception as e:
        print(f"Error converting {input_file} to images: {e}")
        return

    text = ""

    # Perform OCR on each image
    for i, image in enumerate(images):
        try:
            text += pytesseract.image_to_string(image)
        except Exception as e:
            print(f"Error performing OCR on page {i + 1} of {input_file}: {e}")

    # Write text to files in chunks
    start = 0
    file_index = 1
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end]
        output_file_path = os.path.join(output_dir, f"{file}_output_{file_index}.txt")
        try:
            with open(output_file_path, "w", encoding="utf-8") as output_file:
                output_file.write(chunk)
        except Exception as e:
            print(f"Error writing chunk {file_index} to file: {e}")

        start = end
        file_index += 1


if __name__ == "__main__":
    input_folder = "Ayurveda Dataset/ayurveda_books"  # Folder containing PDFs
    output_dir = "Processed/books"  # Folder to save text files

    # Process each PDF file in the input folder
    for file in os.listdir(input_folder):
        if file.endswith(".pdf"):
            input_file_path = os.path.join(input_folder, file)
            print(f"Processing {input_file_path}")
            pdf_to_text(input_file_path, output_dir, file)
