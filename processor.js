const fs = require('fs');
const pdf = require('pdf-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const pdfPath = './PER.pdf';

// Function to read PDF file
const readPDF = async (pdfPath) => {
    let dataBuffer = fs.readFileSync(pdfPath);
    return pdf(dataBuffer);
};

const extractSections = (text) => {
    const regex = /([A-Z][^\n]*)\n(\d+)\.—\s*\((\d+)\)([\s\S]*?)(?=\n[A-Z][^\n]*\n|\n\d+\.—|\n\d+\s*\(|$)/g;
    let match;
    const sections = [];

    while ((match = regex.exec(text)) !== null) {
        sections.push({
            sectionHeader: match[1].trim(),
            sectionNumber: match[2],
            mainClauseNumber: match[3],
            clauseText: match[4].trim()
        });
    }
    return sections;
};

const parseClauses = (sections) => {
    const parsedSections = [];

    sections.forEach(section => {
        const { sectionHeader, sectionNumber, mainClauseNumber, clauseText } = section;

        // Split main clause and its subclauses
        const clauseParts = clauseText.split(/\(\d+\)\s*/).filter(Boolean);
        let clauseCounter = parseInt(mainClauseNumber);

        clauseParts.forEach((part, index) => {
            // Ignore sub-sections like (a), (b), (c) at the beginning of the part
            if (part.match(/^\s*\([a-z]\)/)) return;

            const clauseSubNumber = index === 0 ? mainClauseNumber : (++clauseCounter).toString();
            const subClauseText = part.replace(/\n/g, ' ').replace(/—\s*\([a-z]\)/g, ''); // Remove any remaining sub-section markers
            const clauseNumber = `${sectionNumber}.${clauseSubNumber}`;
            const requirementType = subClauseText.includes("must") ? "Must" : subClauseText.includes("shall") ? "Shall" : subClauseText.includes("should") ? "Should" : "None";

            parsedSections.push({
                sectionHeader: sectionHeader,
                clauseNumber: clauseNumber,
                clauseText: subClauseText.trim(),
                requirementType: requirementType
            });
        });
    });

    return parsedSections;
};

const exportToCSV = (sections) => {
    const csvWriter = createCsvWriter({
        path: 'output.csv',
        header: [
            {id: 'sectionHeader', title: 'section'},
            {id: 'clauseNumber', title: 'clause_number'},
            {id: 'clauseText', title: 'clause_text'},
            {id: 'requirementType', title: 'requirement_type'}
        ]
    });
    return csvWriter.writeRecords(sections)
        .then(() => console.log('Data has been written to CSV file successfully.'))
        .catch(err => console.error('Error writing CSV:', err));  // Log CSV writing errors
};

const processPDF = async () => {
    try {
        const data = await readPDF(pdfPath);
        const sections = extractSections(data.text);
        const parsedSections = parseClauses(sections);

        if (parsedSections.length > 0) {
            await exportToCSV(parsedSections);
        } else {
            console.log('No sections found.'); // Log if no sections are found
        }
    } catch (error) {
        console.error('Error processing PDF:', error);
    }
};

processPDF();
