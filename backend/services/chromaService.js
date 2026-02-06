const axios = require('axios');
require('dotenv').config();

/**
 * ChromaDB Service - Handles vector embeddings and RAG
 */
class ChromaService {
  constructor() {
    this.apiUrl = `http://${process.env.CHROMA_DB_HOST}:${process.env.CHROMA_DB_PORT}/api/v1`;
  }

  /**
   * Store document chunks in ChromaDB for semantic search
   * @param {number} lessonId - ID of the lesson
   * @param {Array<string>} chunks - Text chunks to store
   * @returns {Promise<Object>} - Storage result
   */
  async storeChunks(lessonId, chunks) {
    try {
      const collectionName = `lesson_${lessonId}`;

      // Create collection if it doesn't exist
      try {
        await axios.post(`${this.apiUrl}/collections`, {
          name: collectionName,
          metadata: { 
            lesson_id: lessonId,
            created_at: new Date().toISOString()
          }
        });
        console.log(`Created collection: ${collectionName}`);
      } catch (err) {
        // Collection might already exist
        if (err.response?.status !== 409) {
          console.warn(`Could not create collection: ${err.message}`);
        }
      }

      // Add documents
      const ids = chunks.map((_, index) => `${lessonId}_chunk_${index}`);
      const documents = chunks;
      const metadatas = chunks.map((chunk, index) => ({
        lesson_id: lessonId,
        chunk_index: index,
        chunk_length: chunk.length
      }));

      await axios.post(
        `${this.apiUrl}/collections/${collectionName}/add`,
        {
          ids,
          embeddings: null, // Let Chroma auto-generate embeddings
          documents,
          metadatas
        }
      );

      console.log(`Successfully stored ${chunks.length} chunks for lesson ${lessonId}`);

      return {
        success: true,
        lessonId,
        chunksStored: chunks.length,
        collectionName
      };
    } catch (error) {
      throw new Error(`ChromaDB storage error: ${error.message}`);
    }
  }

  /**
   * Retrieve relevant document chunks using semantic search
   * @param {string} query - Search query
   * @param {number} lessonId - Lesson ID to search within
   * @param {number} topK - Number of results to return
   * @returns {Promise<Array>} - Relevant chunks
   */
  async retrieveRelevantChunks(query, lessonId, topK = 5) {
    try {
      const collectionName = `lesson_${lessonId}`;

      const response = await axios.post(
        `${this.apiUrl}/collections/${collectionName}/query`,
        {
          query_texts: [query],
          n_results: topK,
          include: ['embeddings', 'metadatas', 'documents', 'distances']
        }
      );

      const documents = response.data.documents[0] || [];
      const metadatas = response.data.metadatas[0] || [];
      const distances = response.data.distances[0] || [];

      return documents.map((doc, index) => ({
        chunk: doc,
        metadata: metadatas[index],
        relevanceScore: 1 - distances[index] // Convert distance to similarity score
      }));
    } catch (error) {
      console.warn(`ChromaDB retrieval error: ${error.message}`);
      return [];
    }
  }

  /**
   * Delete a collection (when lesson is deleted)
   * @param {number} lessonId - ID of lesson whose collection to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteCollection(lessonId) {
    try {
      const collectionName = `lesson_${lessonId}`;

      await axios.delete(`${this.apiUrl}/collections/${collectionName}`);

      console.log(`Deleted collection: ${collectionName}`);
      return true;
    } catch (error) {
      console.warn(`Could not delete collection: ${error.message}`);
      return false;
    }
  }

  /**
   * Check ChromaDB connection status
   * @returns {Promise<boolean>} - True if ChromaDB is accessible
   */
  async isHealthy() {
    try {
      const response = await axios.get(`${this.apiUrl}/heartbeat`);
      return response.status === 200;
    } catch (error) {
      console.error('ChromaDB connection error:', error.message);
      return false;
    }
  }
}

module.exports = new ChromaService();
