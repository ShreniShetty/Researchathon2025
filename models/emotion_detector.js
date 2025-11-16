// models/emotion_detector.js - Enhanced Face & Emotion Detection

class EmotionDetector {
    constructor() {
        this.expressionPatterns = {
            happy: {
                features: ['smiling', 'eyes_crinkled', 'cheeks_raised'],
                keywords: ['good', 'great', 'happy', 'excited', 'amazing', 'wonderful', 'yay'],
                response: "I can see positive energy! 😊 That's wonderful!",
                emoji: '😊'
            },
            sad: {
                features: ['downturned_mouth', 'droopy_eyes', 'slumped_posture'],
                keywords: ['sad', 'depressed', 'unhappy', 'down', 'miserable', 'hopeless', 'crying'],
                response: "I notice you look a bit down today. Want to talk about what's going on?",
                emoji: '😢'
            },
            anxious: {
                features: ['tense_face', 'wide_eyes', 'brows_furrowed'],
                keywords: ['anxious', 'nervous', 'worried', 'stressed', 'panic', 'overwhelmed', 'scared'],
                response: "You seem a bit tense. Remember to breathe deeply - you're safe right now.",
                emoji: '😰'
            },
            tired: {
                features: ['droopy_eyes', 'pale_skin', 'sluggish_movements'],
                keywords: ['tired', 'exhausted', 'sleepy', 'fatigued', 'drained', 'burned out'],
                response: "You look like you could use some rest. Self-care is important too! 💤",
                emoji: '😴'
            },
            angry: {
                features: ['furrowed_brows', 'tense_jaw', 'narrowed_eyes'],
                keywords: ['angry', 'mad', 'frustrated', 'annoyed', 'pissed', 'rage'],
                response: "I sense some frustration. It's okay to feel angry - want to talk about it?",
                emoji: '😠'
            },
            neutral: {
                features: ['relaxed_face', 'neutral_mouth', 'calm_eyes'],
                keywords: ['okay', 'fine', 'alright', 'normal', 'neutral', 'meh', 'whatever'],
                response: "You seem pretty calm and collected. How are you really feeling?",
                emoji: '😐'
            }
        };
        
        this.userHistory = [];
        this.moodTrends = {};
    }

    // Main function to analyze facial expression
    async analyzeExpression(videoElement, userMessage = '') {
        return new Promise((resolve) => {
            // In a real app, we'd analyze the video frame here
            // For now, we'll use advanced simulation based on text + patterns
            
            const detectedEmotion = this.simulateAdvancedDetection(userMessage);
            
            // Store in history for pattern recognition
            this.userHistory.push({
                emotion: detectedEmotion.type,
                confidence: detectedEmotion.confidence,
                timestamp: Date.now(),
                message: userMessage
            });
            
            // Keep only recent history
            if (this.userHistory.length > 20) {
                this.userHistory.shift();
            }
            
            // Update mood trends
            this.updateMoodTrends(detectedEmotion.type);
            
            resolve(detectedEmotion);
        });
    }

    simulateAdvancedDetection(userMessage) {
        const message = userMessage.toLowerCase();
        
        // First, check if user explicitly states their emotion
        for (const [emotion, data] of Object.entries(this.expressionPatterns)) {
            if (data.keywords.some(keyword => message.includes(keyword))) {
                return {
                    type: emotion,
                    confidence: 0.85 + Math.random() * 0.1,
                    response: data.response,
                    features: data.features,
                    emoji: data.emoji
                };
            }
        }
        
        // If no explicit emotion, use pattern recognition from history
        const recentPattern = this.analyzeRecentPattern();
        if (recentPattern.confidence > 0.7) {
            return {
                type: recentPattern.emotion,
                confidence: recentPattern.confidence,
                response: this.expressionPatterns[recentPattern.emotion].response,
                features: this.expressionPatterns[recentPattern.emotion].features,
                emoji: this.expressionPatterns[recentPattern.emotion].emoji
            };
        }
        
        // Fallback to context-aware random
        const emotions = Object.keys(this.expressionPatterns);
        const weightedEmotions = this.getWeightedEmotions();
        const selectedEmotion = weightedEmotions[Math.floor(Math.random() * weightedEmotions.length)];
        
        return {
            type: selectedEmotion,
            confidence: 0.6 + Math.random() * 0.3,
            response: this.expressionPatterns[selectedEmotion].response,
            features: this.expressionPatterns[selectedEmotion].features,
            emoji: this.expressionPatterns[selectedEmotion].emoji
        };
    }

    analyzeRecentPattern() {
        if (this.userHistory.length < 3) {
            return { emotion: 'neutral', confidence: 0.5 };
        }
        
        const recent = this.userHistory.slice(-5);
        const emotionCount = {};
        
        recent.forEach(entry => {
            emotionCount[entry.emotion] = (emotionCount[entry.emotion] || 0) + 1;
        });
        
        const mostFrequent = Object.entries(emotionCount)
            .sort(([,a], [,b]) => b - a)[0];
            
        if (mostFrequent && mostFrequent[1] >= 2) {
            return { 
                emotion: mostFrequent[0], 
                confidence: mostFrequent[1] / recent.length 
            };
        }
        
        return { emotion: 'neutral', confidence: 0.5 };
    }

    getWeightedEmotions() {
        // Create array where common emotions appear more frequently
        const weights = {
            neutral: 3,
            tired: 2,
            anxious: 2,
            sad: 1,
            happy: 1,
            angry: 1
        };
        
        const weightedArray = [];
        Object.entries(weights).forEach(([emotion, count]) => {
            for (let i = 0; i < count; i++) {
                weightedArray.push(emotion);
            }
        });
        
        return weightedArray;
    }

    updateMoodTrends(currentEmotion) {
        const today = new Date().toDateString();
        if (!this.moodTrends[today]) {
            this.moodTrends[today] = {};
        }
        
        this.moodTrends[today][currentEmotion] = 
            (this.moodTrends[today][currentEmotion] || 0) + 1;
    }

    getMoodInsights() {
        const today = new Date().toDateString();
        const todayData = this.moodTrends[today];
        
        if (!todayData) return "Not enough data today yet.";
        
        const total = Object.values(todayData).reduce((sum, count) => sum + count, 0);
        const primaryMood = Object.entries(todayData)
            .sort(([,a], [,b]) => b - a)[0];
            
        if (primaryMood) {
            const percentage = Math.round((primaryMood[1] / total) * 100);
            return `Today you've been mostly ${primaryMood[0]} (${percentage}% of the time)`;
        }
        
        return "Tracking your mood patterns...";
    }

    // Method to manually set emotion (for testing)
    setManualEmotion(emotion) {
        const emotionData = this.expressionPatterns[emotion];
        if (emotionData) {
            return {
                type: emotion,
                confidence: 0.95,
                response: `[Manual] ${emotionData.response}`,
                features: emotionData.features,
                emoji: emotionData.emoji
            };
        }
        return null;
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.EmotionDetector = EmotionDetector;
}