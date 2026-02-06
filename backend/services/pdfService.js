const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * PDF Service - Handles PDF extraction and text chunking
 */
class PDFService {
  /**
   * Extract text and metadata from PDF file
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<Object>} - Extracted text, page count, and metadata
   */
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);

      return {
        text: data.text,
        pages: data.numpages,
        metadata: data.info,
        success: true
      };
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  /**
   * Split extracted text into chunks for processing
   * @param {string} text - Full text to chunk
   * @param {number} chunkSize - Target size for each chunk in words
   * @returns {Array<string>} - Array of text chunks
   */
  async chunkPDFText(text, chunkSize = 500) {
    try {
      const words = text.split(/\s+/);
      const chunks = [];
      let currentChunk = '';
      let wordCount = 0;

      for (const word of words) {
        if (wordCount >= chunkSize) {
          chunks.push(currentChunk.trim());
          currentChunk = word + ' ';
          wordCount = 1;
        } else {
          currentChunk += word + ' ';
          wordCount++;
        }
      }

      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }

      return chunks;
    } catch (error) {
      throw new Error(`Text chunking failed: ${error.message}`);
    }
  }

  /**
   * Clean and normalize text for processing
   * @param {string} text - Raw text to clean
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
  }
}

module.exports = new PDFService();
