// Enhanced Gen Z Chatbot with Hugging Face AI
class GenZChatbot {
    constructor() {
        this.huggingFaceApiKey = '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'; // Replace with your actual key
        this.conversationContext = [];
        this.userPersonality = {};
        this.isAIAvailable = true;
        
        this.personalityTraits = {
            enthusiasm: 0.8,
            empathy: 0.9,
            humor: 0.7,
            sass: 0.6,
            support: 0.95
        };
        
        // Test the API connection on initialization
        this.testAPI();
    }

    async testAPI() {
        try {
            // Simple test to check if API is accessible
            await this.callHuggingFaceAPI(
                'cardiffnlp/twitter-roberta-base-sentiment-latest',
                { inputs: 'test' }
            );
            console.log('🤗 Hugging Face API connected successfully!');
            this.isAIAvailable = true;
        } catch (error) {
            console.warn('⚠️ Hugging Face API not available, using fallback mode');
            this.isAIAvailable = false;
        }
    }

    // Main method to generate AI-powered responses
    async generatePersonalizedResponse(userMessage, emotionAnalysis, conversationHistory) {
        // Always show typing indicator for realistic feel
        await this.simulateThinking();
        
        try {
            if (this.isAIAvailable) {
                // Use Hugging Face for emotional understanding
                const aiAnalysis = await this.analyzeWithHuggingFace(userMessage);
                
                // Combine AI analysis with our emotion detection
                const enhancedAnalysis = this.combineAnalyses(emotionAnalysis, aiAnalysis);
                
                // Update conversation context
                this.updateConversationContext(userMessage, enhancedAnalysis);
                
                // Generate response using AI + Gen Z personality
                const response = await this.generateAIResponse(userMessage, enhancedAnalysis);
                
                return this.addGenZFlair(response, enhancedAnalysis.emotion);
            } else {
                // Fallback to enhanced rule-based responses
                return this.generateEnhancedFallbackResponse(userMessage, emotionAnalysis);
            }
            
        } catch (error) {
            console.error('AI response failed:', error);
            return this.generateEnhancedFallbackResponse(userMessage, emotionAnalysis);
        }
    }

    async simulateThinking() {
        // Random delay between 1-3 seconds for realistic conversation feel
        const delay = 1000 + Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Analyze text with Hugging Face sentiment/emotion models
    async analyzeWithHuggingFace(text) {
        try {
            // Using a sentiment analysis model (free and fast)
            const sentimentResponse = await this.callHuggingFaceAPI(
                'cardiffnlp/twitter-roberta-base-sentiment-latest',
                { inputs: text }
            );

            return {
                sentiment: this.processSentimentResult(sentimentResponse),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new Error('Hugging Face analysis failed');
        }
    }

    // Generic method to call Hugging Face Inference API
    async callHuggingFaceAPI(model, data) {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.huggingFaceApiKey}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return await response.json();
    }

    processSentimentResult(result) {
        if (!result || !result[0]) return 'neutral';
        
        const sentiments = result[0];
        const topSentiment = sentiments.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
        );
        
        return topSentiment.label.toLowerCase();
    }

    combineAnalyses(ourAnalysis, aiAnalysis) {
        if (!aiAnalysis) return ourAnalysis;

        return {
            emotion: ourAnalysis.emotion,
            confidence: ourAnalysis.confidence,
            sentiment: aiAnalysis.sentiment,
            keywords: ourAnalysis.keywords,
            isAIAnalyzed: true
        };
    }

    updateConversationContext(message, analysis) {
        this.conversationContext.push({
            message,
            emotion: analysis.emotion,
            sentiment: analysis.sentiment,
            timestamp: new Date()
        });

        // Keep only last 10 messages for context
        if (this.conversationContext.length > 10) {
            this.conversationContext.shift();
        }
    }

    // Generate response using Hugging Face Chat model
    async generateAIResponse(userMessage, analysis) {
        try {
            // Use a conversational AI model that's available and free
            const prompt = this.createAIPrompt(userMessage, analysis);
            
            const response = await this.callHuggingFaceAPI(
                'microsoft/DialoGPT-medium',
                {
                    inputs: prompt,
                    parameters: {
                        max_length: 80,
                        temperature: 0.8,
                        do_sample: true,
                        return_full_text: false
                    }
                }
            );

            return this.processAIResponse(response);
        } catch (error) {
            throw new Error('AI response generation failed');
        }
    }

    createAIPrompt(userMessage, analysis) {
        const emotion = analysis.emotion;
        const sentiment = analysis.sentiment;
        
        return `As a supportive Gen Z mental health friend, respond to someone feeling ${emotion}. 
Be empathetic, use Gen Z slang occasionally, keep it 1 sentence, be genuine but not clinical.

User: ${userMessage}
AI:`;
    }

    processAIResponse(response) {
        if (!response || !response[0] || !response[0].generated_text) {
            throw new Error('Invalid AI response');
        }

        let aiResponse = response[0].generated_text;
        
        // Clean up the response
        aiResponse = aiResponse.split('\n')[0]; // Take first line only
        aiResponse = aiResponse.replace(/AI:/gi, '').trim();
        
        return aiResponse || "I'm here for you! 💫";
    }

    // Enhanced fallback responses with better understanding
    generateEnhancedFallbackResponse(userMessage, emotionAnalysis) {
        const emotion = emotionAnalysis.emotion;
        const keywords = emotionAnalysis.keywords || [];
        
        // Check for specific keywords first
        const keywordResponse = this.getKeywordResponse(keywords, userMessage);
        if (keywordResponse) return keywordResponse;

        // Check for questions
        if (this.isQuestion(userMessage)) {
            return this.getQuestionResponse(emotion);
        }

        // Emotion-based responses
        return this.getEmotionResponse(emotion, userMessage);
    }

    getKeywordResponse(keywords, userMessage) {
        const keywordMap = {
            'school': "Ugh academia grind 😫 How's the semester treating you?",
            'work': "The 9-5 struggle real 😮‍💨 Need to vent about work?",
            'friends': "Squad drama or good vibes? 👀 Tell me everything!",
            'family': "Family can be a whole mood fr 😅 What's up?",
            'food': "Yesss food is the best therapy! 🍕 What's your comfort food?",
            'sleep': "Sleep is so underrated! 😴 Getting enough Z's?",
            'music': "Ooo what's on your playlist rn? 🎵 Need recommendations?",
            'anime': "A fellow person of culture! 📺 What're you watching?",
            'game': "Gaming is legit therapy! 🎮 What games you playing?",
            'gym': "Yass getting those gains! 💪 How's the fitness journey?"
        };

        for (const keyword of keywords) {
            if (keywordMap[keyword]) {
                return keywordMap[keyword];
            }
        }
        return null;
    }

    isQuestion(message) {
        return message.includes('?') || 
               message.toLowerCase().includes('should i') ||
               message.toLowerCase().includes('what do') ||
               message.toLowerCase().includes('how do') ||
               message.toLowerCase().includes('can you');
    }

    getQuestionResponse(emotion) {
        const responses = {
            'happy': "Hmm that's a vibe! 😊 I'd say follow what makes you happy!",
            'sad': "That's tough 😔 Maybe trust your gut feeling on this one?",
            'angry': "I feel you 😤 Take a breath and do what feels right for your peace",
            'anxious': "That's anxiety-inducing fr 😥 Maybe break it down into smaller steps?",
            'tired': "Exhausting decisions 😴 Listen to what your mind and body need",
            'neutral': "Interesting question! 🤔 What does your intuition say?"
        };
        return responses[emotion] || "That's a real dilemma! 😬 Follow your heart bestie!";
    }

    getEmotionResponse(emotion, userMessage) {
        const responseTemplates = {
            happy: [
                "Yasss! Love this energy for you! ✨",
                "Periodt! That's the vibe! 💅",
                "Slay! Keeping those good energies flowing! 🌟",
                "No cap, that's amazing! So happy for you! 🎉",
                "Main character energy! Love to see it! 👑"
            ],
            sad: [
                "Aww fam, I'm sending virtual hugs 🫂",
                "That's tough, no cap 😔 Remember this feeling is temporary!",
                "You're valid for feeling that way 💖 Take your time",
                "It's giving resilience! You've got this 💪",
                "Big mood sometimes 😮‍💨 But you're stronger than you think!"
            ],
            angry: [
                "Okay I'd be heated too ngl 🔥",
                "They really did that? Not the vibe 😤",
                "Take a deep breath bestie, don't let them ruin your day 💅",
                "That's actually so foul 😠 Your feelings are valid tho",
                "The audacity! Sending calming energies your way 🧘‍♀️"
            ],
            anxious: [
                "I feel that 😥 Remember to breathe, you've survived 100% of your bad days!",
                "That's totally valid! Maybe try the 5-4-3-2-1 grounding method?",
                "No cap, anxiety is the worst 😮‍💨 You're doing amazing just by dealing with it",
                "It's giving warrior energy! You're handling this like a pro 💪",
                "One step at a time bestie! You've got this 🌟"
            ],
            tired: [
                "Big same 😴 Self-care isn't selfish, take that rest!",
                "That's the burnout vibe 😮‍💨 Remember to hydrate and take breaks!",
                "You're doing the most! Maybe time for a little treat? 🍵",
                "It's giving exhausted queen 👑 Your battery needs charging!",
                "Listen to your body bestie! Rest is productive too 💤"
            ],
            neutral: [
                "Keeping it real, I respect that 💯",
                "Valid! Sometimes neutral is the move 🤷‍♀️",
                "No big vibes, just existing - felt that 😌",
                "It's giving balanced queen! Love that energy ⚖️",
                "Sometimes the middle ground is the best ground 🌈"
            ]
        };

        const responses = responseTemplates[emotion] || ["I'm here for you! 💫"];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addGenZFlair(response, emotion) {
        // Add emojis based on emotion
        const emojiMap = {
            'happy': ['✨', '🌟', '🎉', '💫'],
            'sad': ['😔', '💖', '🫂', '🌧️'],
            'angry': ['😤', '🔥', '💅', '⚡'],
            'anxious': ['😥', '🌟', '💪', '🌀'],
            'tired': ['😴', '💤', '🍵', '🌙'],
            'neutral': ['💫', '🤷‍♀️', '⚖️', '🔮']
        };

        const emojis = emojiMap[emotion] || ['💫'];
        const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Occasionally add Gen Z slang
        if (Math.random() > 0.5) {
            const slang = [' Periodt!', ' Fr!', ' No cap!', ' Lowkey!', ' Highkey!'];
            response += slang[Math.floor(Math.random() * slang.length)];
        }

        return response + ' ' + selectedEmoji;
    }

    // Method to get conversation insights
    getConversationInsights() {
        const emotionCounts = {};
        this.conversationContext.forEach(ctx => {
            emotionCounts[ctx.emotion] = (emotionCounts[ctx.emotion] || 0) + 1;
        });

        const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
            emotionCounts[a] > emotionCounts[b] ? a : b, 'neutral'
        );

        return {
            totalMessages: this.conversationContext.length,
            dominantEmotion,
            emotionDistribution: emotionCounts,
            isAIActive: this.isAIAvailable
        };
    }
}

// Initialize the enhanced chatbot
const genZChatbot = new GenZChatbot();