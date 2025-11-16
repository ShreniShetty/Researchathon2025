// datasets/csv_text_analyzer.js - CSV-Based Text Analysis

class CSVTextAnalyzer {
    constructor() {
        this.datasets = {
            depression: null,
            anxiety: null,
            burnout: null,
            relationships: null,
            positive: null
        };
        
        this.loaded = false;
        this.patterns = this.initializeDefaultPatterns();
    }

    // Initialize with default patterns while CSV loads
    initializeDefaultPatterns() {
        return {
            depression: {
                keywords: ['sad', 'depressed', 'hopeless', 'empty', 'worthless'],
                responses: [
                    "I hear the pain in your words. That sounds incredibly heavy.",
                    "Thank you for sharing this with me. You're not alone in this darkness."
                ]
            },
            anxiety: {
                keywords: ['anxious', 'nervous', 'worried', 'panic', 'overwhelmed'],
                responses: [
                    "I hear the anxiety in your words. Let's breathe through this together.",
                    "The worry sounds overwhelming. You're safe in this moment."
                ]
            },
            burnout: {
                keywords: ['exhausted', 'burned out', 'drained', 'no energy'],
                responses: [
                    "You sound completely drained. Rest isn't lazy - it's necessary.",
                    "The exhaustion is real. What can you put down, even temporarily?"
                ]
            },
            relationships: {
                keywords: ['lonely', 'alone', 'relationship', 'breakup', 'argument'],
                responses: [
                    "Relationship struggles can be so painful. I'm here with you.",
                    "Loneliness hits deep. What does connection feel like for you?"
                ]
            },
            positive: {
                keywords: ['happy', 'good', 'great', 'excited', 'proud'],
                responses: [
                    "This is wonderful to hear! Your positive energy is contagious! 🌟",
                    "I'm so happy for you! Celebrate these moments!"
                ]
            }
        };
    }

    // Load CSV data from your files
    async loadCSVData() {
        try {
            // Load each CSV dataset
            await Promise.all([
                this.loadCSVFile('datasets/depression_patterns.csv', 'depression'),
                this.loadCSVFile('datasets/anxiety_patterns.csv', 'anxiety'),
                this.loadCSVFile('datasets/burnout_patterns.csv', 'burnout'),
                this.loadCSVFile('datasets/relationship_patterns.csv', 'relationships'),
                this.loadCSVFile('datasets/positive_patterns.csv', 'positive')
            ]);
            
            this.loaded = true;
            console.log('✅ All CSV datasets loaded successfully!');
        } catch (error) {
            console.warn('⚠️ CSV files not found, using default patterns:', error);
            this.loaded = false;
        }
    }

    async loadCSVFile(filePath, category) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`File not found: ${filePath}`);
            
            const csvText = await response.text();
            this.datasets[category] = this.parseCSV(csvText, category);
            console.log(`✅ Loaded ${category} dataset:`, this.datasets[category].length, 'patterns');
        } catch (error) {
            console.warn(`Could not load ${filePath}, using default patterns`);
            this.datasets[category] = this.getDefaultData(category);
        }
    }

    parseCSV(csvText, category) {
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const patterns = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const pattern = {};
            
            headers.forEach((header, index) => {
                if (values[index]) {
                    pattern[header] = values[index];
                }
            });
            
            if (Object.keys(pattern).length > 0) {
                patterns.push(pattern);
            }
        }
        
        return patterns;
    }

    getDefaultData(category) {
        // Return structured default data matching CSV format
        const defaultData = {
            depression: [
                { pattern: 'sad', intensity: 'high', response: 'I hear the sadness in your words.' },
                { pattern: 'hopeless', intensity: 'high', response: 'The hopelessness sounds overwhelming.' }
            ],
            anxiety: [
                { pattern: 'worried', intensity: 'medium', response: 'I hear the worry. Lets breathe together.' },
                { pattern: 'nervous', intensity: 'medium', response: 'The anxiety is real. Youre safe here.' }
            ],
            burnout: [
                { pattern: 'exhausted', intensity: 'medium', response: 'You sound completely drained.' },
                { pattern: 'no energy', intensity: 'medium', response: 'The exhaustion is valid.' }
            ],
            relationships: [
                { pattern: 'lonely', intensity: 'medium', response: 'Loneliness can be so painful.' },
                { pattern: 'breakup', intensity: 'high', response: 'Breakups are incredibly difficult.' }
            ],
            positive: [
                { pattern: 'happy', intensity: 'low', response: 'This is wonderful to hear!' },
                { pattern: 'proud', intensity: 'low', response: 'Im so happy for your achievement!' }
            ]
        };
        
        return defaultData[category] || [];
    }

    analyzeText(text) {
        const analysis = {
            detectedCategories: [],
            matchedPatterns: [],
            confidence: 0,
            suggestedResponses: [],
            csvBased: this.loaded,
            timestamp: Date.now()
        };

        const categoryScores = {};
        const matchedItems = [];

        // Analyze against each category
        Object.entries(this.datasets).forEach(([category, patterns]) => {
            if (!patterns) return;

            patterns.forEach(patternData => {
                const pattern = patternData.pattern || patternData.keyword || patternData.phrase;
                const intensity = patternData.intensity || 'medium';
                const response = patternData.response || patternData.suggested_response;
                
                if (pattern && this.matchesPattern(text, pattern)) {
                    // Score based on pattern match
                    const score = this.calculateMatchScore(text, pattern, intensity);
                    
                    categoryScores[category] = (categoryScores[category] || 0) + score;
                    
                    matchedItems.push({
                        category,
                        pattern,
                        intensity,
                        response,
                        score,
                        source: 'csv'
                    });
                }
            });
        });

        // Fallback to default patterns if no CSV matches
        if (matchedItems.length === 0) {
            return this.fallbackAnalysis(text);
        }

        // Process matches
        analysis.matchedPatterns = matchedItems
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // Determine primary categories
        analysis.detectedCategories = Object.entries(categoryScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([category, score]) => ({ category, score }));

        // Calculate overall confidence
        analysis.confidence = Math.min(
            Math.max(...Object.values(categoryScores)) / 10, 
            0.95
        );

        // Generate responses from matched patterns
        analysis.suggestedResponses = this.generateResponsesFromMatches(matchedItems);

        return analysis;
    }

    matchesPattern(text, pattern) {
        const cleanText = text.toLowerCase();
        const cleanPattern = pattern.toLowerCase();
        
        // Exact word match
        if (new RegExp(`\\b${cleanPattern}\\b`).test(cleanText)) {
            return true;
        }
        
        // Partial match for longer phrases
        if (cleanPattern.includes(' ') && cleanText.includes(cleanPattern)) {
            return true;
        }
        
        return false;
    }

    calculateMatchScore(text, pattern, intensity) {
        let score = 1;
        
        // Boost score for exact matches
        const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
            score += matches.length * 2;
        }
        
        // Intensity weighting
        const intensityWeights = { high: 3, medium: 2, low: 1 };
        score *= intensityWeights[intensity] || 1;
        
        // Context bonus for longer, more specific patterns
        if (pattern.length > 10) score += 2;
        
        return score;
    }

    fallbackAnalysis(text) {
        console.log('Using fallback analysis (no CSV matches)');
        
        // Use default pattern matching
        const analysis = {
            detectedCategories: [],
            matchedPatterns: [],
            confidence: 0.3,
            suggestedResponses: [
                "I hear you. Could you tell me more about what that's like?",
                "Thank you for sharing. What else is coming up for you?",
                "I'm listening. What's the emotional tone of this for you?"
            ],
            csvBased: false,
            timestamp: Date.now()
        };

        // Simple keyword matching as fallback
        Object.entries(this.patterns).forEach(([category, data]) => {
            data.keywords.forEach(keyword => {
                if (text.toLowerCase().includes(keyword)) {
                    analysis.matchedPatterns.push({
                        category,
                        pattern: keyword,
                        intensity: 'medium',
                        response: data.responses[0],
                        score: 2,
                        source: 'default'
                    });
                    
                    analysis.detectedCategories.push({
                        category,
                        score: 2
                    });
                }
            });
        });

        if (analysis.matchedPatterns.length > 0) {
            analysis.confidence = 0.6;
            analysis.suggestedResponses = analysis.matchedPatterns
                .map(match => match.response)
                .slice(0, 3);
        }

        return analysis;
    }

    generateResponsesFromMatches(matchedItems) {
        const responses = [];
        
        // Group by category and get top matches
        const byCategory = {};
        matchedItems.forEach(item => {
            if (!byCategory[item.category]) {
                byCategory[item.category] = [];
            }
            byCategory[item.category].push(item);
        });

        // Take top response from each major category
        Object.values(byCategory)
            .sort((a, b) => Math.max(...b.map(i => i.score)) - Math.max(...a.map(i => i.score)))
            .slice(0, 3)
            .forEach(categoryItems => {
                const topItem = categoryItems[0];
                if (topItem.response && !responses.includes(topItem.response)) {
                    responses.push(topItem.response);
                }
            });

        // Add some generic responses if we don't have enough
        while (responses.length < 3) {
            responses.push(
                "I hear you. Tell me more about how you're feeling.",
                "Thank you for sharing that with me.",
                "I'm here to listen and support you."
            );
        }

        return responses.slice(0, 5);
    }

    // Get dataset statistics
    getDatasetStats() {
        const stats = {
            loaded: this.loaded,
            categories: {},
            totalPatterns: 0
        };

        Object.entries(this.datasets).forEach(([category, patterns]) => {
            if (patterns) {
                stats.categories[category] = patterns.length;
                stats.totalPatterns += patterns.length;
            }
        });

        return stats;
    }

    // Export current patterns for training
    exportTrainingData(userInput, analysis, botResponse) {
        const trainingData = {
            input: userInput,
            analysis: analysis,
            response: botResponse,
            timestamp: new Date().toISOString(),
            csvBased: analysis.csvBased,
            matchedPatterns: analysis.matchedPatterns.map(m => ({
                category: m.category,
                pattern: m.pattern,
                score: m.score
            }))
        };

        console.log('📊 CSV Training Data:', trainingData);
        
        // In a real app, you could save this back to CSV
        this.saveToCSV(trainingData);
        
        return trainingData;
    }

    saveToCSV(trainingData) {
        // This would append to a training CSV file
        const csvRow = [
            trainingData.timestamp,
            `"${trainingData.input.replace(/"/g, '""')}"`,
            trainingData.analysis.detectedCategories.map(c => c.category).join(';'),
            trainingData.analysis.confidence,
            `"${trainingData.response.replace(/"/g, '""')}"`
        ].join(',');

        console.log('💾 CSV Row (for training):', csvRow);
        // In production: write to a CSV file
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.CSVTextAnalyzer = CSVTextAnalyzer;
}