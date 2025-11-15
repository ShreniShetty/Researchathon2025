// app.js - Mental Health Buddy with Face Detection & Daily Quotes

class MentalHealthBuddy {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.conversationHistory = [];
        this.lastResponseTime = 0;
        this.faceDetectionInterval = null;
        this.currentMood = 'neutral';
        
        // DOM Elements
        this.video = document.getElementById('videoFeed');
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.statusDiv = document.getElementById('status');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.analyzeFaceBtn = document.getElementById('analyzeFaceBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.faceStatus = document.getElementById('faceStatus');
        this.currentMoodSpan = document.getElementById('currentMood');
        this.detectedEmotionSpan = document.getElementById('detectedEmotion');
        this.dailyQuote = document.getElementById('dailyQuote');
        
        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.setupWebcam();
        this.setupEventListeners();
        this.setupDailyQuote();
        setTimeout(() => this.showWelcomeMessage(), 1000);
    }

    setupVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.addMessage("bot", "Hey! Voice stuff isn't working but you can totally type to me 💬");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateStatus('🎤 Listening... go ahead!');
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.startBtn.classList.remove('pulse');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateStatus('Hmm let me think about that...');
            setTimeout(() => {
                if (!this.isListening) {
                    this.startBtn.disabled = false;
                    this.stopBtn.disabled = true;
                    this.updateStatus('Ready when you are 👂');
                    this.startBtn.classList.add('pulse');
                }
            }, 2000);
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.updateStatus(`Heard: "${transcript}"`);
            this.processUserMessage(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.updateStatus('Whoops my ears glitched 😅 Try again?');
            this.isListening = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
        };
    }

    setupWebcam() {
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 320, 
                height: 240,
                facingMode: "user" 
            } 
        })
        .then(stream => {
            this.video.srcObject = stream;
            this.updateFaceStatus('✅ Camera active - Face detection ready');
            
            // Start basic face detection simulation
            this.startFaceDetection();
        })
        .catch(err => {
            console.error("Webcam not available:", err);
            this.updateFaceStatus('❌ Camera not available');
            this.addMessage("bot", "No worries! I can still chat with you through voice or text 😊");
        });
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            this.startListening();
        });

        this.stopBtn.addEventListener('click', () => {
            this.stopListening();
        });

        this.sendBtn.addEventListener('click', () => {
            this.handleUserInput();
        });

        this.analyzeFaceBtn.addEventListener('click', () => {
            this.analyzeFaceExpression();
        });

        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });

        this.startBtn.classList.add('pulse');
    }

    setupDailyQuote() {
        const quotes = [
            "Your present circumstances don't determine where you can go; they merely determine where you start. - Nido Qubein",
            "The only way to do great work is to love what you do. - Steve Jobs",
            "It's okay to not be okay. Just don't give up. - Unknown",
            "You are enough just as you are. - Meghan Markle",
            "The flower that blooms in adversity is the most rare and beautiful of all. - Mulan",
            "This too shall pass. - Persian Proverb",
            "You can't stop the waves, but you can learn to surf. - Jon Kabat-Zinn",
            "Be yourself; everyone else is already taken. - Oscar Wilde",
            "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
            "The only journey is the one within. - Rainer Maria Rilke",
            "You yourself, as much as anybody in the entire universe, deserve your love and affection. - Buddha",
            "Mental health is not a destination, but a process. It's about how you drive, not where you're going. - Noam Shpancer",
            "Your feelings are valid. Always. - Unknown",
            "It's during our darkest moments that we must focus to see the light. - Aristotle",
            "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle. - Julian Seifter"
        ];

        // Get a consistent daily quote based on the date
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quoteIndex = dayOfYear % quotes.length;
        
        this.dailyQuote.textContent = quotes[quoteIndex];
    }

    startFaceDetection() {
        // Simulate basic face detection since we can't use real APIs without keys
        this.faceDetectionInterval = setInterval(() => {
            this.simulateFaceDetection();
        }, 3000);
    }

    simulateFaceDetection() {
        const moods = ['neutral', 'happy', 'sad', 'focused', 'tired', 'calm'];
        const emotions = ['😐 Neutral', '😊 Happy', '😢 Sad', '🤔 Thinking', '😴 Tired', '😌 Calm'];
        
        // Randomly change mood occasionally to simulate detection
        if (Math.random() < 0.3) {
            const randomIndex = Math.floor(Math.random() * moods.length);
            this.currentMood = moods[randomIndex];
            this.currentMoodSpan.textContent = this.currentMood;
            this.detectedEmotionSpan.textContent = emotions[randomIndex];
            
            // Update face status with detection info
            this.updateFaceStatus(`👀 Detected: ${emotions[randomIndex]}`);
        }
    }

    analyzeFaceExpression() {
        this.updateStatus('📸 Analyzing your expression...');
        
        // Simulate face analysis
        setTimeout(() => {
            const expressions = [
                "I notice you look a bit thoughtful today. Everything okay?",
                "You seem pretty calm and collected right now. That's a good vibe!",
                "I'm picking up some tired energy. Remember to rest when you need to 💤",
                "You've got a focused look! Working on something important?",
                "I sense a bit of tension. Want to talk about what's on your mind?",
                "You seem pretty neutral right now. How are you really feeling behind that expression?"
            ];
            
            const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
            
            this.addMessage("bot", randomExpression);
            this.speak(randomExpression);
            this.updateStatus('Expression analyzed!');
            
        }, 2000);
    }

    updateFaceStatus(message) {
        this.faceStatus.textContent = message;
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage("bot", "Hey! 👋 I can see you through your camera now. I'll try to understand how you're feeling from your expressions too. How's your day going?");
            }, 1800);
        }, 500);
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    updateStatus(message) {
        this.statusDiv.textContent = message;
    }

    handleUserInput() {
        const message = this.userInput.value.trim();
        if (message) {
            this.userInput.value = '';
            this.processUserMessage(message);
        }
    }

    async processUserMessage(userMessage) {
        this.addMessage("user", userMessage);
        
        this.conversationHistory.push({ role: 'user', content: userMessage, timestamp: Date.now() });
        if (this.conversationHistory.length > 8) {
            this.conversationHistory.shift();
        }

        const thinkingTime = this.calculateThinkingTime(userMessage);
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            const response = this.generateHumanResponse(userMessage);
            this.hideTypingIndicator();
            
            if (Math.random() < 0.3) {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    const followUp = this.addHumanTouches(response);
                    this.addMessage("bot", followUp);
                    this.speak(followUp);
                }, 800);
            } else {
                const finalResponse = this.addHumanTouches(response);
                this.addMessage("bot", finalResponse);
                this.speak(finalResponse);
            }
        }, thinkingTime);
    }

    calculateThinkingTime(message) {
        const baseTime = 1000;
        const lengthFactor = message.length * 15;
        const complexityFactor = this.assessComplexity(message) * 500;
        const randomVariance = Math.random() * 1500;
        
        return baseTime + lengthFactor + complexityFactor + randomVariance;
    }

    assessComplexity(message) {
        let complexity = 1;
        if (message.length > 100) complexity += 1;
        if (message.includes('?') && message.length > 50) complexity += 1;
        if (this.containsEmotionalWords(message)) complexity += 1;
        if (this.containsComplexTopics(message)) complexity += 1;
        return Math.min(complexity, 4);
    }

    containsEmotionalWords(message) {
        const emotionalWords = ['depressed', 'anxious', 'suicidal', 'trauma', 'abuse', 'grief', 'panic', 'hopeless'];
        return emotionalWords.some(word => message.toLowerCase().includes(word));
    }

    containsComplexTopics(message) {
        const complexTopics = ['family', 'relationship', 'work', 'future', 'purpose', 'meaning', 'death'];
        return complexTopics.some(topic => message.toLowerCase().includes(topic));
    }

    generateHumanResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const now = Date.now();
        const timeSinceLast = now - this.lastResponseTime;
        this.lastResponseTime = now;

        if (timeSinceLast < 30000 && Math.random() < 0.4) {
            const quickAcks = [
                "Oh wait also",
                "And like",
                "Actually one more thing",
                "Oh and btw",
                "Quick thought",
                "Also real quick"
            ];
            const ack = quickAcks[Math.floor(Math.random() * quickAcks.length)];
            return ack + " " + this.getMainResponse(message);
        }

        return this.getMainResponse(message);
    }

    getMainResponse(message) {
        if (this.isGreeting(message)) return this.getGreetingResponse();
        if (this.isAboutSleep(message)) return this.getSleepResponse(message);
        if (this.isAboutWork(message)) return this.getWorkResponse(message);
        if (this.isAboutRelationships(message)) return this.getRelationshipResponse(message);
        if (this.isAboutAnxiety(message)) return this.getAnxietyResponse(message);
        if (this.isAboutDepression(message)) return this.getDepressionResponse(message);
        if (this.isAboutLoneliness(message)) return this.getLonelinessResponse(message);
        if (this.isAboutStress(message)) return this.getStressResponse(message);
        if (this.isPositive(message)) return this.getPositiveResponse();
        if (this.isAskingForHelp(message)) return this.getHelpResponse();

        return this.getContextualResponse(message);
    }

    addHumanTouches(response) {
        let finalResponse = response;

        if (Math.random() < 0.3) {
            const starters = ["Hmm", "Well", "So", "I mean", "Like", "You know", "Tbh"];
            const starter = starters[Math.floor(Math.random() * starters.length)];
            finalResponse = starter + "... " + finalResponse.toLowerCase();
        }

        if (Math.random() < 0.4) {
            const fillers = ["like", "you know", "I mean", "sort of", "kind of", "actually"];
            const words = finalResponse.split(' ');
            if (words.length > 8) {
                const insertAt = Math.floor(Math.random() * (words.length - 3)) + 2;
                words.splice(insertAt, 0, fillers[Math.floor(Math.random() * fillers.length)]);
                finalResponse = words.join(' ');
            }
        }

        if (Math.random() < 0.25) {
            const afterthoughts = [
                " idk",
                " you know?",
                " but yeah",
                " I guess",
                " or something",
                " lol",
                " 😅",
                " 🫠",
                " but anyway"
            ];
            finalResponse += afterthoughts[Math.floor(Math.random() * afterthoughts.length)];
        }

        if (Math.random() < 0.2) {
            finalResponse = finalResponse
                .replace(/ing /g, "in' ")
                .replace(/you /g, "u ")
                .replace(/ because /g, " bc ")
                .replace(/ though /g, " tho ");
        }

        return finalResponse;
    }

    isGreeting(message) { return /^(hi|hello|hey|yo|sup|what's up|howdy)/i.test(message) || (message.includes('how are you') && message.length < 25); }
    isAboutSleep(message) { return message.includes('sleep') || message.includes('tired') || message.includes('insomnia'); }
    isAboutWork(message) { return message.includes('work') || message.includes('job') || message.includes('career'); }
    isAboutRelationships(message) { return message.includes('friend') || message.includes('partner') || message.includes('relationship'); }
    isAboutAnxiety(message) { return message.includes('anxious') || message.includes('anxiety') || message.includes('nervous'); }
    isAboutDepression(message) { return message.includes('depress') || message.includes('sad') || message.includes('hopeless'); }
    isAboutLoneliness(message) { return message.includes('lonely') || message.includes('alone') || message.includes('isolated'); }
    isAboutStress(message) { return message.includes('stress') || message.includes('overwhelm') || message.includes('pressure'); }
    isPositive(message) { return message.includes('good') || message.includes('great') || message.includes('happy'); }
    isAskingForHelp(message) { return message.includes('help') || message.includes('what should') || message.includes('advice'); }

    getGreetingResponse() {
        const responses = [
            "Hey! How's it going?",
            "Oh hi! Was just thinking about checking in. What's new?",
            "Hey hey! Good to hear from you 😊 How are you feeling?",
            "Oh hey! Sorry was distracted for a sec. How's your day been?"
        ];
        return this.getRandomResponse(responses);
    }

    getSleepResponse(message) {
        const responses = [
            "Ugh sleep struggles are the worst 😴 I've been there. What's keeping you up?",
            "No sleep gang 😫 That's rough. Sometimes I put on boring podcasts to knock out",
            "The 3AM brain rot is real 😮‍💨 What usually helps you wind down?"
        ];
        return this.getRandomResponse(responses);
    }

    getWorkResponse(message) {
        const responses = [
            "Work stress is no joke 😮‍💨 What's been the most overwhelming part?",
            "Ugh work can be such a drain sometimes 😪 Remember to take breaks!",
            "The grind is real 😅 What boundaries are you setting for yourself?"
        ];
        return this.getRandomResponse(responses);
    }

    getRelationshipResponse(message) {
        const responses = [
            "Relationships can be so complicated 😮‍💨 What's going on?",
            "Ah relationship stuff 😔 That's tough. Want to talk about it?",
            "People are complicated fr 😥 What's been on your mind about this?"
        ];
        return this.getRandomResponse(responses);
    }

    getAnxietyResponse(message) {
        const responses = [
            "Anxiety is such a liar sometimes 😣 What's helping you cope right now?",
            "The anxiety spiral is real 😮‍💨 You're safe in this moment, even if it doesn't feel like it",
            "Anxiety hitting hard today? 😔 Let's breathe together for a sec"
        ];
        return this.getRandomResponse(responses);
    }

    getDepressionResponse(message) {
        const responses = [
            "Depression lies, remember that 😔 What's one tiny thing that felt okay recently?",
            "The depression fog is so heavy sometimes 😮‍💨 Be extra gentle with yourself today",
            "When everything feels numb and empty 😪 That's really hard. I'm here with you"
        ];
        return this.getRandomResponse(responses);
    }

    getLonelinessResponse(message) {
        const responses = [
            "Loneliness hits different 😔 I'm glad you reached out though",
            "Feeling alone is so hard 😥 What does connection feel like for you?",
            "The lonely feels are real 😮‍💨 You're not alone in feeling alone"
        ];
        return this.getRandomResponse(responses);
    }

    getStressResponse(message) {
        const responses = [
            "Stress piling up? 😫 What's one thing you could take off your plate?",
            "When everything feels like too much 🥲 Break it down into smaller pieces",
            "Stress is testing us fr 😮‍💨 What's been helping you cope lately?"
        ];
        return this.getRandomResponse(responses);
    }

    getPositiveResponse() {
        const responses = [
            "Ayy love to hear that! 👏 What's making you feel good?",
            "Yesss that's amazing! 🎉 So happy for you!",
            "That's awesome! 😊 Tell me more about what's going well!"
        ];
        return this.getRandomResponse(responses);
    }

    getHelpResponse() {
        const responses = [
            "I got you! 👊 Let's figure this out together",
            "No worries, we'll work through this 💪 What feels most confusing?",
            "I'm here to help you think it through 🧠 Sometimes talking helps"
        ];
        return this.getRandomResponse(responses);
    }

    getContextualResponse(message) {
        const responses = [
            "Hmm I see what you mean 🤔 Tell me more about that?",
            "That makes sense 🫶 What else is coming up for you?",
            "I hear you 💙 That sounds really significant",
            "Wow that's a lot 😮 How long has this been on your mind?",
            "That's really interesting actually 🧐 What's your gut telling you?",
            "I feel that 😔 What support would feel helpful right now?"
        ];
        return this.getRandomResponse(responses);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        
        messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Buddy'}:</strong> ${message}`;
        
        this.chatMessages.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
        
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.typingIndicator.textContent = 'Buddy is typing' + '.'.repeat(Math.floor(Math.random() * 3) + 1);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9 + Math.random() * 0.3;
            utterance.pitch = 1.0 + Math.random() * 0.2;
            utterance.volume = 0.8;
            
            speechSynthesis.speak(utterance);
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new MentalHealthBuddy();
});