# Ayurveda Text Processing

## Setup Instructions

### Step 1: Download the Dataset

1. Download the dataset from Kaggle: [Ayurveda Texts English](https://www.kaggle.com/datasets/rcratos/ayurveda-texts-english/data)
2. Unzip the downloaded dataset into this directory.

### Step 2: Split Text and PDF Files

Before processing, we need to split the text and PDF files from the dataset into smaller chunks for easier handling.

#### Split Text Files

Run `split_txt.py` to split the large text files into smaller chunks.

```bash
python split_txt.py
```

#### Split PDF Files

Run `split_pdf.py` to split the large PDF files into smaller chunks.

```bash
python split_pdf.py
```

### Step 3: Process and Analyze the PDF Files

Run `rag_pdf.py` to process and analyze the split PDF files.

```bash
python rag_pdf.py
```

### Additional Information

#### Scraping Additional Articles

The `scrapearticles.py` script is used to collect additional Ayurveda-related texts from the web. This script will search for relevant articles, download them, and save them to the dataset directory for further processing.

To run the scraper, use the following command:

```bash
python scrapearticles.py
```

Make sure to review and configure the script as needed before running it.