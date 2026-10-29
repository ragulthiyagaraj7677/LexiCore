/**
 * Vector Database & Semantic Similarity Engine for Commercial Legal Precedents
 * Implements Tokenization, Legal N-gram extraction, TF-IDF vectorization, and Cosine Similarity
 */

class VectorEngine {
  constructor() {
    this.vocabulary = new Map(); // word/ngram -> index
    this.idf = new Map();        // word/ngram -> idf weight
    this.documents = [];         // indexed precedents with vectors
    this.isTrained = false;

    // Commercial Law Domain Stopwords
    this.stopWords = new Set([
      'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
      'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
      'can', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
      'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his',
      'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my',
      'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
      'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
      'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
      'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
      'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours'
    ]);

    // High-value Legal Key Phrases to boost
    this.legalKeyPhrases = [
      'force majeure', 'liquidated damages', 'breach of contract', 'specific performance',
      'frustration of contract', 'arbitration clause', 'arbitral award', 'interim relief',
      'section 9', 'section 34', 'section 11', 'section 73', 'section 74', 'commercial courts act',
      'limitation period', 'time is of essence', 'anticipatory breach', 'unjust enrichment',
      'indemnity clause', 'consequential damages', 'material adverse change', 'bank guarantee',
      'invocation of guarantee', 'irrevocable letter of credit', 'insolvency resolution', 'moratorium'
    ];
  }

  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    
    const cleanText = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
    const rawTokens = cleanText.split(/\s+/).filter(t => t.length > 1 && !this.stopWords.has(t));
    
    // Extract domain bigrams & legal key phrases
    const bigrams = [];
    for (let i = 0; i < rawTokens.length - 1; i++) {
      bigrams.push(`${rawTokens[i]} ${rawTokens[i + 1]}`);
    }

    const matchedPhrases = [];
    const lowerText = text.toLowerCase();
    for (const phrase of this.legalKeyPhrases) {
      if (lowerText.includes(phrase)) {
        matchedPhrases.push(phrase);
        matchedPhrases.push(phrase); // boosted weighting
      }
    }

    return [...rawTokens, ...bigrams, ...matchedPhrases];
  }

  buildVocabulary(docs) {
    const docTermFreqs = [];
    const termDocCount = new Map();
    const totalDocs = docs.length;

    docs.forEach(doc => {
      const combinedText = `
        ${doc.title || ''} 
        ${doc.disputeCategory || ''} 
        ${doc.facts || ''} 
        ${doc.ratioDecidendi || ''} 
        ${(doc.keyIssues || []).join(' ')} 
        ${(doc.statutesCited || []).join(' ')}
        ${(doc.commercialPrinciples || []).join(' ')}
      `;

      const tokens = this.tokenize(combinedText);
      const tf = new Map();
      
      tokens.forEach(token => {
        tf.set(token, (tf.get(token) || 0) + 1);
      });

      docTermFreqs.push({ id: doc._id || doc.citation, tf, tokensCount: tokens.length, originalDoc: doc });

      // Track document occurrences
      for (const token of tf.keys()) {
        termDocCount.set(token, (termDocCount.get(token) || 0) + 1);
      }
    });

    // Build vocabulary index & compute IDF
    let vocabIdx = 0;
    this.vocabulary.clear();
    this.idf.clear();

    termDocCount.forEach((count, term) => {
      if (count >= 1) { // include terms present in at least 1 legal case
        this.vocabulary.set(term, vocabIdx++);
        // Smoothed IDF
        const idfScore = Math.log(1 + (totalDocs / count));
        this.idf.set(term, idfScore);
      }
    });

    // Vectorize each document
    this.documents = docTermFreqs.map(item => {
      const vector = this.createVectorFromTF(item.tf, item.tokensCount);
      return {
        id: item.id,
        doc: item.originalDoc,
        vector,
      };
    });

    this.isTrained = true;
    console.log(`[Vector Engine] Indexed ${this.documents.length} legal precedents with vocabulary dimension ${this.vocabulary.size}`);
  }

  createVectorFromTF(tfMap, totalTokens) {
    const dim = this.vocabulary.size;
    const vector = new Float32Array(dim);

    if (totalTokens === 0 || dim === 0) return vector;

    tfMap.forEach((count, term) => {
      const idx = this.vocabulary.get(term);
      if (idx !== undefined) {
        const tf = count / totalTokens;
        const idf = this.idf.get(term) || 1.0;
        vector[idx] = tf * idf;
      }
    });

    // Normalize vector (L2 norm)
    return this.normalizeVector(vector);
  }

  createVectorFromText(text) {
    const tokens = this.tokenize(text);
    const tf = new Map();
    tokens.forEach(token => {
      tf.set(token, (tf.get(token) || 0) + 1);
    });
    return this.createVectorFromTF(tf, tokens.length);
  }

  normalizeVector(vec) {
    let sumSq = 0;
    for (let i = 0; i < vec.length; i++) {
      sumSq += vec[i] * vec[i];
    }
    const mag = Math.sqrt(sumSq);
    if (mag > 0) {
      for (let i = 0; i < vec.length; i++) {
        vec[i] /= mag;
      }
    }
    return vec;
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dot)); // clamp 0 to 1
  }

  /**
   * Vector Search Query against Indexed Legal Precedents
   * @param {string} queryText - Dispute facts or research query
   * @param {number} topK - Number of top precedents to return
   * @param {string} [categoryFilter] - Optional dispute category filter
   */
  search(queryText, topK = 4, categoryFilter = null) {
    if (!this.isTrained || this.documents.length === 0) {
      return [];
    }

    const queryVec = this.createVectorFromText(queryText);
    const results = [];

    for (const item of this.documents) {
      if (categoryFilter && categoryFilter !== 'All' && item.doc.disputeCategory !== categoryFilter) {
        continue;
      }

      let similarity = this.cosineSimilarity(queryVec, item.vector);

      // Check category semantic overlap bonus
      if (queryText.toLowerCase().includes(item.doc.disputeCategory.toLowerCase())) {
        similarity = Math.min(0.98, similarity + 0.15);
      }

      results.push({
        precedent: item.doc,
        similarityScore: Math.round(similarity * 1000) / 1000,
        similarityPercent: Math.round(similarity * 100),
      });
    }

    // Sort by descending similarity
    results.sort((a, b) => b.similarityScore - a.similarityScore);

    return results.slice(0, topK);
  }

  getAllIndexedDocs() {
    return this.documents.map(d => d.doc);
  }
}

const vectorEngineInstance = new VectorEngine();
module.exports = vectorEngineInstance;

