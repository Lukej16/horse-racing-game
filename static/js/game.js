class HorseRacing {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById('startButton');
        this.resetButton = document.getElementById('resetButton');
        this.positionsDiv = document.getElementById('positions');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game state
        this.isRacing = false;
        this.horses = [];
        this.finishedHorses = [];
        
        // Horse names
        this.horseNames = [
            "Thunder", "Lightning", "Storm", "Arrow",
            "Dash", "Flash", "Blitz", "Bolt"
        ];
        
        // Initialize horses
        this.initializeHorses();
        
        // Event listeners
        this.startButton.addEventListener('click', () => this.startRace());
        this.resetButton.addEventListener('click', () => this.resetRace());
        
        // Start animation loop
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.trackWidth = this.canvas.width * 0.8;
        this.trackHeight = this.canvas.height * 0.8;
        this.trackX = (this.canvas.width - this.trackWidth) / 2;
        this.trackY = (this.canvas.height - this.trackHeight) / 2;
    }
    
    initializeHorses() {
        this.horses = [];
        this.finishedHorses = [];
        
        for (let i = 0; i < 8; i++) {
            this.horses.push({
                name: this.horseNames[i],
                x: this.trackX,
                y: this.trackY + (i + 1) * (this.trackHeight / 9),
                speed: 0,
                position: null
            });
        }
    }
    
    startRace() {
        this.isRacing = true;
        this.startButton.disabled = true;
        this.resetButton.disabled = true;
        
        // Assign random speeds to horses
        this.horses.forEach(horse => {
            horse.speed = 2 + Math.random() * 2;
        });
    }
    
    resetRace() {
        this.isRacing = false;
        this.initializeHorses();
        this.startButton.disabled = false;
        this.resetButton.disabled = true;
        this.updatePositions();
    }
    
    updateHorses() {
        if (!this.isRacing) return;
        
        this.horses.forEach(horse => {
            if (horse.position !== null) return;
            
            horse.x += horse.speed;
            
            // Check if horse finished
            if (horse.x >= this.trackX + this.trackWidth) {
                horse.x = this.trackX + this.trackWidth;
                horse.position = this.finishedHorses.length + 1;
                this.finishedHorses.push(horse);
                
                // Check if race is complete
                if (this.finishedHorses.length === this.horses.length) {
                    this.isRacing = false;
                    this.resetButton.disabled = false;
                }
            }
        });
        
        this.updatePositions();
    }
    
    updatePositions() {
        this.positionsDiv.innerHTML = '';
        const sortedHorses = [...this.horses].sort((a, b) => {
            if (a.position === null && b.position === null) return b.x - a.x;
            if (a.position === null) return 1;
            if (b.position === null) return -1;
            return a.position - b.position;
        });
        
        sortedHorses.forEach((horse, index) => {
            const position = horse.position || (index + 1);
            const div = document.createElement('div');
            div.className = 'position-item';
            div.textContent = `${position}. ${horse.name}`;
            this.positionsDiv.appendChild(div);
        });
    }
    
    drawTrack() {
        // Draw track background
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(this.trackX, this.trackY, this.trackWidth, this.trackHeight);
        
        // Draw lanes
        for (let i = 1; i < 8; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#95a5a6';
            this.ctx.setLineDash([5, 5]);
            this.ctx.moveTo(this.trackX, this.trackY + i * (this.trackHeight / 8));
            this.ctx.lineTo(this.trackX + this.trackWidth, this.trackY + i * (this.trackHeight / 8));
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
    
    drawHorses() {
        this.horses.forEach(horse => {
            // Draw horse (simplified representation)
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.beginPath();
            this.ctx.arc(horse.x, horse.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game elements
        this.drawTrack();
        this.drawHorses();
        
        // Update game state
        this.updateHorses();
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new HorseRacing();
});
