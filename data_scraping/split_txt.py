import os


def split_text_file(input_file, destination="texts", max_chars=50 * 1024):
    # Read the content of the input file
    with open(input_file, "r", encoding="utf-8") as file:
        content = file.read()

    # Calculate the number of parts needed
    total_chars = len(content)
    num_parts = (total_chars // max_chars) + 1

    # Ensure the destination directory exists
    if not os.path.exists(destination):
        os.makedirs(destination)

    # Split the content and write to separate files
    base_filename = os.path.basename(input_file)
    name, ext = os.path.splitext(base_filename)

    for i in range(num_parts):
        start_index = i * max_chars
        end_index = start_index + max_chars
        part_content = content[start_index:end_index]

        output_file = os.path.join(destination, f"{name}_part{i + 1}{ext}")
        with open(output_file, "w", encoding="utf-8") as part_file:
            part_file.write(part_content)

        print(f"Wrote part {i + 1} to {output_file}")


# Directory containing text files
input_folder = "Ayurveda Dataset/ayurveda_texts"
output_folder = "Processed/texts"

# Iterate through all text files in the directory
for file in os.listdir(input_folder):
    if file.endswith(".txt"):
        input_file_path = os.path.join(input_folder, file)
        print(f"Processing {input_file_path}")
        split_text_file(input_file_path, destination=output_folder)
