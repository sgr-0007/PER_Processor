
# PER Processor

This repository contains a script to process the Pressure Equipment (Safety) Regulations (PER) PDF, extract clauses and their respective requirement types, and export the data to a CSV file. The script is designed for reusability and repeatability.

## Requirements

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/sgr-0007/PER_Processor.git
    cd PER_Processor
    ```

2. Install the required npm packages:
    ```bash
    npm install
    ```

## Usage

1. Place the `PER.pdf` file in the root directory of the repository.

2. Run the script:
    ```bash
    node processPDF.js
    ```

3. The output CSV file (`output.csv`) will be generated in the root directory.

## Script Description

The script consists of the following main parts:

1. **readPDF**: Reads the PDF file and extracts its text content.
2. **extractSections**: Extracts sections from the text using regex.
3. **parseClauses**: Parses clauses and their subclauses, handling the clause numbering and sub-section removal.
4. **exportToCSV**: Handles the CSV export logic.
5. **processPDF**: Main function to coordinate the PDF processing and CSV export.

## Error Handling

The script includes error handling to log and report any issues that occur during the processing of the PDF file or the writing of the CSV file.

## Contribution

Feel free to fork this repository and make changes. Pull requests are welcome!

## License

This project is licensed under the MIT License.
