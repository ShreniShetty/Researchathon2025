// Advanced Gen Z Chatbot with personality
class GenZChatbot {
    constructor() {
        this.personalityTraits = {
            enthusiasm: 0.8,
            empathy: 0.9,
            humor: 0.7,
            sass: 0.6,
            support: 0.95
        };
        
        this.slangDictionary = {
            'happy': ['yass', 'slay', 'periodt', 'vibes', 'lit'],
            'excited': ['yass', 'slay', 'go off', 'main character energy'],
            'supportive': ['bestie', 'fam', 'you got this', 'sending love'],
            'empathetic': ['felt', 'big mood', 'same', 'no cap'],
            'funny': ['lmao', 'dead', 'i can\'t', 'stop 😂']
        };
        
        this.responsePatterns = this.initializeResponsePatterns();
    }
    
    initializeResponsePatterns() {
        return {
            greeting: [
                "Hey bestie! 👋 What's the vibe today?",
                "Hiiii! 👀 Ready to spill the tea?",
                "Yoo! What's good? 💫",
                "Hey queen! 👑 How's your day going?"
            ],
            farewell: [
                "Aight imma head out ✌️ Take care bestie!",
                "Byee! Remember you're that girl! 💅",
                "Catch you later! Slay all day! 💫",
                "Peace out! You got this 💪"
            ],
            checking: [
                "You good bestie? 👀",
                "How we feeling? 🤔",
                "What's the current mood? 🎵",
                "Update me! What's the tea? ☕"
            ],
            encouraging: [
                "Periodt! You're doing amazing! 👏",
                "Slay queen! That's the energy! 💅",
                "No cap, you're handling this! 💪",
                "Main character behavior! Love it! 👑"
            ]
        };
    }
    
    generatePersonalizedResponse(userMessage, emotionAnalysis, conversationHistory) {
        const emotion = emotionAnalysis.emotion;
        const confidence = emotionAnalysis.confidence;
        
        // Base response based on emotion
        let baseResponse = this.getEmotionBasedResponse(emotion, confidence);
        
        // Add personality flair
        baseResponse = this.addPersonalityFlair(baseResponse);
        
        // Add relevant slang
        baseResponse = this.injectSlang(baseResponse, emotion);
        
        // Add conversational continuity
        baseResponse = this.addContinuity(baseResponse, conversationHistory);
        
        return baseResponse;
    }
    
    getEmotionBasedResponse(emotion, confidence) {
        const highConfidence = confidence > 0.7;
        
        const emotionResponses = {
            happy: highConfidence ? 
                "Yasss! Love that energy for you! ✨" : 
                "Seems like good vibes! Tell me more 🌟",
                
            sad: highConfidence ?
                "Aww fam 😔 Sending virtual hugs 🫂" :
                "Sounds like you're going through it 😮‍💨",
                
            angry: highConfidence ?
                "Okay I'd be heated too 😤" :
                "That sounds frustrating ngl 😠",
                
            anxious: highConfidence ?
                "Big mood 😥 Remember to breathe!" :
                "Sounds stressful 😮‍💨 You're handling it though!",
                
            tired: highConfidence ?
                "The burnout vibe is real 😴 Rest up!" :
                "Sounds like you need some me-time 💤",
                
            neutral: highConfidence ?
                "Keeping it balanced I see ⚖️" :
                "What's on your mind? 🤔"
        };
        
        return emotionResponses[emotion] || "Interesting! Tell me more 👀";
    }
    
    addPersonalityFlair(response) {
        // Add emojis based on content
        const emojiMap = {
            'happy': '✨',
            'sad': '😔',
            'angry': '😤',
            'anxious': '😥',
            'tired': '😴',
            'love': '💖',
            'excited': '🌟',
            'support': '💪',
            'funny': '😂'
        };
        
        let flairedResponse = response;
        
        // Add relevant emojis
        Object.keys(emojiMap).forEach(keyword => {
            if (response.toLowerCase().includes(keyword)) {
                flairedResponse += ` ${emojiMap[keyword]}`;
            }
        });
        
        // Occasionally add extra flair
        if (Math.random() > 0.7) {
            const extraFlair = [' Periodt!', ' Fr!', ' No cap!', ' Lowkey!', ' Highkey!'];
            flairedResponse += extraFlair[Math.floor(Math.random() * extraFlair.length)];
        }
        
        return flairedResponse;
    }
    
    injectSlang(response, emotion) {
        const emotionSlang = {
            happy: ['slay', 'yass', 'periodt'],
            sad: ['felt', 'big mood', 'no cap'],
            angry: ['sus', 'ghost', 'salty'],
            anxious: ['same', 'lowkey', 'vibe check'],
            tired: ['big same', 'main character', 'vibes']
        };
        
        let slangResponse = response;
        const availableSlang = emotionSlang[emotion] || [];
        
        if (availableSlang.length > 0 && Math.random() > 0.5) {
            const randomSlang = availableSlang[Math.floor(Math.random() * availableSlang.length)];
            slangResponse = slangResponse.replace('.', ` ${randomSlang}.`);
        }
        
        return slangResponse;
    }
    
    addContinuity(response, conversationHistory) {
        if (conversationHistory.length < 3) return response;
        
        // Reference previous topics occasionally
        const recentUserMessages = conversationHistory
            .filter(msg => msg.role === 'user')
            .slice(-3)
            .map(msg => msg.message);
        
        if (recentUserMessages.length > 0 && Math.random() > 0.7) {
            const lastTopic = this.extractMainTopic(recentUserMessages[recentUserMessages.length - 1]);
            if (lastTopic) {
                response += ` Btw how's that ${lastTopic} situation going? 👀`;
            }
        }
        
        return response;
    }
    
    extractMainTopic(message) {
        const topics = ['work', 'school', 'friends', 'family', 'relationship', 'health', 'hobby'];
        for (const topic of topics) {
            if (message.toLowerCase().includes(topic)) {
                return topic;
            }
        }
        return null;
    }
}

// Initialize the Gen Z chatbot
const genZChatbot = new GenZChatbot();