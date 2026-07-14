// Game State
let gameState = {
    currentScreen: 'mainMenu',
    selectedCharacter: null,
    playerName: null,
    playerHealth: 10,
    level: 1,
    stage: 1
};

// Character Data
const characters = {
    tartah: {
        name: 'Tartah',
        gender: '👨 Nam',
        intro: 'Hôm nay ta có nhiệm vụ nhỏ giao cho con, Tartah. Con hãy cầm bức thư này đem đến cho nhà vua ở kinh thành. Trên đường có lẽ sẽ gặp nhiều nguy hiểm nhưng ta tin con sẽ làm được. Nhớ rằng dù có chuyện gì xảy ra cũng phải bảo vệ bằng được bức thư.'
    },
    coco: {
        name: 'Coco',
        gender: '👩 Nữ',
        intro: 'Hôm nay ta có nhiệm vụ nhỏ giao cho con, Coco. Con hãy cầm bức thư này đem đến cho nhà vua ở kinh thành. Trên đường có lẽ sẽ gặp nhiều nguy hiểm nhưng ta tin con sẽ làm được. Nhớ rằng dù có chuyện gì xảy ra cũng phải bảo vệ bằng được bức thư.'
    }
};

// ========== SCREEN MANAGEMENT ==========
function showScreen(screenId) {
    // Ẩn tất cả screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Hiển thị screen mong muốn
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
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
    showScreen('mainMenu');
}

// ========== CHARACTER SELECT ==========
function selectCharacter(characterKey) {
    console.log(`👤 Chọn nhân vật: ${characterKey}`);
    
    gameState.selectedCharacter = characterKey;
    gameState.playerName = characters[characterKey].name;
    
    // Chuyển đến màn intro
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
    
    // Hiện tại chuyển sang game screen (sẽ là phần 2)
    // Sau này sẽ là phần 2: Hệ thống chướng ngại vật
    showScreen('gameScreen');
    
    // Log thông tin game
    console.log(`📊 Thông tin game:`);
    console.log(`   Nhân vật: ${gameState.playerName}`);
    console.log(`   Sinh mạng: ${gameState.playerHealth}`);
    console.log(`   Cấp độ: ${gameState.level}`);
}

// ========== UTILS ==========
function saveGameState() {
    localStorage.setItem('trigonometryGameState', JSON.stringify(gameState));
    console.log('💾 Lưu game state');
}

function loadGameState() {
    const saved = localStorage.getItem('trigonometryGameState');
    if (saved) {
        gameState = JSON.parse(saved);
        console.log('📂 Tải game state');
    }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Game Pháp Thuật Lượng Giác khởi động!');
    loadGameState();
    showScreen('mainMenu');
});