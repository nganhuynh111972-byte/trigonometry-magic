// ========== TRAP SYSTEM ==========
// Hệ thống 6 loại bẫy với các cơ chế khác nhau

// ========== TRAP TYPES ==========
const TRAP_TYPES = {
    TREE: 'tree',           // 🌳 Cây Ma - Cản đường cơ bản
    PIT: 'pit',             // 🕳️ Hố Bẫy - Mất mạng ngay
    FIRE: 'fire',           // 🔥 Bẫy Lửa - Liên tục mất mạng
    ICE: 'ice',             // ❄️ Bẫy Băng - Làm chậm
    LIGHTNING: 'lightning', // ⚡ Bẫy Sét - Teleport random
    VORTEX: 'vortex'        // 🌀 Bẫy Xoáy - Kéo player
};

// ========== TRAP CONFIGURATIONS ==========
const TRAP_CONFIG = {
    [TRAP_TYPES.TREE]: {
        name: 'Cây Ma',
        emoji: '🌳',
        color: '#2d5016',
        damage: 1,
        requiresQuestion: true,
        questionChance: 0.6, // 60% trả lời câu hỏi
        description: 'Cây ma cản đường - có cơ hội trả lời câu hỏi',
        effect: 'Cản đường'
    },
    [TRAP_TYPES.PIT]: {
        name: 'Hố Bẫy',
        emoji: '🕳️',
        color: '#1a1a1a',
        damage: 2,
        requiresQuestion: true,
        questionChance: 0.8, // 80% phải trả lời câu hỏi
        description: 'Hố sâu - luôn phải trả lời để thoát',
        effect: 'Mất 2 mạng nếu sai'
    },
    [TRAP_TYPES.FIRE]: {
        name: 'Bẫy Lửa',
        emoji: '🔥',
        color: '#ff6b35',
        damage: 1,
        damagePerSecond: 0.5,
        duration: 3, // giây
        requiresQuestion: true,
        questionChance: 1.0, // 100% phải trả lời câu hỏi
        description: 'Bẫy lửa - tạo damage liên tục',
        effect: 'Lửa thiêu'
    },
    [TRAP_TYPES.ICE]: {
        name: 'Bẫy Băng',
        emoji: '❄️',
        color: '#64b5f6',
        slowFactor: 0.4, // Giảm tốc độ còn 40%
        duration: 4, // giây
        requiresQuestion: false,
        description: 'Bẫy băng - làm chậm tốc độ',
        effect: 'Chậm lại'
    },
    [TRAP_TYPES.LIGHTNING]: {
        name: 'Bẫy Sét',
        emoji: '⚡',
        color: '#ffeb3b',
        requiresQuestion: true,
        questionChance: 0.9, // 90% phải trả lời
        teleportRange: 200, // pixel
        description: 'Bẫy sét - teleport ngẫu nhiên',
        effect: 'Điện sét'
    },
    [TRAP_TYPES.VORTEX]: {
        name: 'Bẫy Xoáy',
        emoji: '🌀',
        color: '#9c27b0',
        damage: 1,
        pullStrength: 3, // Sức kéo
        duration: 2, // giây
        requiresQuestion: true,
        questionChance: 0.7, // 70% trả lời câu hỏi
        description: 'Bẫy xoáy - kéo player về phía trước',
        effect: 'Xoáy cuốn'
    }
};

// ========== TRAP CLASS ==========
class Trap {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = OBSTACLE_SIZE;
        this.height = OBSTACLE_SIZE;
        this.type = type;
        this.config = TRAP_CONFIG[type];
        
        this.hit = false;
        this.triggered = false;
        this.triggerTime = 0;
        
        // Trạng thái đặc biệt
        this.isActive = false;
        this.activeStartTime = 0;
        this.activeDuration = this.config.duration || 0;
        
        // Ice effect
        this.slowFactor = 1;
        
        // Fire effect
        this.burnDamageCounter = 0;
        
        // Lightning effect
        this.teleported = false;
    }
    
    /**
     * Kích hoạt hiệu ứng bẫy
     */
    activate() {
        this.isActive = true;
        this.activeStartTime = Date.now();
        this.triggered = true;
    }
    
    /**
     * Cập nhật trạng thái bẫy
     */
    update() {
        if (!this.isActive) return;
        
        const elapsed = (Date.now() - this.activeStartTime) / 1000;
        const config = this.config;
        
        // Kết thúc hiệu ứng nếu hết thời gian
        if (config.duration && elapsed > config.duration) {
            this.isActive = false;
            this.slowFactor = 1;
        }
        
        // Cập nhật từng loại bẫy
        switch (this.type) {
            case TRAP_TYPES.FIRE:
                this.updateFireTrap(elapsed);
                break;
            case TRAP_TYPES.ICE:
                this.updateIceTrap(elapsed);
                break;
            case TRAP_TYPES.LIGHTNING:
                this.updateLightningTrap();
                break;
            case TRAP_TYPES.VORTEX:
                this.updateVortexTrap(elapsed);
                break;
        }
    }
    
    /**
     * Cập nhật Bẫy Lửa - Liên tục mất mạng
     */
    updateFireTrap(elapsed) {
        const config = this.config;
        const damagePerSecond = config.damagePerSecond || 0.5;
        
        this.burnDamageCounter += damagePerSecond / 60; // 60 FPS
        
        if (this.burnDamageCounter >= 1) {
            loseHealth();
            this.burnDamageCounter -= 1;
        }
    }
    
    /**
     * Cập nhật Bẫy Băng - Làm chậm tốc độ
     */
    updateIceTrap(elapsed) {
        const config = this.config;
        this.slowFactor = config.slowFactor || 0.4;
    }
    
    /**
     * Cập nhật Bẫy Sét - Teleport random
     */
    updateLightningTrap() {
        // Teleport được xử lý trong handleTrapEffect
    }
    
    /**
     * Cập nhật Bẫy Xoáy - Kéo player
     */
    updateVortexTrap(elapsed) {
        if (!this.isActive) return;
        
        const config = this.config;
        const pullStrength = config.pullStrength || 3;
        
        // Kéo player về phía trước (phía bên phải)
        player.x += pullStrength;
    }
    
    /**
     * Lấy xác suất cần trả lời câu hỏi
     */
    shouldAskQuestion() {
        const config = this.config;
        if (!config.requiresQuestion) return false;
        return Math.random() < config.questionChance;
    }
    
    /**
     * Vẽ bẫy lên canvas
     */
    draw(ctx) {
        // Vẽ nền
        ctx.fillStyle = this.config.color;
        ctx.globalAlpha = this.isActive ? 0.8 : 0.6;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
        
        // Vẽ emoji
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.config.emoji, this.x + this.width / 2, this.y + this.height / 2 + 15);
        
        // Hiệu ứng khi kích hoạt
        if (this.isActive) {
            ctx.strokeStyle = this.config.color;
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            
            // Vẽ animation hiệu ứng
            this.drawTrapEffect(ctx);
        }
    }
    
    /**
     * Vẽ hiệu ứng đặc biệt của bẫy
     */
    drawTrapEffect(ctx) {
        const elapsed = (Date.now() - this.activeStartTime) / 1000;
        
        switch (this.type) {
            case TRAP_TYPES.FIRE:
                this.drawFireEffect(ctx, elapsed);
                break;
            case TRAP_TYPES.ICE:
                this.drawIceEffect(ctx, elapsed);
                break;
            case TRAP_TYPES.LIGHTNING:
                this.drawLightningEffect(ctx, elapsed);
                break;
            case TRAP_TYPES.VORTEX:
                this.drawVortexEffect(ctx, elapsed);
                break;
        }
    }
    
    /**
     * Vẽ hiệu ứng Lửa
     */
    drawFireEffect(ctx, elapsed) {
        ctx.fillStyle = 'rgba(255, 107, 53, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                this.width / 2 + Math.sin(elapsed * 10) * 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * Vẽ hiệu ứng Băng
     */
    drawIceEffect(ctx, elapsed) {
        ctx.strokeStyle = 'rgba(100, 181, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 10);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 10, this.y + 10);
        ctx.lineTo(this.x + 10, this.y + this.height - 10);
        ctx.stroke();
    }
    
    /**
     * Vẽ hiệu ứng Sét
     */
    drawLightningEffect(ctx, elapsed) {
        const amplitude = Math.sin(elapsed * 15) * 3;
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.6)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
            ctx.lineTo(
                this.x + this.width / 2 + amplitude + Math.random() * 10,
                this.y + this.height / 2 + amplitude + Math.random() * 10
            );
            ctx.stroke();
        }
    }
    
    /**
     * Vẽ hiệu ứng Xoáy
     */
    drawVortexEffect(ctx, elapsed) {
        ctx.strokeStyle = 'rgba(156, 39, 176, 0.5)';
        ctx.lineWidth = 2;
        
        const rotation = elapsed * 4;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(rotation);
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, (i + 1) * 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// ========== TRAP FACTORY ==========
/**
 * Tạo một bẫy ngẫu nhiên
 */
function createRandomTrap(x, y) {
    const trapTypes = Object.values(TRAP_TYPES);
    const weights = [40, 25, 15, 10, 5, 5]; // Tỉ lệ xuất hiện
    
    // Chọn loại bẫy dựa trên trọng số
    let rand = Math.random() * 100;
    let selectedType = trapTypes[0];
    let cumulative = 0;
    
    for (let i = 0; i < trapTypes.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
            selectedType = trapTypes[i];
            break;
        }
    }
    
    return new Trap(x, y, selectedType);
}

/**
 * Tạo bẫy theo loại cụ thể
 */
function createTrap(x, y, type) {
    return new Trap(x, y, type);
}

// ========== TRAP EFFECTS HANDLER ==========
/**
 * Xử lý hiệu ứng khi gặp bẫy
 */
function handleTrapEffect(trap) {
    console.log(`💥 Kích hoạt bẫy: ${trap.config.name}`);
    
    trap.activate();
    
    // Kiểm tra xem có cần trả lời câu hỏi
    if (trap.shouldAskQuestion()) {
        console.log(`📝 Phải trả lời câu hỏi để thoát khỏi ${trap.config.name}`);
        showTrapQuestion(trap);
    } else {
        // Áp dụng hiệu ứng ngay
        applyTrapEffect(trap);
    }
}

/**
 * Áp dụng hiệu ứng bẫy
 */
function applyTrapEffect(trap) {
    const config = trap.config;
    
    switch (trap.type) {
        case TRAP_TYPES.TREE:
            // Cây ma chỉ cản đường
            break;
            
        case TRAP_TYPES.PIT:
            // Hố bẫy mất 2 mạng
            if (!trap.triggeredDamage) {
                loseHealth(config.damage || 1);
                trap.triggeredDamage = true;
            }
            break;
            
        case TRAP_TYPES.FIRE:
            // Bẫy lửa liên tục mất mạng (được xử lý trong update)
            break;
            
        case TRAP_TYPES.ICE:
            // Bẫy băng làm chậm tốc độ
            PLAYER_SPEED = PLAYER_SPEED * config.slowFactor;
            break;
            
        case TRAP_TYPES.LIGHTNING:
            // Bẫy sét teleport ngẫu nhiên
            teleportPlayer(trap);
            break;
            
        case TRAP_TYPES.VORTEX:
            // Bẫy xoáy kéo player (được xử lý trong update)
            break;
    }
}

/**
 * Teleport player ngẫu nhiên (Bẫy Sét)
 */
function teleportPlayer(trap) {
    if (trap.teleported) return;
    
    const config = trap.config;
    const range = config.teleportRange || 200;
    
    const newX = trap.x + (Math.random() - 0.5) * range * 2;
    const newY = trap.y + (Math.random() - 0.5) * range * 2;
    
    player.x = Math.max(0, Math.min(newX, CANVAS_WIDTH - player.width));
    player.y = Math.max(0, Math.min(newY, CANVAS_HEIGHT - player.height));
    
    trap.teleported = true;
    console.log(`⚡ Player teleport đến (${player.x}, ${player.y})`);
}

/**
 * Hiệu ứng khi trả lời câu hỏi bẫy
 */
function handleTrapQuestion(trap, correct) {
    if (correct) {
        console.log(`✅ Trả lời đúng! Thoát khỏi ${trap.config.name}`);
        trap.isActive = false;
        gameState.score += 15;
    } else {
        console.log(`❌ Trả lời sai! Áp dụng hiệu ứng đầy đủ`);
        applyTrapEffect(trap);
        loseHealth();
    }
}

// ========== RESET TRAP EFFECTS ==========
/**
 * Reset tất cả hiệu ứng bẫy (khi chuyển stage)
 */
function resetTrapEffects() {
    PLAYER_SPEED = 5; // Reset tốc độ
    console.log('🔄 Reset tất cả hiệu ứng bẫy');
}

// ========== EXPORT FOR TESTING ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TRAP_TYPES,
        TRAP_CONFIG,
        Trap,
        createRandomTrap,
        createTrap,
        handleTrapEffect,
        applyTrapEffect,
        handleTrapQuestion
    };
}
