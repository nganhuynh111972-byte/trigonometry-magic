// ========== BOSS SYSTEM ==========
// Hệ thống 3 Boss chính với các cơ chế chiến đấu

// ========== BOSS TYPES ==========
const BOSS_TYPES = {
    CERBERUS: 'cerberus',   // 🐕 Boss giai đoạn 1
    GRYPHON: 'gryphon',     // 🦅 Boss giai đoạn 2
    DRAGON: 'dragon'        // 🐉 Boss giai đoạn 3
};

// ========== BOSS CONFIGURATIONS ==========
const BOSS_CONFIG = {
    [BOSS_TYPES.CERBERUS]: {
        name: 'Cerberus',
        emoji: '🐕',
        stage: 1,
        description: 'Chó 3 đầu gác cổng địa ngục',
        maxHealth: 30,
        health: 30,
        
        // Cơ chế chiến đấu
        questionsRequired: 3,      // Cần trả lời 3 câu hỏi để đánh bại
        damagePerCorrectAnswer: 10, // Mỗi câu đúng gây 10 damage
        damageToPlayer: 1,          // Mỗi câu sai player mất 1 mạng
        
        // Hành động
        attackDuration: 3,          // Thời gian tấn công (giây)
        attackPattern: 'bark',      // Mô tả tấn công
        
        // Thưởng
        scoreReward: 100,           // Điểm khi đánh bại
        healthReward: 1,            // Mạng sống thưởng
        
        // Vị trí
        x: CANVAS_WIDTH - 200,
        y: CANVAS_HEIGHT / 2 - 60,
        width: 120,
        height: 120,
        
        color: '#8B4513'
    },
    
    [BOSS_TYPES.GRYPHON]: {
        name: 'Gryphon',
        emoji: '🦅',
        stage: 2,
        description: 'Chim ưng đầu sư tử, kẻ bảo vệ của các vàng',
        maxHealth: 40,
        health: 40,
        
        // Cơ chế chiến đấu
        questionsRequired: 4,
        damagePerCorrectAnswer: 10,
        damageToPlayer: 1,
        
        // Hành động
        attackDuration: 3.5,
        attackPattern: 'fly_attack',
        
        // Thưởng
        scoreReward: 200,
        healthReward: 2,
        
        // Vị trí
        x: CANVAS_WIDTH - 200,
        y: CANVAS_HEIGHT / 2 - 70,
        width: 140,
        height: 140,
        
        color: '#DAA520'
    },
    
    [BOSS_TYPES.DRAGON]: {
        name: 'Dragon',
        emoji: '🐉',
        stage: 3,
        description: 'Rồng cổ đại, vua của tất cả quái vật',
        maxHealth: 50,
        health: 50,
        
        // Cơ chế chiến đấu
        questionsRequired: 6,
        damagePerCorrectAnswer: 8,
        damageToPlayer: 2,
        
        // Hành động
        attackDuration: 4,
        attackPattern: 'fire_breath',
        
        // Thưởng
        scoreReward: 300,
        healthReward: 3,
        
        // Vị trí
        x: CANVAS_WIDTH - 250,
        y: CANVAS_HEIGHT / 2 - 80,
        width: 160,
        height: 160,
        
        color: '#8B0000'
    }
};

// ========== BOSS CLASS ==========
class Boss {
    constructor(type) {
        this.type = type;
        this.config = BOSS_CONFIG[type];
        
        // Sao chép tất cả config properties
        Object.assign(this, this.config);
        
        // Trạng thái chiến đấu
        this.isActive = false;
        this.isDefeated = false;
        this.correctAnswersCount = 0;
        
        // Trạng thái tấn công
        this.isAttacking = false;
        this.attackStartTime = 0;
        this.attackAnimationFrame = 0;
        
        // Animation
        this.bobbing = 0;           // Hiệu ứng nhảy lên xuống
        this.bobbingSpeed = 0.05;
        this.bobbingAmount = 10;
        
        // Hiệu ứng damage
        this.damageFlashTime = 0;
        this.isDamageFlashing = false;
    }
    
    /**
     * Kích hoạt boss
     */
    activate() {
        this.isActive = true;
        this.correctAnswersCount = 0;
        this.health = this.maxHealth;
        console.log(`⚔️ Boss ${this.name} xuất hiện!`);
    }
    
    /**
     * Cập nhật trạng thái boss
     */
    update() {
        if (!this.isActive || this.isDefeated) return;
        
        // Cập nhật animation nhảy lên xuống
        this.bobbing += this.bobbingSpeed;
        
        // Cập nhật hiệu ứng damage flash
        if (this.isDamageFlashing) {
            this.damageFlashTime--;
            if (this.damageFlashTime <= 0) {
                this.isDamageFlashing = false;
            }
        }
        
        // Cập nhật tấn công
        if (this.isAttacking) {
            const elapsedTime = (Date.now() - this.attackStartTime) / 1000;
            if (elapsedTime > this.attackDuration) {
                this.isAttacking = false;
            } else {
                // Animation tấn công
                this.attackAnimationFrame = Math.floor(elapsedTime * 10) % 3;
            }
        }
    }
    
    /**
     * Boss tấn công
     */
    attack() {
        this.isAttacking = true;
        this.attackStartTime = Date.now();
        this.attackAnimationFrame = 0;
        console.log(`💥 ${this.name} tấn công!`);
    }
    
    /**
     * Nhận damage
     */
    takeDamage(amount) {
        this.health -= amount;
        this.isDamageFlashing = true;
        this.damageFlashTime = 5; // Flash 5 frames
        
        console.log(`💢 ${this.name} nhận damage: ${amount}. Máu còn: ${this.health}/${this.maxHealth}`);
        
        // Kiểm tra xem boss đã bị đánh bại chưa
        if (this.health <= 0) {
            this.health = 0;
            this.defeat();
        }
    }
    
    /**
     * Boss bị đánh bại
     */
    defeat() {
        this.isDefeated = true;
        this.isActive = false;
        console.log(`🏆 ${this.name} đã bị đánh bại!`);
    }
    
    /**
     * Xử lý câu hỏi đúng
     */
    onCorrectAnswer() {
        this.correctAnswersCount++;
        const damage = this.damagePerCorrectAnswer;
        this.takeDamage(damage);
        
        console.log(`✅ Câu đúng (${this.correctAnswersCount}/${this.questionsRequired})`);
        
        // Kiểm tra xem đã đủ câu để chiến thắng
        if (this.correctAnswersCount >= this.questionsRequired && this.health <= 0) {
            return true; // Boss defeated
        }
        return false;
    }
    
    /**
     * Xử lý câu hỏi sai
     */
    onWrongAnswer() {
        this.attack();
        return this.damageToPlayer; // Trả về số mạng player mất
    }
    
    /**
     * Vẽ boss lên canvas
     */
    draw(ctx) {
        if (!this.isActive) return;
        
        const bobbingOffset = Math.sin(this.bobbing) * this.bobbingAmount;
        const drawY = this.y + bobbingOffset;
        
        // Vẽ nền boss (hiệu ứng health bar background)
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(this.x - 20, drawY - 60, this.width + 40, 25);
        
        // Vẽ health bar background
        ctx.fillStyle = '#444444';
        ctx.fillRect(this.x - 15, drawY - 55, this.width + 30, 15);
        
        // Vẽ health bar
        const healthPercentage = this.health / this.maxHealth;
        ctx.fillStyle = healthPercentage > 0.5 ? '#00AA00' : (healthPercentage > 0.25 ? '#FFAA00' : '#AA0000');
        ctx.fillRect(this.x - 15, drawY - 55, (this.width + 30) * healthPercentage, 15);
        
        // Vẽ tên boss
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.name}`, this.x + this.width / 2, drawY - 65);
        
        // Vẽ health text
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`${Math.ceil(this.health)} / ${this.maxHealth}`, this.x + this.width / 2, drawY - 40);
        
        // Hiệu ứng damage flash
        if (this.isDamageFlashing) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(this.x, drawY, this.width, this.height);
        }
        
        // Vẽ boss emoji
        ctx.font = `${this.width}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.emoji, this.x + this.width / 2, drawY + this.height * 0.75);
        
        // Vẽ hiệu ứng tấn công
        if (this.isAttacking) {
            this.drawAttackEffect(ctx, this.x + this.width / 2, drawY);
        }
        
        // Vẽ số câu đúng cần thiết
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Cần: ${this.questionsRequired - this.correctAnswersCount} câu nữa`, this.x + this.width / 2, drawY + this.height + 30);
    }
    
    /**
     * Vẽ hiệu ứng tấn công
     */
    drawAttackEffect(ctx, x, y) {
        ctx.save();
        
        switch (this.attackPattern) {
            case 'bark':
                // Hiệu ứng sủa
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    const radius = 30 + i * 20 + this.attackAnimationFrame * 15;
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 100, 100, ${0.5 - i * 0.15})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                break;
                
            case 'fly_attack':
                // Hiệu ứng bay tấn công
                const attackX = x + Math.sin(this.attackAnimationFrame * 0.3) * 40;
                const attackY = y - 30 - this.attackAnimationFrame * 5;
                ctx.fillStyle = 'rgba(218, 165, 32, 0.4)';
                ctx.beginPath();
                ctx.arc(attackX, attackY, 25, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'fire_breath':
                // Hiệu ứng phun lửa
                ctx.fillStyle = 'rgba(255, 165, 0, 0.6)';
                for (let i = 0; i < 5; i++) {
                    const fireX = x + (Math.random() - 0.5) * 80;
                    const fireY = y - 30 - i * 15 - this.attackAnimationFrame * 10;
                    ctx.beginPath();
                    ctx.arc(fireX, fireY, 15 + Math.random() * 10, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        ctx.restore();
    }
}

// ========== BOSS FACTORY ==========
/**
 * Tạo boss theo giai đoạn
 */
function createBossByStage(stage) {
    let bossType;
    
    switch(stage) {
        case 1:
            bossType = BOSS_TYPES.CERBERUS;
            break;
        case 2:
            bossType = BOSS_TYPES.GRYPHON;
            break;
        case 3:
            bossType = BOSS_TYPES.DRAGON;
            break;
        default:
            bossType = BOSS_TYPES.CERBERUS;
    }
    
    return new Boss(bossType);
}

/**
 * Tạo boss theo loại
 */
function createBoss(type) {
    return new Boss(type);
}

// ========== BOSS BATTLE SYSTEM ==========
/**
 * Bắt đầu trận chiến với boss
 */
function startBossBattle(boss) {
    console.log(`⚔️ Bắt đầu trận chiến với ${boss.name}!`);
    boss.activate();
    showBossBattleScreen(boss);
}

/**
 * Hiển thị màn hình chiến đấu boss
 */
function showBossBattleScreen(boss) {
    questionActive = true;
    currentBoss = boss;
    
    const battleModal = document.getElementById('bossBattleModal') || createBossBattleModal();
    const bossNameEl = battleModal.querySelector('.boss-name');
    const bossHealthEl = battleModal.querySelector('.boss-health');
    const bossDescEl = battleModal.querySelector('.boss-description');
    
    bossNameEl.textContent = boss.name;
    bossDescEl.textContent = boss.description;
    updateBossHealthDisplay(boss);
    
    // Hiển thị câu hỏi
    showBossQuestion(boss);
    
    battleModal.style.display = 'flex';
}

/**
 * Cập nhật hiển thị health boss
 */
function updateBossHealthDisplay(boss) {
    const battleModal = document.getElementById('bossBattleModal');
    const healthBar = battleModal.querySelector('.health-bar-fill');
    const healthText = battleModal.querySelector('.health-text');
    
    const healthPercentage = (boss.health / boss.maxHealth) * 100;
    healthBar.style.width = healthPercentage + '%';
    healthText.textContent = `${Math.ceil(boss.health)} / ${boss.maxHealth}`;
}

/**
 * Hiển thị câu hỏi trong trận chiến boss
 */
function showBossQuestion(boss) {
    currentQuestion = getRandomQuestion();
    
    const battleModal = document.getElementById('bossBattleModal');
    const questionText = battleModal.querySelector('.boss-question-text');
    const answersContainer = battleModal.querySelector('.boss-answers-container');
    
    questionText.textContent = currentQuestion.question;
    answersContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn answer-btn';
        btn.textContent = option;
        btn.onclick = () => handleBossAnswer(index, currentQuestion.correct, boss);
        answersContainer.appendChild(btn);
    });
}

/**
 * Xử lý đáp án boss
 */
function handleBossAnswer(selected, correct, boss) {
    questionActive = false;
    const isCorrect = selected === correct;
    
    if (isCorrect) {
        // Câu đúng - gây damage cho boss
        console.log('✅ Trả lời đúng!');
        gameState.score += boss.damagePerCorrectAnswer;
        
        const isDefeated = boss.onCorrectAnswer();
        updateBossHealthDisplay(boss);
        
        if (isDefeated) {
            // Boss bị đánh bại
            defeatBoss(boss);
        } else {
            // Hiển thị câu hỏi tiếp theo
            setTimeout(() => {
                questionActive = true;
                showBossQuestion(boss);
            }, 1000);
        }
    } else {
        // Câu sai - player mất mạng
        console.log('❌ Trả lời sai!');
        const damageAmount = boss.onWrongAnswer();
        loseHealth(damageAmount);
        
        // Hiển thị câu hỏi tiếp theo
        setTimeout(() => {
            questionActive = true;
            showBossQuestion(boss);
        }, 1000);
    }
}

/**
 * Đánh bại boss
 */
function defeatBoss(boss) {
    const battleModal = document.getElementById('bossBattleModal');
    battleModal.style.display = 'none';
    questionActive = false;
    
    gameState.score += boss.scoreReward;
    gameState.playerHealth = Math.min(gameState.playerHealth + boss.healthReward, gameState.maxHealth);
    
    console.log(`🏆 Đánh bại ${boss.name}!`);
    console.log(`💰 Nhận ${boss.scoreReward} điểm và ${boss.healthReward} mạng sống`);
    
    // Chuyển sang stage tiếp theo sau 2 giây
    setTimeout(() => {
        if (gameState.stage < 3) {
            nextStage();
        } else {
            winGame();
        }
    }, 2000);
}

/**
 * Tạo modal chiến đấu boss nếu chưa có
 */
function createBossBattleModal() {
    const modal = document.createElement('div');
    modal.id = 'bossBattleModal';
    modal.className = 'boss-battle-modal';
    modal.innerHTML = `
        <div class="boss-battle-container">
            <div class="boss-info">
                <h2 class="boss-name">Boss Name</h2>
                <p class="boss-description">Boss Description</p>
                <div class="health-bar-container">
                    <div class="health-bar-fill"></div>
                    <p class="health-text">100 / 100</p>
                </div>
            </div>
            <div class="boss-question-section">
                <p class="boss-question-text">Câu hỏi</p>
                <div class="boss-answers-container"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// ========== EXPORT ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BOSS_TYPES,
        BOSS_CONFIG,
        Boss,
        createBossByStage,
        createBoss,
        startBossBattle
    };
}
