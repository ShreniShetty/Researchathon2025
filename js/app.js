// Main application controller
class MentalHealthBuddyApp {
    constructor() {
        this.currentTab = 'facial';
        this.facialData = null;
        this.voiceData = null;
        this.textData = null;
        this.chatHistory = [];
        
        this.init();
    }
    
    init() {
        this.setupTabHandlers();
        this.setupFacialHandlers();
        this.setupVoiceHandlers();
        this.setupTextHandlers();
        this.setupCombinedHandlers();
        this.setupChatHandlers();
        this.setupProfessionalFinder();
        
        console.log("Mental Health Buddy initialized");
    }
    
    setupTabHandlers() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    setupChatHandlers() {
        const sendMessageBtn = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        
        sendMessageBtn.addEventListener('click', () => {
            this.sendChatMessage();
        });
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendChatMessage();
            }
        });
        
        // Initialize chat
        this.initializeChat();
    }
    
    initializeChat() {
        this.chatHistory = [
            { role: 'bot', message: 'Hey bestie! 👋 What\'s the vibe today? Spill the tea! ☕', timestamp: new Date() }
        ];
    }
    
    async sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
    
        this.addMessageToChat('user', message);
        chatInput.value = '';
    
        this.showTypingIndicator();

        try {
            const analysis = await emotionDetector.analyzeText(message);
            const response = genZChatbot.generatePersonalizedResponse(message, analysis, this.chatHistory);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add bot response to chat
            this.addMessageToChat('bot', response);
            
            // Update analysis display
            this.displayChatAnalysis(analysis);
            
        } catch (error) {
            console.error('Error in chat:', error);
            this.removeTypingIndicator();
            this.addMessageToChat('bot', 'Oops! Something went wrong fam 😅 Can you try that again?');
        }
    }
    
    addMessageToChat(role, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-time">${timestamp}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        this.chatHistory.push({ role, message, timestamp: new Date() });
    }
    
    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    Thinking...
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async generateGenZResponse(userMessage, analysis) {
        // This is where you'd integrate with a more sophisticated AI model
        // For now, we'll use pattern matching with Gen Z flair
        
        const emotion = analysis.emotion;
        const keywords = analysis.keywords;
        
        // Gen Z responses based on emotion and content
        const responseTemplates = {
            happy: [
                "Yasss queen! Love that for you! ✨",
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
        
        const keywordResponses = {
            'school': "Ugh academia is such a grind 😫 You surviving?",
            'work': "The 9-5 struggle is real 😮‍💨 Hope you're taking breaks!",
            'friends': "Squad goals or drama? 👀 Spill!",
            'family': "Family can be a whole mood sometimes 😅",
            'food': "Yesss food is the best therapy! What's your go-to snack? 🍕",
            'sleep': "Sleep is so underrated! Get those Z's queen 💤",
            'music': "Ooo what's on your playlist rn? Need recommendations? 🎵",
            'anime': "A fellow person of culture I see! What're you watching? 📺"
        };
        
        for (const keyword of keywords) {
            if (keywordResponses[keyword]) {
                return keywordResponses[keyword];
            }
        }
        
        if (userMessage.includes('?') || userMessage.toLowerCase().includes('should i') || userMessage.toLowerCase().includes('what do')) {
            const questionResponses = [
                "Hmm that's a whole dilemma 😬 Follow your heart bestie!",
                "Ooo tough one! My two cents: trust your gut 💫",
                "That's above my pay grade ngl 😅 But you know what's best for you!",
                "The way I see it, do what feels right for YOUR peace 🌟",
                "That's such a personal decision! Whatever you choose, you've got this 💪"
            ];
            return questionResponses[Math.floor(Math.random() * questionResponses.length)];
        }
        
        const emotionResponses = responseTemplates[emotion] || responseTemplates.neutral;
        return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
    }
    
    displayChatAnalysis(analysis) {
        const analysisDiv = document.getElementById('chatAnalysisResult');
        
        analysisDiv.innerHTML = `
            <h4>Real-time Text Analysis</h4>
            <p><strong>Detected Emotion:</strong> ${analysis.emotion}</p>
            <p><strong>Confidence:</strong> ${(analysis.confidence * 100).toFixed(2)}%</p>
            <p><strong>Keywords:</strong> ${analysis.keywords.join(', ') || 'None detected'}</p>
            <p><strong>Response Style:</strong> Gen Z Support Mode 💫</p>
        `;
    }
    
    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        
        this.currentTab = tabId;
    }
    
    setupFacialHandlers() {
        const startCameraBtn = document.getElementById('startCamera');
        const captureExpressionBtn = document.getElementById('captureExpression');
        const stopCameraBtn = document.getElementById('stopCamera');
        
        startCameraBtn.addEventListener('click', () => {
            imageFaceDetector.startCamera();
        });
        
        captureExpressionBtn.addEventListener('click', async () => {
            this.facialData = await imageFaceDetector.captureExpression();
            this.updateStatus('facial', 'Analyzed');
            this.displayFacialResult(this.facialData);
        });
        
        stopCameraBtn.addEventListener('click', () => {
            imageFaceDetector.stopCamera();
        });
    }
    
    setupVoiceHandlers() {
        const startRecordingBtn = document.getElementById('startRecording');
        const stopRecordingBtn = document.getElementById('stopRecording');
        const playSampleBtn = document.getElementById('playSample');
        
        startRecordingBtn.addEventListener('click', () => {
            voiceAnalyser.startRecording();
            startRecordingBtn.disabled = true;
            stopRecordingBtn.disabled = false;
        });
        
        stopRecordingBtn.addEventListener('click', async () => {
            this.voiceData = await voiceAnalyser.stopRecording();
            startRecordingBtn.disabled = false;
            stopRecordingBtn.disabled = true;
            this.updateStatus('voice', 'Analyzed');
            this.displayVoiceResult(this.voiceData);
        });
        
        playSampleBtn.addEventListener('click', () => {
            voiceAnalyser.playSampleAudio();
        });
    }
    
    setupTextHandlers() {
        const analyzeTextBtn = document.getElementById('analyzeText');
        const loadSampleTextBtn = document.getElementById('loadSampleText');
        
        analyzeTextBtn.addEventListener('click', async () => {
            const textInput = document.getElementById('textInput').value;
            if (textInput.trim() === '') {
                alert('Please enter some text to analyze');
                return;
            }
            
            this.textData = await emotionDetector.analyzeText(textInput);
            this.updateStatus('text', 'Analyzed');
            this.displayTextResult(this.textData);
        });
        
        loadSampleTextBtn.addEventListener('click', () => {
            const sampleTexts = [
                "I've been feeling really down lately and don't know why.",
                "Today was amazing! I accomplished so much and feel great!",
                "I'm so anxious about my upcoming presentation at work.",
                "I feel exhausted all the time, no matter how much I sleep.",
                "I'm content with how things are going in my life right now."
            ];
            
            const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
            document.getElementById('textInput').value = randomText;
        });
    }
    
    setupCombinedHandlers() {
        const runCombinedAnalysisBtn = document.getElementById('runCombinedAnalysis');
        
        runCombinedAnalysisBtn.addEventListener('click', () => {
            this.runCombinedAnalysis();
        });
    }
    
    displayFacialResult(data) {
        const resultDiv = document.getElementById('facialResult');
        
        if (data && data.emotion) {
            resultDiv.innerHTML = `
                <h3>Facial Expression Analysis Result</h3>
                <p><strong>Detected Emotion:</strong> ${data.emotion}</p>
                <p><strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
                <p><strong>Response:</strong> ${this.getFacialResponse(data.emotion)}</p>
            `;
        } else {
            resultDiv.innerHTML = `<p>No facial expression detected. Please try again.</p>`;
        }
    }
    
    displayVoiceResult(data) {
        const resultDiv = document.getElementById('voiceResult');
        
        if (data && data.emotion) {
            resultDiv.innerHTML = `
                <h3>Voice Analysis Result</h3>
                <p><strong>Detected Emotion:</strong> ${data.emotion}</p>
                <p><strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
                <p><strong>Response:</strong> ${this.getVoiceResponse(data.emotion)}</p>
            `;
        } else {
            resultDiv.innerHTML = `<p>No voice data analyzed. Please try again.</p>`;
        }
    }
    
    displayTextResult(data) {
        const resultDiv = document.getElementById('textResult');
        
        if (data && data.emotion) {
            resultDiv.innerHTML = `
                <h3>Text Analysis Result</h3>
                <p><strong>Detected Emotion:</strong> ${data.emotion}</p>
                <p><strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
                <p><strong>Keywords:</strong> ${data.keywords ? data.keywords.join(', ') : 'N/A'}</p>
                <p><strong>Response:</strong> ${this.getTextResponse(data.emotion)}</p>
            `;
        } else {
            resultDiv.innerHTML = `<p>No text data analyzed. Please try again.</p>`;
        }
    }
    
    async runCombinedAnalysis() {
        // Check if we have data from all three sources
        if (!this.facialData || !this.voiceData || !this.textData) {
            alert('Please analyze facial, voice, and text inputs first before running combined analysis.');
            return;
        }
        
        const resultDiv = document.getElementById('combinedResult');
        resultDiv.innerHTML = `<p>Analyzing all inputs to generate personalized response...</p>`;
        
        // Simulate processing time
        setTimeout(() => {
            const combinedResult = this.generateCombinedResponse();
            resultDiv.innerHTML = `
                <h3>Personalized Response</h3>
                <div class="combined-insights">
                    <h4>Emotional Insights:</h4>
                    <ul>
                        <li><strong>Facial Expression:</strong> ${this.facialData.emotion}</li>
                        <li><strong>Voice Modulation:</strong> ${this.voiceData.emotion}</li>
                        <li><strong>Text Pattern:</strong> ${this.textData.emotion}</li>
                    </ul>
                </div>
                <div class="personalized-response">
                    <h4>Your Personalized Response:</h4>
                    <p>${combinedResult}</p>
                </div>
            `;
        }, 2000);
    }
    
    generateCombinedResponse() {
        // This is a simplified example - in a real application, you would use
        // a more sophisticated algorithm to combine the three inputs
        
        const emotions = [
            this.facialData.emotion,
            this.voiceData.emotion,
            this.textData.emotion
        ];
        
        // Count occurrences of each emotion
        const emotionCount = {};
        emotions.forEach(emotion => {
            emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        });
        
        // Find the most common emotion
        let dominantEmotion = emotions[0];
        let maxCount = 1;
        
        for (const emotion in emotionCount) {
            if (emotionCount[emotion] > maxCount) {
                dominantEmotion = emotion;
                maxCount = emotionCount[emotion];
            }
        }
        
        // Generate response based on dominant emotion
        return this.getCombinedResponse(dominantEmotion);
    }
    
    getFacialResponse(emotion) {
        const responses = {
            'happy': "I can see you're feeling happy! That's wonderful. Let's celebrate this positive moment together.",
            'sad': "I notice you might be feeling sad. It's okay to feel this way. Would you like to talk about what's on your mind?",
            'angry': "I sense some anger in your expression. Taking a few deep breaths might help calm those feelings.",
            'anxious': "You appear to be feeling anxious. Remember to breathe deeply - you've handled difficult situations before.",
            'tired': "You look tired. Rest is important for our mental health. Maybe take a short break?",
            'neutral': "Your expression appears neutral. How are you really feeling today?"
        };
        
        return responses[emotion] || "I see your expression, but I'm not sure what you're feeling. Would you like to share more?";
    }
    
    getVoiceResponse(emotion) {
        const responses = {
            'happy': "Your voice sounds cheerful! It's great to hear you in such good spirits.",
            'sad': "Your voice suggests you might be feeling down. I'm here to listen if you want to talk.",
            'angry': "I can hear tension in your voice. Sometimes expressing our feelings in words can help.",
            'anxious': "Your voice sounds a bit stressed. Remember, it's okay to take things one step at a time.",
            'tired': "Your voice sounds weary. Rest and self-care are important right now.",
            'neutral': "Your voice sounds calm and steady. How are you feeling beneath the surface?"
        };
        
        return responses[emotion] || "I've analyzed your voice, but I'm not certain about your emotional state. Could you tell me more?";
    }
    
    getTextResponse(emotion) {
        const responses = {
            'happy': "Your words radiate positivity! It's wonderful to see you in such good spirits.",
            'sad': "Your text suggests you might be feeling low. Remember that difficult feelings are temporary.",
            'angry': "I sense frustration in your words. Acknowledging these feelings is the first step to addressing them.",
            'anxious': "Your writing shows signs of worry. Breaking things down into smaller steps might help.",
            'tired': "Your text indicates you might be feeling drained. Be kind to yourself during this time.",
            'neutral': "Your writing seems balanced. Would you like to explore your feelings further?"
        };
        
        return responses[emotion] || "I've read your words, but I'd like to understand your emotional state better. Could you share more?";
    }
    
    getCombinedResponse(dominantEmotion) {
        const responses = {
            'happy': "Based on your facial expression, voice, and words, you seem to be in a positive state! This is wonderful. Consider journaling about what's making you happy to reinforce these positive feelings. You might also want to share this positivity with someone who could use encouragement.",
            'sad': "Your expressions, voice, and words all point toward sadness. Please remember that it's completely okay to feel this way. Sadness is a natural human emotion. You might find comfort in talking with a trusted friend, engaging in a comforting activity, or simply allowing yourself to rest. This feeling will pass.",
            'angry': "I'm detecting anger across multiple channels. When we feel angry, it's often a signal that something important to us has been threatened or violated. Try taking a few deep breaths, going for a walk, or writing down your feelings before responding to whatever triggered this emotion. Your feelings are valid, but how you express them matters.",
            'anxious': "Your facial cues, vocal patterns, and word choices all suggest anxiety. Remember that anxiety often exaggerates threats. Try grounding techniques like naming five things you can see, four you can touch, three you can hear, two you can smell, and one you can taste. Breaking overwhelming situations into smaller, manageable steps can also help.",
            'tired': "Across all inputs, I'm noticing signs of fatigue. Your mind and body might be asking for rest. Consider whether you've been pushing yourself too hard lately. Even small breaks, proper hydration, and a few moments of quiet can make a significant difference. Your wellbeing is important.",
            'neutral': "Your expressions, voice, and text all appear relatively balanced. This stability can be a good foundation for self-reflection. How are you really feeling beneath the surface? Sometimes neutral states mask other emotions. Checking in with yourself through meditation or journaling might reveal more about your current emotional landscape."
        };
        
        return responses[dominantEmotion] || "I've analyzed all your inputs, but I'm having trouble determining a clear emotional state. This might be a complex moment for you. Would you like to explore what you're experiencing in more detail?";
    }
    
    updateStatus(type, status) {
        const statusElement = document.getElementById(`${type}Status`);
        statusElement.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${status}`;
        
        if (status === 'Analyzed') {
            statusElement.classList.add('ready');
        }
    }
    setupProfessionalFinder() {
        // Initialize professional finder when tab is activated
        const professionalsTab = document.querySelector('[data-tab="professionals"]');
        if (professionalsTab) {
            professionalsTab.addEventListener('click', () => {
                setTimeout(() => {
                    if (typeof professionalFinderUI !== 'undefined') {
                        professionalFinderUI.initialize();
                    }
                }, 100);
            });
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MentalHealthBuddyApp();
});