// models/voice_analyzer.js - Advanced Voice Pattern Analysis with RAVDESS Integration

class VoiceAnalyzer {
    constructor() {
        // RAVDESS Integration - Professional Emotion Detection
        if (typeof RavdessParser !== 'undefined') {
            this.ravdessParser = new RavdessParser();
            this.ravdessParser.loadDatasetStructure();
            console.log('🎵 RAVDESS professional emotion detection loaded!');
        }
        
        // Original Voice Patterns (Fallback System)
        this.voicePatterns = {
            depressed: {
                characteristics: ['slow_pace', 'low_volume', 'monotone', 'hesitation'],
                keywords: ['sad', 'hopeless', 'empty', 'tired', 'can\'t', 'won\'t', 'never'],
                responses: {
                    gentle: "I hear the heaviness in your voice. It's okay to feel this way.",
                    encouraging: "Thank you for sharing. Even speaking about it takes courage.",
                    supportive: "I'm here with you in this. You're not alone."
                },
                tone: 'soft',
                pace: 'slow'
            },
            anxious: {
                characteristics: ['fast_pace', 'high_pitch', 'stuttering', 'rapid_breathing'],
                keywords: ['worried', 'nervous', 'anxious', 'scared', 'what if', 'panic'],
                responses: {
                    calming: "Let's breathe together. You're safe in this moment.",
                    grounding: "I hear the anxiety. Try naming three things you can see around you.",
                    reassuring: "This feeling will pass. I'm right here with you."
                },
                tone: 'calm',
                pace: 'moderate'
            },
            angry: {
                characteristics: ['loud_volume', 'sharp_tones', 'fast_pace', 'clipped_words'],
                keywords: ['angry', 'mad', 'frustrated', 'pissed', 'hate', 'annoying'],
                responses: {
                    validating: "That frustration sounds really intense. Your feelings are valid.",
                    deescalating: "Anger often covers other emotions. Want to explore what's underneath?",
                    reflective: "It sounds like something really bothered you. Want to talk about it?"
                },
                tone: 'firm',
                pace: 'varied'
            },
            happy: {
                characteristics: ['bouncy_rhythm', 'varied_pitch', 'clear_articulation', 'laughter'],
                keywords: ['happy', 'good', 'great', 'excited', 'wonderful', 'amazing', 'yay'],
                responses: {
                    celebratory: "I love hearing this energy! What's bringing you joy?",
                    reinforcing: "This positive vibe is wonderful! Savor these moments.",
                    engaging: "Your enthusiasm is contagious! Tell me more!"
                },
                tone: 'bright',
                pace: 'energetic'
            },
            tired: {
                characteristics: ['slow_pace', 'low_energy', 'dragging_words', 'sighing'],
                keywords: ['tired', 'exhausted', 'sleepy', 'drained', 'burned out', 'fatigued'],
                responses: {
                    compassionate: "You sound really worn out. Rest is important too.",
                    gentle: "It's okay to slow down. Your body is telling you what it needs.",
                    supportive: "Being tired can make everything feel harder. Be gentle with yourself."
                },
                tone: 'soft',
                pace: 'slow'
            },
            neutral: {
                characteristics: ['steady_pace', 'medium_volume', 'clear_articulation'],
                keywords: ['okay', 'fine', 'alright', 'normal', 'neutral', 'meh'],
                responses: {
                    engaging: "You sound balanced and steady. How are you really feeling?",
                    curious: "I hear a neutral tone. What's on your mind?",
                    supportive: "Everything seems pretty steady. Want to explore anything specific?"
                },
                tone: 'balanced',
                pace: 'normal'
            }
        };
        
        this.conversationHistory = [];
    }

    // Main Analysis Method - Now with RAVDESS Integration
    analyzeVoicePattern(transcript, audioData = null) {
        let analysis;
        
        // Use RAVDESS Professional Analysis if available
        if (this.ravdessParser) {
            analysis = this.ravdessParser.analyzeWithRavdess(transcript, audioData);
            
            // Add our additional analysis on top
            analysis.enhanced = {
                pace: this.analyzePace(transcript),
                intensity: this.assessIntensity(transcript),
                keywords: this.extractKeywords(transcript)
            };
            
            console.log('🔬 RAVDESS Professional Analysis:', analysis);
            
        } else {
            // Fallback to Original Advanced Analysis
            analysis = {
                emotion: this.predictMoodFromText(transcript),
                pace: this.analyzePace(transcript),
                intensity: this.assessIntensity(transcript),
                keywords: this.extractKeywords(transcript),
                timestamp: Date.now()
            };
            
            analysis.confidence = this.calculateConfidence(analysis);
            analysis.recommendedResponse = this.getRecommendedResponse(analysis);
            
            console.log('🎤 Original Advanced Analysis:', analysis);
        }
        
        // Store for pattern recognition (Both systems)
        this.conversationHistory.push(analysis);
        if (this.conversationHistory.length > 10) {
            this.conversationHistory.shift();
        }
        
        return analysis;
    }

    // Original Analysis Methods (Keep as Fallback)
    analyzePace(transcript) {
        const words = transcript.split(' ');
        const wordCount = words.length;
        
        if (wordCount < 4) return 'very_slow';
        if (wordCount < 8) return 'slow';
        if (wordCount > 15) return 'fast';
        if (wordCount > 25) return 'very_fast';
        return 'normal';
    }

    predictMoodFromText(transcript) {
        const text = transcript.toLowerCase();
        const moodScores = {};
        
        // Score based on keyword density and patterns
        Object.keys(this.voicePatterns).forEach(mood => {
            let score = 0;
            const pattern = this.voicePatterns[mood];
            
            // Keyword matching with weights
            pattern.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    score += matches.length * 2;
                }
            });
            
            // Pattern-based scoring
            if (mood === 'depressed') {
                if (text.includes('can\'t') || text.includes('won\'t')) score += 2;
                if (text.includes('never') || text.includes('always')) score += 1;
            }
            
            if (mood === 'anxious') {
                if (text.includes('what if') || text.includes('worried that')) score += 3;
                if (text.includes('nervous about')) score += 2;
            }
            
            if (mood === 'angry') {
                if (text.includes('pissed') || text.includes('hate')) score += 3;
                if (text.match(/so\s+\w+!/)) score += 2; // "so annoying!"
            }
            
            if (mood === 'happy') {
                if (text.match(/!\s*$/)) score += 2; // Ends with exclamation
                if (text.includes('love') || text.includes('awesome')) score += 2;
            }
            
            moodScores[mood] = score;
        });
        
        // Return mood with highest score, or neutral if low scores
        const maxScore = Math.max(...Object.values(moodScores));
        if (maxScore < 2) return 'neutral';
        
        return Object.keys(moodScores).reduce((a, b) => 
            moodScores[a] > moodScores[b] ? a : b
        );
    }

    assessIntensity(transcript) {
        const intenseWords = ['very', 'really', 'extremely', 'absolutely', 'completely'];
        const intensePatterns = [/so \w+!/, /too \w+/, /can\'t stand/, /hate/];
        
        let intensity = 1; // Default low intensity
        
        intenseWords.forEach(word => {
            if (transcript.toLowerCase().includes(word)) intensity += 1;
        });
        
        intensePatterns.forEach(pattern => {
            if (pattern.test(transcript)) intensity += 1;
        });
        
        // Exclamation marks increase intensity
        const exclamations = (transcript.match(/!/g) || []).length;
        intensity += Math.min(exclamations, 3);
        
        return Math.min(intensity, 5); // Cap at 5
    }

    extractKeywords(transcript) {
        const words = transcript.toLowerCase().split(' ');
        const meaningfulWords = words.filter(word => 
            word.length > 3 && 
            !['this', 'that', 'with', 'have', 'just', 'like', 'well', 'maybe'].includes(word)
        );
        
        return meaningfulWords.slice(0, 5); // Return top 5 meaningful words
    }

    calculateConfidence(analysis) {
        let confidence = 0.5; // Base confidence
        
        // Higher confidence for clear mood signals
        if (analysis.emotion !== 'neutral') confidence += 0.2;
        
        // Higher confidence for intense emotions
        if (analysis.intensity >= 4) confidence += 0.15;
        
        // Higher confidence if we have historical patterns
        if (this.conversationHistory.length > 2) {
            const recentMoods = this.conversationHistory.slice(-3).map(h => h.emotion);
            const moodConsistency = new Set(recentMoods).size;
            if (moodConsistency === 1) confidence += 0.15; // Same mood recently
        }
        
        return Math.min(confidence, 0.95);
    }

    getRecommendedResponse(analysis) {
        const moodPattern = this.voicePatterns[analysis.emotion];
        if (!moodPattern) return "I hear you. Tell me more about how you're feeling.";
        
        const responseType = analysis.intensity >= 4 ? 
            Object.keys(moodPattern.responses)[0] : // Use first response for high intensity
            Object.keys(moodPattern.responses)[1];  // Use second for normal intensity
            
        return moodPattern.responses[responseType];
    }

    getConversationSummary() {
        if (this.conversationHistory.length === 0) {
            return "No conversation data yet.";
        }
        
        const moodCounts = {};
        this.conversationHistory.forEach(entry => {
            const mood = entry.emotion || entry.mood; // Handle both RAVDESS and original formats
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        const primaryMood = Object.entries(moodCounts)
            .sort(([,a], [,b]) => b - a)[0];
            
        return primaryMood ? 
            `Based on our conversation, you've been mostly ${primaryMood[0]}` :
            "Analyzing your conversation patterns...";
    }

    // New method to get analysis source
    getAnalysisSource() {
        return this.ravdessParser ? 
            "🔬 Professional RAVDESS Emotion Detection" : 
            "🎤 Advanced Pattern Analysis";
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.VoiceAnalyzer = VoiceAnalyzer;
}