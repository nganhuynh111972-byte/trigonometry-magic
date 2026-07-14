// ========== GAME CONSTANTS ==========
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 40;
const OBSTACLE_SIZE = 60;
let PLAYER_SPEED = 5; // Changed to let để có thể thay đổi (băng đá)

// ========== GAME STATE ==========
let gameState = {
    currentScreen: 'mainMenu',
    selectedCharacter: null,
    playerName: null,
    playerHealth: 10,
    maxHealth: 10,
    level: 1,
    stage: 1,
    score: 0,
    isPlaying: false,
    gameOver: false,
    playerWon: false
};

// ========== PLAYER OBJECT ==========
let player = {
    x: 100,
    y: CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocity: { x: 0, y: 0 },
    emoji: '🧙'
};

// ========== GAME VARIABLES ==========
let traps = [];
let currentTrap = null; // Trap hiện tại đang tương tác
let currentQuestion = null;
let questionActive = false;
let keysPressed = {};
let gameCanvas = null;
let ctx = null;

// ========== CHARACTER DATA ==========
const characters = {
    tartah: {
        name: 'Tartah',
        gender: '👨 Nam',
        emoji: '🧙‍♂️',
        intro: 'Hôm nay ta có nhiệm vụ nhỏ giao cho con, Tartah. Con hãy cầm bức thư này đem đến cho nhà vua ở kinh thành. Trên đường có lẽ sẽ gặp nhiều nguy hiểm. Hãy trả lời đúng những câu hỏi lượng giác để vượt qua các thử thách và hoàn thành nhiệm vụ này!'
    },
    coco: {
        name: 'Coco',
        gender: '👩 Nữ',
        emoji: '🧙‍♀️',
        intro: 'Hôm nay ta có nhiệm vụ nhỏ giao cho con, Coco. Con hãy cầm bức thư này đem đến cho nhà vua ở kinh thành. Trên đường có lẽ sẽ gặp nhiều nguy hiểm. Hãy trả lời đúng những câu hỏi lượng giác để vượt qua các thử thách và hoàn thành nhiệm vụ này!'
    }
};

// ========== SCREEN MANAGEMENT ==========
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
    }

    // Khởi tạo canvas nếu vào game screen
    if (screenId === 'gameScreen') {
        setTimeout(() => {
            gameCanvas = document.getElementById('gameCanvas');
            if (gameCanvas) {
                gameCanvas.width = CANVAS_WIDTH;
                gameCanvas.height = CANVAS_HEIGHT;
                ctx = gameCanvas.getContext('2d');
                initializeGame();
            }
        }, 100);
    }
}

// ========== MAIN MENU ==========
function startGame() {
    console.log('🎮 Bắt đầu game...');
    showScreen('characterSelect');
}

function showGuide() {
    console.log('📖 Mở hướng dẫn...');
    showScreen('guideScreen');
}

function backToMenu() {
    console.log('← Quay lại menu chính...');
    gameState.isPlaying = false;
    showScreen('mainMenu');
}

// ========== CHARACTER SELECT ==========
function selectCharacter(characterKey) {
    console.log(`👤 Chọn nhân vật: ${characterKey}`);
    
    gameState.selectedCharacter = characterKey;
    gameState.playerName = characters[characterKey].name;
    player.emoji = characters[characterKey].emoji;
    
    showIntro();
}

// ========== INTRO SCREEN ==========
function showIntro() {
    showScreen('introScreen');
    
    const character = characters[gameState.selectedCharacter];
    const masterNameEl = document.getElementById('masterName');
    const masterDialogueEl = document.getElementById('masterDialogue');
    
    masterNameEl.textContent = 'Master Beldaruit';
    masterDialogueEl.textContent = character.intro;
    
    console.log(`🎬 Hiển thị intro cho ${character.name}`);
}

function continueIntro() {
    console.log('→ Tiếp tục từ intro...');
    showScreen('gameScreen');
}

// ========== GAME INITIALIZATION ==========
function initializeGame() {
    console.log('🎮 Khởi tạo trò chơi...');
    gameState.isPlaying = true;
    gameState.gameOver = false;
    gameState.playerWon = false;
    gameState.playerHealth = gameState.maxHealth;
    gameState.score = 0;
    gameState.level = 1;
    gameState.stage = 1;
    
    player.x = 100;
    player.y = CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2;
    player.velocity = { x: 0, y: 0 };
    
    PLAYER_SPEED = 5; // Reset tốc độ
    traps = [];
    generateTraps();
    
    // Khởi tạo input handler
    setupKeyboardInput();
    
    // Bắt đầu game loop
    gameLoop();
}

// ========== KEYBOARD INPUT ==========
function setupKeyboardInput() {
    document.addEventListener('keydown', (e) => {
        keysPressed[e.key.toLowerCase()] = true;
        
        if (e.key === 'Enter' && questionActive) {
            // Handle answer selection
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keysPressed[e.key.toLowerCase()] = false;
    });
}

// ========== GENERATE TRAPS ==========
/**
 * Tạo mảng các bẫy sử dụng Trap class
 */
function generateTraps() {
    traps = [];
    const trapTypesList = Object.values(TRAP_TYPES);
    const weights = [40, 25, 15, 10, 5, 5]; // Tỉ lệ xuất hiện từng loại bẫy
    
    const numTraps = 8 + Math.floor(Math.random() * 4); // 8-11 bẫy
    
    for (let i = 0; i < numTraps; i++) {
        const randomX = 300 + i * 100 + Math.random() * 50;
        const randomY = 50 + Math.random() * (CANVAS_HEIGHT - OBSTACLE_SIZE - 100);
        
        // Chọn loại bẫy dựa trên trọng số
        let rand = Math.random() * 100;
        let selectedType = trapTypesList[0];
        let cumulative = 0;
        
        for (let j = 0; j < trapTypesList.length; j++) {
            cumulative += weights[j];
            if (rand < cumulative) {
                selectedType = trapTypesList[j];
                break;
            }
        }
        
        // Tạo Trap object
        const trap = new Trap(randomX, randomY, selectedType);
        traps.push(trap);
    }
    
    console.log(`✨ Tạo ${traps.length} bẫy`);
}

// ========== GAME LOOP ==========
function gameLoop() {
    if (!gameState.isPlaying) return;
    
    // Update
    updatePlayer();
    updateTraps(); // Cập nhật trạng thái các bẫy
    checkCollisions();
    
    // Draw
    draw();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// ========== UPDATE TRAPS ==========
/**
 * Cập nhật trạng thái tất cả các bẫy
 */
function updateTraps() {
    for (let trap of traps) {
        trap.update();
    }
}

// ========== UPDATE PLAYER ==========
function updatePlayer() {
    // Xử lý input
    player.velocity.x = 0;
    player.velocity.y = 0;
    
    if (keysPressed['w'] || keysPressed['arrowup']) player.velocity.y = -PLAYER_SPEED;
    if (keysPressed['s'] || keysPressed['arrowdown']) player.velocity.y = PLAYER_SPEED;
    if (keysPressed['a'] || keysPressed['arrowleft']) player.velocity.x = -PLAYER_SPEED;
    if (keysPressed['d'] || keysPressed['arrowright']) player.velocity.x = PLAYER_SPEED;
    
    // Cập nhật vị trí
    player.x += player.velocity.x;
    player.y += player.velocity.y;
    
    // Collision với tường
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > CANVAS_WIDTH) player.x = CANVAS_WIDTH - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > CANVAS_HEIGHT) player.y = CANVAS_HEIGHT - player.height;
}

// ========== CHECK COLLISIONS ==========
function checkCollisions() {
    for (let trap of traps) {
        if (!trap.hit && isColliding(player, trap)) {
            trap.hit = true;
            handleTrapCollision(trap);
        }
    }
    
    // Kiểm tra win condition
    if (player.x + player.width > CANVAS_WIDTH - 50) {
        if (gameState.stage < 3) {
            nextStage();
        } else {
            winGame();
        }
    }
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// ========== HANDLE TRAP COLLISION ==========
/**
 * Xử lý va chạm với bẫy
 */
function handleTrapCollision(trap) {
    console.log(`💥 Va chạm với: ${trap.config.name}`);
    currentTrap = trap;
    handleTrapEffect(trap);
}

// ========== SHOW TRAP QUESTION ==========
/**
 * Hiển thị câu hỏi cho bẫy
 */
function showTrapQuestion(trap) {
    questionActive = true;
    currentQuestion = getRandomQuestion();
    currentTrap = trap;
    
    const questionModal = document.getElementById('questionModal');
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    
    // Hiển thị tên bẫy trong tiêu đề
    const modalTitle = questionModal.querySelector('h2') || document.createElement('h2');
    modalTitle.textContent = `⚔️ ${trap.config.name} - Trả lời để thoát!`;
    
    questionText.textContent = currentQuestion.question;
    answersContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn answer-btn';
        btn.textContent = option;
        btn.onclick = () => handleTrapAnswer(index, currentQuestion.correct, trap);
        answersContainer.appendChild(btn);
    });
    
    questionModal.style.display = 'flex';
}

// ========== HANDLE TRAP ANSWER ==========
/**
 * Xử lý đáp án câu hỏi bẫy
 */
function handleTrapAnswer(selected, correct, trap) {
    const questionModal = document.getElementById('questionModal');
    questionModal.style.display = 'none';
    questionActive = false;
    
    handleTrapQuestion(trap, selected === correct);
}

// ========== LOSE HEALTH ==========
function loseHealth(amount = 1) {
    gameState.playerHealth -= amount;
    console.log(`❤️ Mạng còn lại: ${gameState.playerHealth}`);
    
    if (gameState.playerHealth <= 0) {
        gameOver();
    }
}

// ========== NEXT STAGE ==========
function nextStage() {
    gameState.stage++;
    console.log(`📍 Chuyển sang đoạn ${gameState.stage}`);
    
    player.x = 100;
    player.y = CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2;
    PLAYER_SPEED = 5; // Reset tốc độ
    
    traps = [];
    generateTraps();
}

// ========== WIN GAME ==========
function winGame() {
    gameState.playerWon = true;
    gameState.isPlaying = false;
    console.log('🏆 Bạn đã thắng!');
    
    showGameOver(true);
}

// ========== GAME OVER ==========
function gameOver() {
    gameState.gameOver = true;
    gameState.isPlaying = false;
    console.log('💀 Game Over!');
    
    showGameOver(false);
}

// ========== SHOW GAME OVER SCREEN ==========
function showGameOver(won) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const gameOverScore = document.getElementById('gameOverScore');
    const restartBtn = document.getElementById('restartBtn');
    
    if (won) {
        gameOverTitle.textContent = '🏆 CHIẾN THẮNG!';
        gameOverMessage.textContent = `Bạn đã hoàn thành nhiệm vụ! Bức thư đã được trao cho nhà vua!`;
    } else {
        gameOverTitle.textContent = '💀 GAME OVER';
        gameOverMessage.textContent = `Bạn đã mất tất cả mạng sống. Nhiệm vụ thất bại!`;
    }
    
    gameOverScore.textContent = `Điểm số: ${gameState.score}`;
    
    gameOverScreen.style.display = 'flex';
    
    restartBtn.onclick = () => {
        gameOverScreen.style.display = 'none';
        showScreen('gameScreen');
    };
}

// ========== DRAW GAME ==========
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw stage indicator
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Đoạn ${gameState.stage}/3`, 20, 30);
    
    // Draw goal flag
    ctx.fillStyle = '#f1faee';
    ctx.fillText('🏁', CANVAS_WIDTH - 50, CANVAS_HEIGHT / 2);
    
    // Draw traps với hiệu ứng đặc biệt
    for (let trap of traps) {
        trap.draw(ctx);
    }
    
    // Draw player
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.emoji, player.x + player.width / 2, player.y + player.height / 2 + 10);
    
    // Draw HUD
    drawHUD();
}

// ========== DRAW HUD ==========
function drawHUD() {
    const hudY = CANVAS_HEIGHT - 40;
    
    // Health
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Sinh mạng: ', 20, hudY);
    
    for (let i = 0; i < gameState.maxHealth; i++) {
        if (i < gameState.playerHealth) {
            ctx.fillText('❤️', 140 + i * 25, hudY);
        } else {
            ctx.fillText('🖤', 140 + i * 25, hudY);
        }
    }
    
    // Score
    ctx.fillStyle = '#a8dadc';
    ctx.fillText(`Điểm: ${gameState.score}`, CANVAS_WIDTH - 200, hudY);
}

// ========== GET RANDOM QUESTION ==========
function getRandomQuestion() {
    if (typeof trigonometryQuestions !== 'undefined' && trigonometryQuestions.length > 0) {
        return trigonometryQuestions[Math.floor(Math.random() * trigonometryQuestions.length)];
    }
    
    // Fallback question
    return {
        question: 'sin(30°) = ?',
        options: ['1/2', '√3/2', '1', '0'],
        correct: 0
    };
}

// ========== UTILS ==========
function saveGameState() {
    localStorage.setItem('trigonometryGameState', JSON.stringify(gameState));
    console.log('💾 Lưu game state');
}

function loadGameState() {
    const saved = localStorage.getItem('trigonometryGameState');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(gameState, loaded);
        console.log('📂 Tải game state');
    }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Game Pháp Thuật Lượng Giác khởi động!');
    loadGameState();
    showScreen('mainMenu');
});
