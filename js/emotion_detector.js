// Text emotion analysis using NLP techniques
class EmotionDetector {
    constructor() {
        this.model = null;
        this.vocabulary = null;
        this.loadModel();
    }
    
    async loadModel() {
        try {
            // Load Universal Sentence Encoder for text embeddings
            this.model = await use.load();
            console.log("Text emotion model loaded");
            
            // In a real application, you would also load your custom trained classifier
            // that maps text embeddings to emotions
        } catch (error) {
            console.error("Error loading text emotion model:", error);
        }
    }
    
    async analyzeText(text) {
        if (!this.model) {
            await this.loadModel();
        }
        
        // In a real application, you would:
        // 1. Convert text to embeddings using Universal Sentence Encoder
        // 2. Use your custom classifier to predict emotion from embeddings
        // 3. Return the emotion and confidence
        
        // For this demo, we'll simulate the process with some basic text analysis
        return this.simulateTextEmotionDetection(text);
    }
    
    simulateTextEmotionDetection(text) {
        // Simple keyword-based emotion detection for demo purposes
        // In a real application, you would use your trained model
        
        const emotionKeywords = {
            'happy': ['happy', 'great', 'amazing', 'wonderful', 'excited', 'joy', 'good', 'fantastic'],
            'sad': ['sad', 'down', 'depressed', 'unhappy', 'miserable', 'hopeless', 'cry', 'tears'],
            'angry': ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'hate'],
            'anxious': ['anxious', 'nervous', 'worried', 'stressed', 'tense', 'panic', 'fear', 'scared'],
            'tired': ['tired', 'exhausted', 'fatigued', 'sleepy', 'drained', 'weary', 'burned out']
        };
        
        // Count keyword matches for each emotion
        const textLower = text.toLowerCase();
        const scores = {};
        
        for (const emotion in emotionKeywords) {
            scores[emotion] = 0;
            emotionKeywords[emotion].forEach(keyword => {
                if (textLower.includes(keyword)) {
                    scores[emotion]++;
                }
            });
        }
        
        // Find emotion with highest score
        let detectedEmotion = 'neutral';
        let maxScore = 0;
        
        for (const emotion in scores) {
            if (scores[emotion] > maxScore) {
                maxScore = scores[emotion];
                detectedEmotion = emotion;
            }
        }
        
        // If no strong emotion detected, use neutral
        if (maxScore === 0) {
            detectedEmotion = 'neutral';
        }
        
        // Calculate confidence based on score and text length
        const confidence = Math.min(0.3 + (maxScore / text.split(' ').length) * 2, 0.95);
        
        // Extract keywords
        const keywords = this.extractKeywords(text);
        
        console.log(`Text emotion detection: ${detectedEmotion} with ${(confidence * 100).toFixed(2)}% confidence`);
        
        return {
            emotion: detectedEmotion,
            confidence: confidence,
            keywords: keywords,
            timestamp: new Date().toISOString()
        };
    }
    
    extractKeywords(text) {
        // Simple keyword extraction for demo
        // In a real application, you would use more sophisticated NLP techniques
        
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'];
        
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !commonWords.includes(word));
        
        // Return unique words
        return [...new Set(words)].slice(0, 5);
    }
    
    // Method to train model with your custom dataset
    async trainWithCustomDataset() {
        // This would be the method to train your model with your text dataset
        console.log("Training model with custom text dataset...");
        
        // In a real implementation, you would:
        // 1. Load your text dataset from MentalHealthBuddy/datasets/text_patterns (CSV files)
        // 2. Preprocess the text data
        // 3. Convert text to embeddings
        // 4. Train your classifier on these embeddings
        // 5. Save the model for future use
        
        // This is a placeholder for the training process
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Text model training completed");
                resolve({ success: true, accuracy: 0.88 });
            }, 3000);
        });
    }
    async analyzeConversation(conversationHistory) {
        // Analyze the entire conversation for patterns
        const recentMessages = conversationHistory.slice(-5); // Last 5 messages
        const combinedText = recentMessages.map(msg => msg.message).join(' ');
        
        // Get overall emotion
        const analysis = await this.analyzeText(combinedText);
        
        // Add conversation-specific insights
        analysis.conversationLength = conversationHistory.length;
        analysis.userMessageCount = conversationHistory.filter(msg => msg.role === 'user').length;
        analysis.averageResponseTime = this.calculateAverageResponseTime(conversationHistory);
        
        return analysis;
    }
// Add helper method
calculateAverageResponseTime(conversationHistory) {
    if (conversationHistory.length < 2) return 0;
    
    let totalTime = 0;
    let count = 0;
    
    for (let i = 1; i < conversationHistory.length; i++) {
        if (conversationHistory[i].role === 'bot' && conversationHistory[i-1].role === 'user') {
            const responseTime = conversationHistory[i].timestamp - conversationHistory[i-1].timestamp;
            totalTime += responseTime;
            count++;
        }
    }
    
    return count > 0 ? totalTime / count : 0;
}
// Enhanced keyword extraction for Gen Z slang
extractKeywords(text) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'];
    
    // Gen Z slang dictionary for better understanding
    const genZSlang = {
        'slay': 'positive',
        'periodt': 'emphasis',
        'yass': 'excitement',
        'vibe': 'mood',
        'tea': 'gossip',
        'cap': 'lie',
        'bet': 'agreement',
        'sus': 'suspicious',
        'ghost': 'ignore',
        'salty': 'bitter',
        'goat': 'greatest',
        'lit': 'exciting',
        'fam': 'friends',
        'squad': 'friends',
        'main character': 'confidence',
        'bestie': 'friend'
    };
    
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.includes(word));
    
    // Add Gen Z slang detection
    const slangWords = Object.keys(genZSlang).filter(slang => 
        text.toLowerCase().includes(slang)
    );
    
    // Combine regular words and slang
    const allKeywords = [...new Set([...words, ...slangWords])].slice(0, 8);
    
    return allKeywords;
}    
}

// Initialize the emotion detector
const emotionDetector = new EmotionDetector();