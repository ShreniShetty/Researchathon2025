// datasets/ravdess_parser.js - RAVDESS Dataset Integration

class RavdessParser {
    constructor() {
        this.decodingTable = {
            modality: {
                '01': 'speech',
                '02': 'song', 
                '03': 'song_different_style'
            },
            vocalChannel: {
                '01': 'speech',
                '02': 'song'
            },
            emotion: {
                '01': 'neutral',
                '02': 'calm', 
                '03': 'happy',
                '04': 'sad',
                '05': 'angry',
                '06': 'fearful',
                '07': 'disgust',
                '08': 'surprised'
            },
            intensity: {
                '01': 'normal',
                '02': 'strong'
            },
            statement: {
                '01': 'kids_talking_by_door',
                '02': 'dogs_sitting_by_door'
            },
            repetition: {
                '01': 'first_repetition',
                '02': 'second_repetition'
            }
        };

        this.emotionMapping = {
            'neutral': {
                responses: [
                    "You sound very balanced and calm right now.",
                    "I hear a neutral tone - everything feeling steady?",
                    "Your voice sounds calm and collected."
                ],
                keywords: ['okay', 'fine', 'alright', 'normal'],
                tone: 'balanced'
            },
            'calm': {
                responses: [
                    "You have such a peaceful, calm energy right now.",
                    "I appreciate this calm and centered vibe.",
                    "Your calm tone is really soothing to hear."
                ],
                keywords: ['relaxed', 'peaceful', 'calm', 'chill'],
                tone: 'peaceful'
            },
            'happy': {
                responses: [
                    "Your happy energy is contagious! 😊",
                    "I love hearing this joyful tone!",
                    "This happiness sounds wonderful!"
                ],
                keywords: ['happy', 'good', 'great', 'excited', 'amazing'],
                tone: 'joyful'
            },
            'sad': {
                responses: [
                    "I hear the sadness in your voice. I'm here for you.",
                    "Your tone sounds heavy - want to talk about it?",
                    "I can hear you're feeling down. It's okay to feel this way."
                ],
                keywords: ['sad', 'depressed', 'unhappy', 'down', 'miserable'],
                tone: 'compassionate'
            },
            'angry': {
                responses: [
                    "I hear the frustration in your voice. That sounds intense.",
                    "Your angry tone tells me something's really bothering you.",
                    "That frustration sounds valid. Want to talk it through?"
                ],
                keywords: ['angry', 'mad', 'frustrated', 'annoyed', 'pissed'],
                tone: 'validating'
            },
            'fearful': {
                responses: [
                    "I hear the fear in your voice. You're safe here.",
                    "That scared tone - let's breathe through this together.",
                    "I sense the anxiety. Remember, this moment is safe."
                ],
                keywords: ['scared', 'afraid', 'fearful', 'nervous', 'anxious'],
                tone: 'reassuring'
            },
            'disgust': {
                responses: [
                    "I hear the distaste in your tone. Something really bothered you.",
                    "That disgust tells me something didn't sit right with you.",
                    "I sense strong disapproval. Want to explore what's behind it?"
                ],
                keywords: ['disgusting', 'gross', 'hate', 'awful', 'terrible'],
                tone: 'understanding'
            },
            'surprised': {
                responses: [
                    "You sound surprised! What happened?",
                    "That shocked tone - something unexpected?",
                    "I hear the surprise! Tell me more!"
                ],
                keywords: ['surprised', 'shocked', 'wow', 'unexpected', 'omg'],
                tone: 'curious'
            }
        };

        this.loadedSamples = [];
        this.audioContext = null;
    }

    // Parse filename like "01-01-05-01-01-01-01.wav"
    parseFilename(filename) {
        // Remove extension and split by dashes
        const baseName = filename.replace('.wav', '');
        const parts = baseName.split('-');
        
        if (parts.length < 4) {
            console.warn(`Invalid RAVDESS filename: ${filename}`);
            return null;
        }

        const [modality, vocalChannel, emotion, intensity, statement, repetition, actor] = parts;
        
        const parsed = {
            filename: filename,
            modality: this.decodingTable.modality[modality],
            vocalChannel: this.decodingTable.vocalChannel[vocalChannel],
            emotion: this.decodingTable.emotion[emotion],
            intensity: this.decodingTable.intensity[intensity],
            statement: statement ? this.decodingTable.statement[statement] : null,
            repetition: repetition ? this.decodingTable.repetition[repetition] : null,
            actor: actor || null,
            gender: actor ? (parseInt(actor) % 2 === 1 ? 'male' : 'female') : null
        };

        return parsed;
    }

    // Load your dataset structure
    async loadDatasetStructure() {
        // This would scan your dataset folder in a real implementation
        // For now, we'll create a mock structure based on your files
        
        const mockFiles = [
            '01-01-01-01-01-01-01.wav', // Neutral speech
            '01-01-02-01-01-01-02.wav', // Calm female
            '01-01-03-01-01-01-03.wav', // Happy male
            '01-01-04-01-01-01-04.wav', // Sad female
            '01-01-05-01-01-01-05.wav', // Angry male
            '01-01-05-02-01-01-06.wav', // Angry strong intensity female
            '01-01-06-01-01-01-07.wav', // Fearful male
            '01-01-07-01-01-01-08.wav', // Disgust female
            '01-01-08-01-01-01-09.wav', // Surprised male
        ];

        this.loadedSamples = mockFiles.map(file => this.parseFilename(file)).filter(Boolean);
        console.log('Loaded RAVDESS samples:', this.loadedSamples);
        
        return this.loadedSamples;
    }

    // Analyze user input against RAVDESS patterns
    analyzeWithRavdess(transcript, audioFeatures = {}) {
        const textAnalysis = this.analyzeTextPattern(transcript);
        const voiceAnalysis = this.analyzeVoicePattern(audioFeatures);
        
        // Combine text and voice analysis
        const combinedEmotion = this.combineAnalyses(textAnalysis, voiceAnalysis);
        
        return {
            emotion: combinedEmotion.emotion,
            confidence: combinedEmotion.confidence,
            intensity: combinedEmotion.intensity,
            ravdessMatch: combinedEmotion.ravdessMatch,
            response: this.getRavdessResponse(combinedEmotion.emotion, combinedEmotion.intensity),
            analysis: {
                text: textAnalysis,
                voice: voiceAnalysis
            }
        };
    }

    analyzeTextPattern(transcript) {
        const text = transcript.toLowerCase();
        const scores = {};
        
        // Initialize all emotions
        Object.keys(this.emotionMapping).forEach(emotion => {
            scores[emotion] = 0;
        });

        // Score based on keywords
        Object.entries(this.emotionMapping).forEach(([emotion, data]) => {
            data.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    scores[emotion] += matches.length * 2;
                }
            });
        });

        // Additional pattern matching
        if (text.includes('!') && text.length < 20) scores['surprised'] += 2;
        if (text.includes('...') || text.includes('uh') || text.includes('um')) scores['fearful'] += 1;
        if (text.match(/so\s+\w+!/)) scores['angry'] += 2; // "so annoying!"
        if (text.match(/i can't/i)) scores['sad'] += 1;
        if (text.match(/i love/i)) scores['happy'] += 2;

        // Find dominant emotion
        const dominantEmotion = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );

        return {
            emotion: dominantEmotion,
            confidence: Math.min(scores[dominantEmotion] / 10, 1),
            scores: scores
        };
    }

    analyzeVoicePattern(audioFeatures) {
        // In a real app, this would analyze actual audio features
        // For now, simulate based on RAVDESS patterns
        
        const emotions = Object.keys(this.emotionMapping);
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        return {
            emotion: randomEmotion,
            confidence: 0.3 + Math.random() * 0.4,
            features: {
                pitch: 'medium',
                pace: 'normal',
                volume: 'medium'
            }
        };
    }

    combineAnalyses(textAnalysis, voiceAnalysis) {
        // Weight text analysis more heavily (70% text, 30% voice)
        const textWeight = 0.7;
        const voiceWeight = 0.3;
        
        const combinedScores = {};
        
        // Combine scores from both analyses
        Object.keys(this.emotionMapping).forEach(emotion => {
            const textScore = textAnalysis.scores[emotion] || 0;
            const voiceScore = (voiceAnalysis.emotion === emotion) ? voiceAnalysis.confidence * 10 : 0;
            
            combinedScores[emotion] = (textScore * textWeight) + (voiceScore * voiceWeight);
        });

        const dominantEmotion = Object.keys(combinedScores).reduce((a, b) => 
            combinedScores[a] > combinedScores[b] ? a : b
        );

        const maxScore = Math.max(...Object.values(combinedScores));
        const confidence = Math.min(maxScore / 10, 1);

        // Find closest RAVDESS match
        const ravdessMatch = this.findClosestRavdessSample(dominantEmotion);

        return {
            emotion: dominantEmotion,
            confidence: confidence,
            intensity: confidence > 0.7 ? 'strong' : 'normal',
            ravdessMatch: ravdessMatch,
            combinedScores: combinedScores
        };
    }

    findClosestRavdessSample(emotion) {
        const matchingSamples = this.loadedSamples.filter(sample => 
            sample.emotion === emotion
        );
        
        if (matchingSamples.length > 0) {
            return matchingSamples[Math.floor(Math.random() * matchingSamples.length)];
        }
        
        // Fallback to any sample
        return this.loadedSamples[Math.floor(Math.random() * this.loadedSamples.length)];
    }

    getRavdessResponse(emotion, intensity) {
        const mapping = this.emotionMapping[emotion];
        if (!mapping) return "I hear you. Tell me more about how you're feeling.";

        const responses = mapping.responses;
        const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add intensity modifier
        if (intensity === 'strong') {
            return `[Strong emotion detected] ${selectedResponse}`;
        }
        
        return selectedResponse;
    }

    // For training and data collection
    logUserInteraction(userInput, detectedEmotion, confidence) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            userInput: userInput,
            detectedEmotion: detectedEmotion,
            confidence: confidence,
            ravdessReference: this.findClosestRavdessSample(detectedEmotion)
        };
        
        // In a real app, you'd save this to a file or database
        console.log('RAVDESS Interaction Log:', logEntry);
        
        return logEntry;
    }

    // Get dataset statistics
    getDatasetStats() {
        const stats = {
            totalSamples: this.loadedSamples.length,
            emotions: {},
            genders: {},
            modalities: {}
        };

        this.loadedSamples.forEach(sample => {
            // Emotion stats
            stats.emotions[sample.emotion] = (stats.emotions[sample.emotion] || 0) + 1;
            
            // Gender stats
            if (sample.gender) {
                stats.genders[sample.gender] = (stats.genders[sample.gender] || 0) + 1;
            }
            
            // Modality stats
            stats.modalities[sample.modality] = (stats.modalities[sample.modality] || 0) + 1;
        });

        return stats;
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.RavdessParser = RavdessParser;
}