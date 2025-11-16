// Voice emotion analysis using Web Audio API
class VoiceAnalyser {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.recorder = null;
        this.isRecording = false;
        this.audioChunks = [];
        this.visualizerCanvas = document.getElementById('voiceVisualizer');
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
        
        this.setupVisualizer();
    }
    
    setupVisualizer() {
        // Set up the visualizer dimensions
        this.visualizerCanvas.width = this.visualizerCanvas.offsetWidth;
        this.visualizerCanvas.height = this.visualizerCanvas.offsetHeight;
    }
    
    async startRecording() {
        try {
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Set up audio context and analyser
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            
            // Connect microphone to analyser
            this.microphone.connect(this.analyser);
            
            // Set up analyser properties
            this.analyser.fftSize = 2048;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            // Set up MediaRecorder for saving audio
            this.recorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.recorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            // Start recording
            this.recorder.start();
            this.isRecording = true;
            
            // Start visualization
            this.visualize();
            
            console.log("Voice recording started");
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access your microphone. Please check permissions.");
        }
    }
    
    async stopRecording() {
        if (!this.isRecording) return null;
        
        return new Promise((resolve) => {
            // Set up recorder stop event
            this.recorder.onstop = () => {
                // Create audio blob
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                
                // Analyze the recorded audio
                const emotionData = this.analyzeAudio(audioBlob);
                
                // Stop audio context
                if (this.audioContext) {
                    this.audioContext.close();
                    this.audioContext = null;
                }
                
                // Stop all tracks
                if (this.microphone) {
                    this.microphone.mediaStream.getTracks().forEach(track => track.stop());
                }
                
                this.isRecording = false;
                this.visualizerCtx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
                
                console.log("Voice recording stopped");
                resolve(emotionData);
            };
            
            // Stop recording
            this.recorder.stop();
        });
    }
    
    visualize() {
        if (!this.isRecording || !this.analyser) return;
        
        const width = this.visualizerCanvas.width;
        const height = this.visualizerCanvas.height;
        
        // Clear canvas
        this.visualizerCtx.fillStyle = 'rgb(240, 240, 240)';
        this.visualizerCtx.fillRect(0, 0, width, height);
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Draw waveform
        this.visualizerCtx.lineWidth = 2;
        this.visualizerCtx.strokeStyle = 'rgb(74, 110, 224)';
        this.visualizerCtx.beginPath();
        
        const sliceWidth = width / this.dataArray.length;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = v * height / 2;
            
            if (i === 0) {
                this.visualizerCtx.moveTo(x, y);
            } else {
                this.visualizerCtx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        this.visualizerCtx.lineTo(width, height / 2);
        this.visualizerCtx.stroke();
        
        // Continue visualization
        requestAnimationFrame(() => this.visualize());
    }
    
    analyzeAudio(audioBlob) {
        // In a real application, you would:
        // 1. Extract audio features (pitch, intensity, spectral features, etc.)
        // 2. Send these features to your custom trained model
        // 3. Classify the emotion based on voice characteristics
        
        // For this demo, we'll simulate the process
        return this.simulateVoiceEmotionDetection();
    }
    
    simulateVoiceEmotionDetection() {
        // This is a simulation - in a real app, you would use your trained model
        const emotions = ['happy', 'sad', 'angry', 'anxious', 'tired', 'neutral'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        const confidence = 0.7 + Math.random() * 0.25; // 0.7-0.95
        
        console.log(`Simulated voice emotion detection: ${randomEmotion} with ${(confidence * 100).toFixed(2)}% confidence`);
        
        return {
            emotion: randomEmotion,
            confidence: confidence,
            timestamp: new Date().toISOString(),
            duration: (3 + Math.random() * 5).toFixed(2) + " seconds"
        };
    }
    
    playSampleAudio() {
        // Play a sample audio file for testing
        const audio = new Audio();
        // In a real app, you would use samples from your dataset
        // audio.src = 'MentalHealthBuddy/your_ravdess_dataset/sample_audio.wav';
        
        // For this demo, we'll use a placeholder
        alert("In a real implementation, this would play a sample from your RAVDESS dataset");
    }
    
    // Method to train model with your custom dataset
    async trainWithCustomDataset() {
        // This would be the method to train your model with your voice dataset
        console.log("Training model with custom voice dataset...");
        
        // In a real implementation, you would:
        // 1. Load your audio dataset from MentalHealthBuddy/your_ravdess_dataset
        // 2. Extract audio features (MFCCs, pitch, etc.)
        // 3. Train your model on these features
        // 4. Save the model for future use
        
        // This is a placeholder for the training process
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Voice model training completed");
                resolve({ success: true, accuracy: 0.82 });
            }, 3000);
        });
    }
}

// Initialize the voice analyser
const voiceAnalyser = new VoiceAnalyser();