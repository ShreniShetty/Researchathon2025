// Mental Health Professional Finder - Zomato Style
class ProfessionalFinder {
    constructor() {
        this.professionals = this.getSampleProfessionals();
        this.filters = {
            specialization: 'all',
            rating: 0,
            price: 'all',
            distance: 10
        };
    }

    getSampleProfessionals() {
        return [
            {
                id: 1,
                name: "Dr. Sarah Chen",
                specialization: "Anxiety & Depression",
                rating: 4.8,
                reviews: 127,
                price: "$120",
                distance: 1.2,
                image: "👩‍⚕️",
                experience: "8 years",
                languages: ["English", "Mandarin"],
                availability: "Mon-Fri",
                bio: "Specialized in CBT and mindfulness techniques for anxiety disorders.",
                isOnline: true
            },
            {
                id: 2,
                name: "Dr. Marcus Johnson",
                specialization: "Relationship Counseling",
                rating: 4.9,
                reviews: 89,
                price: "$150",
                distance: 2.5,
                image: "👨‍⚕️",
                experience: "12 years",
                languages: ["English", "Spanish"],
                availability: "Tue-Sat",
                bio: "Focuses on couples therapy and family dynamics.",
                isOnline: false
            },
            {
                id: 3,
                name: "Dr. Priya Patel",
                specialization: "Trauma Therapy",
                rating: 4.7,
                reviews: 203,
                price: "$135",
                distance: 0.8,
                image: "👩‍⚕️",
                experience: "10 years",
                languages: ["English", "Hindi", "Gujarati"],
                availability: "Mon-Sun",
                bio: "EMDR certified specialist with focus on PTSD recovery.",
                isOnline: true
            },
            {
                id: 4,
                name: "Michael Rodriguez, LCSW",
                specialization: "LGBTQ+ Counseling",
                rating: 4.6,
                reviews: 67,
                price: "$95",
                distance: 3.1,
                image: "👨‍💼",
                experience: "6 years",
                languages: ["English", "Spanish"],
                availability: "Wed-Sun",
                bio: "Affirming therapy for LGBTQ+ individuals and families.",
                isOnline: true
            },
            {
                id: 5,
                name: "Dr. Emily Watson",
                specialization: "Child & Adolescent",
                rating: 4.9,
                reviews: 156,
                price: "$140",
                distance: 1.8,
                image: "👩‍🏫",
                experience: "9 years",
                languages: ["English"],
                availability: "Mon-Fri",
                bio: "Play therapy and adolescent counseling specialist.",
                isOnline: false
            },
            {
                id: 6,
                name: "James Kim, LMFT",
                specialization: "Addiction Recovery",
                rating: 4.5,
                reviews: 94,
                price: "$110",
                distance: 4.2,
                image: "👨‍💼",
                experience: "7 years",
                languages: ["English", "Korean"],
                availability: "Mon-Sat",
                bio: "Substance abuse and behavioral addiction specialist.",
                isOnline: true
            }
        ];
    }

    filterProfessionals(filters = this.filters) {
        let filtered = [...this.professionals];

        // Filter by specialization
        if (filters.specialization !== 'all') {
            filtered = filtered.filter(prof => 
                prof.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
            );
        }

        // Filter by rating
        filtered = filtered.filter(prof => prof.rating >= filters.rating);

        // Filter by price
        if (filters.price !== 'all') {
            const priceRanges = {
                'low': 100,
                'medium': 130,
                'high': 999
            };
            filtered = filtered.filter(prof => {
                const price = parseInt(prof.price.replace('$', ''));
                return price <= priceRanges[filters.price];
            });
        }

        // Filter by distance
        filtered = filtered.filter(prof => prof.distance <= filters.distance);

        // Sort by rating (highest first), then distance
        return filtered.sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            return a.distance - b.distance;
        });
    }

    getSpecializations() {
        const specializations = new Set();
        this.professionals.forEach(prof => {
            specializations.add(prof.specialization);
        });
        return ['all', ...Array.from(specializations)];
    }

    recommendProfessionals(userEmotion, userLocation = null) {
        const emotionSpecializationMap = {
            'anxious': 'Anxiety',
            'sad': 'Depression',
            'angry': 'Relationship',
            'tired': 'Burnout',
            'neutral': 'all'
        };

        const recommendedSpecialization = emotionSpecializationMap[userEmotion] || 'all';
        
        const filters = {
            ...this.filters,
            specialization: recommendedSpecialization,
            rating: 4.5 // High quality for recommendations
        };

        return this.filterProfessionals(filters).slice(0, 3);
    }
}

// Professional Finder UI Manager
class ProfessionalFinderUI {
    constructor() {
        this.finder = new ProfessionalFinder();
        this.currentProfessionals = [];
    }

    initialize() {
        this.renderFilters();
        this.renderProfessionals();
        this.setupEventListeners();
    }

    renderFilters() {
        const filtersContainer = document.getElementById('professionalFilters');
        if (!filtersContainer) return;

        const specializations = this.finder.getSpecializations();

        filtersContainer.innerHTML = `
            <div class="filter-group">
                <label>Specialization:</label>
                <select id="specializationFilter">
                    ${specializations.map(spec => 
                        `<option value="${spec}">${spec === 'all' ? 'All Specializations' : spec}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>Min Rating:</label>
                <select id="ratingFilter">
                    <option value="0">Any Rating</option>
                    <option value="4.0">4.0+</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.8">4.8+</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Price:</label>
                <select id="priceFilter">
                    <option value="all">Any Price</option>
                    <option value="low">Under $100</option>
                    <option value="medium">$100-$130</option>
                    <option value="high">$130+</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Distance:</label>
                <select id="distanceFilter">
                    <option value="5">Within 5 km</option>
                    <option value="10" selected>Within 10 km</option>
                    <option value="20">Within 20 km</option>
                </select>
            </div>
            <button id="applyFilters" class="filter-btn">Apply Filters</button>
        `;
    }

    renderProfessionals(professionals = null) {
        const container = document.getElementById('professionalsList');
        if (!container) return;

        this.currentProfessionals = professionals || this.finder.filterProfessionals();

        if (this.currentProfessionals.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No professionals found matching your criteria 😔</p>
                    <p>Try adjusting your filters!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.currentProfessionals.map(prof => `
            <div class="professional-card" data-id="${prof.id}">
                <div class="card-header">
                    <div class="prof-image">${prof.image}</div>
                    <div class="prof-info">
                        <h3>${prof.name}</h3>
                        <p class="specialization">${prof.specialization}</p>
                        <div class="rating">
                            <span class="stars">${'⭐'.repeat(Math.floor(prof.rating))}</span>
                            <span class="rating-text">${prof.rating} (${prof.reviews} reviews)</span>
                        </div>
                    </div>
                    <div class="status ${prof.isOnline ? 'online' : 'offline'}">
                        ${prof.isOnline ? '🟢 Online' : '🔴 Offline'}
                    </div>
                </div>
                <div class="card-details">
                    <div class="detail-item">
                        <span>💰 ${prof.price}/session</span>
                        <span>📏 ${prof.distance} km away</span>
                        <span>⏰ ${prof.experience} exp</span>
                    </div>
                    <p class="bio">${prof.bio}</p>
                    <div class="languages">
                        ${prof.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="book-btn" onclick="professionalFinderUI.bookAppointment(${prof.id})">
                        Book Session
                    </button>
                    <button class="info-btn" onclick="professionalFinderUI.viewProfile(${prof.id})">
                        View Profile
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Filter application
        const applyBtn = document.getElementById('applyFilters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        // Quick filters for emotions
        const emotionRecommendBtn = document.getElementById('getEmotionRecommendations');
        if (emotionRecommendBtn) {
            emotionRecommendBtn.addEventListener('click', () => this.getEmotionBasedRecommendations());
        }
    }

    applyFilters() {
        const filters = {
            specialization: document.getElementById('specializationFilter').value,
            rating: parseFloat(document.getElementById('ratingFilter').value),
            price: document.getElementById('priceFilter').value,
            distance: parseInt(document.getElementById('distanceFilter').value)
        };

        this.finder.filters = filters;
        this.renderProfessionals();
    }

    getEmotionBasedRecommendations() {
        // Get current emotion from chat analysis or use a default
        const currentEmotion = window.app?.textData?.emotion || 'neutral';
        const recommendations = this.finder.recommendProfessionals(currentEmotion);
        
        this.renderProfessionals(recommendations);
        
        // Show recommendation reason
        const container = document.getElementById('professionalsList');
        if (container) {
            container.insertAdjacentHTML('afterbegin', `
                <div class="recommendation-banner">
                    <p>💡 Recommended for you based on your current emotion (${currentEmotion})</p>
                </div>
            `);
        }
    }

    bookAppointment(professionalId) {
        const professional = this.currentProfessionals.find(p => p.id === professionalId);
        if (professional) {
            alert(`Booking session with ${professional.name}\n\nPrice: ${professional.price}\nSpecialization: ${professional.specialization}\n\nNote: This is a demo. In a real app, this would redirect to booking system.`);
        }
    }

    viewProfile(professionalId) {
        const professional = this.currentProfessionals.find(p => p.id === professionalId);
        if (professional) {
            const modal = this.createProfileModal(professional);
            document.body.appendChild(modal);
        }
    }

    createProfileModal(professional) {
        const modal = document.createElement('div');
        modal.className = 'professional-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <div class="modal-header">
                    <div class="prof-image-large">${professional.image}</div>
                    <div class="modal-title">
                        <h2>${professional.name}</h2>
                        <p class="specialization">${professional.specialization}</p>
                        <div class="rating">
                            ${'⭐'.repeat(Math.floor(professional.rating))} ${professional.rating} (${professional.reviews} reviews)
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="details-grid">
                        <div class="detail-item">
                            <strong>Experience:</strong> ${professional.experience}
                        </div>
                        <div class="detail-item">
                            <strong>Price:</strong> ${professional.price}/session
                        </div>
                        <div class="detail-item">
                            <strong>Availability:</strong> ${professional.availability}
                        </div>
                        <div class="detail-item">
                            <strong>Languages:</strong> ${professional.languages.join(', ')}
                        </div>
                    </div>
                    <div class="bio-section">
                        <h3>About</h3>
                        <p>${professional.bio}</p>
                    </div>
                    <div class="action-section">
                        <button class="book-btn large" onclick="professionalFinderUI.bookAppointment(${professional.id})">
                            Book Session - ${professional.price}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Close modal functionality
        modal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        return modal;
    }
}

// Initialize the professional finder
const professionalFinderUI = new ProfessionalFinderUI();