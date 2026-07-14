// Ngân hàng câu hỏi lượng giác - Lớp 10, 11, 12
const trigonometryQuestions = [
  // LỚP 10 - Giá trị lượng giác
  {
    id: 1,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "sin(30°) = ?",
    options: ["1/2", "√3/2", "1", "0"],
    correct: 0,
    explanation: "sin(30°) = 1/2 là một giá trị lượng giác cơ bản."
  },
  {
    id: 2,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "cos(60°) = ?",
    options: ["1/2", "√3/2", "1", "0"],
    correct: 0,
    explanation: "cos(60°) = 1/2 là một giá trị lượng giác cơ bản."
  },
  {
    id: 3,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "tan(45°) = ?",
    options: ["0", "1", "√3", "Không xác định"],
    correct: 1,
    explanation: "tan(45°) = 1 vì sin(45°) = cos(45°) = √2/2"
  },
  {
    id: 4,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "sin(90°) = ?",
    options: ["0", "1/2", "√3/2", "1"],
    correct: 3,
    explanation: "sin(90°) = 1 là giá trị lượng giác cơ bản."
  },
  {
    id: 5,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "cos(0°) = ?",
    options: ["0", "1", "√3/2", "-1"],
    correct: 1,
    explanation: "cos(0°) = 1 là giá trị lượng giác cơ bản."
  },
  {
    id: 6,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "cot(45°) = ?",
    options: ["0", "1", "√3", "Không xác định"],
    correct: 1,
    explanation: "cot(45°) = 1 vì cot(45°) = cos(45°)/sin(45°) = 1"
  },
  {
    id: 7,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "sin(0°) = ?",
    options: ["0", "1", "1/2", "√3/2"],
    correct: 0,
    explanation: "sin(0°) = 0 là giá trị lượng giác cơ bản."
  },
  {
    id: 8,
    grade: 10,
    category: "Giá trị lượng giác",
    question: "cos(90°) = ?",
    options: ["1", "0", "1/2", "√3/2"],
    correct: 1,
    explanation: "cos(90°) = 0 là giá trị lượng giác cơ bản."
  },
  {
    id: 9,
    grade: 10,
    category: "Công thức cộng",
    question: "sin(A + B) = ?",
    options: ["sinA·cosB + cosA·sinB", "sinA·cosB - cosA·sinB", "cosA·cosB + sinA·sinB", "cosA·cosB - sinA·sinB"],
    correct: 0,
    explanation: "sin(A + B) = sinA·cosB + cosA·sinB là công thức cộng sine."
  },
  {
    id: 10,
    grade: 10,
    category: "Công thức cộng",
    question: "cos(A + B) = ?",
    options: ["sinA·sinB + cosA·cosB", "sinA·sinB - cosA·cosB", "cosA·cosB - sinA·sinB", "cosA·cosB + sinA·sinB"],
    correct: 2,
    explanation: "cos(A + B) = cosA·cosB - sinA·sinB là công thức cộng cosine."
  },
  {
    id: 11,
    grade: 10,
    category: "Công thức cộng",
    question: "sin(A - B) = ?",
    options: ["sinA·cosB + cosA·sinB", "sinA·cosB - cosA·sinB", "cosA·cosB + sinA·sinB", "cosA·cosB - sinA·sinB"],
    correct: 1,
    explanation: "sin(A - B) = sinA·cosB - cosA·sinB là công thức trừ sine."
  },
  {
    id: 12,
    grade: 10,
    category: "Công thức cộng",
    question: "cos(A - B) = ?",
    options: ["cosA·cosB + sinA·sinB", "cosA·cosB - sinA·sinB", "sinA·sinB + cosA·cosB", "sinA·cosB + cosA·sinB"],
    correct: 0,
    explanation: "cos(A - B) = cosA·cosB + sinA·sinB là công thức trừ cosine."
  },
  {
    id: 13,
    grade: 10,
    category: "Công thức cộng",
    question: "tan(A + B) = ?",
    options: ["(tanA + tanB)/(1 - tanA·tanB)", "(tanA - tanB)/(1 + tanA·tanB)", "(tanA + tanB)/(1 + tanA·tanB)", "(tanA - tanB)/(1 - tanA·tanB)"],
    correct: 0,
    explanation: "tan(A + B) = (tanA + tanB)/(1 - tanA·tanB)"
  },
  {
    id: 14,
    grade: 11,
    category: "Công thức nhân đôi",
    question: "sin(2A) = ?",
    options: ["2sinA·cosA", "sin²A - cos²A", "2cos²A - 1", "1 - 2sin²A"],
    correct: 0,
    explanation: "sin(2A) = 2sinA·cosA là công thức nhân đôi sine."
  },
  {
    id: 15,
    grade: 11,
    category: "Công thức nhân đôi",
    question: "cos(2A) = ?",
    options: ["2sinA·cosA", "cos²A - sin²A", "2sin²A - 1", "sin²A + cos²A"],
    correct: 1,
    explanation: "cos(2A) = cos²A - sin²A (hoặc 2cos²A - 1 hoặc 1 - 2sin²A)"
  },
  {
    id: 16,
    grade: 11,
    category: "Công thức nhân đôi",
    question: "tan(2A) = ?",
    options: ["2tanA/(1 - tan²A)", "2tanA/(1 + tan²A)", "tan²A/(1 - tanA)", "(1 - tan²A)/(2tanA)"],
    correct: 0,
    explanation: "tan(2A) = 2tanA/(1 - tan²A) là công thức nhân đôi tangent."
  },
  {
    id: 17,
    grade: 11,
    category: "Công thức nhân đôi",
    question: "cos(2A) = 2cos²A - 1, tính cos²A = ?",
    options: ["(1 + cos2A)/2", "(1 - cos2A)/2", "(cos2A - 1)/2", "(cos2A + 1)/2"],
    correct: 0,
    explanation: "Từ cos(2A) = 2cos²A - 1, suy ra cos²A = (1 + cos2A)/2"
  },
  {
    id: 18,
    grade: 11,
    category: "Công thức nhân đôi",
    question: "sin²A = ?",
    options: ["(1 + cos2A)/2", "(1 - cos2A)/2", "(cos2A - 1)/2", "(cos2A + 1)/2"],
    correct: 1,
    explanation: "Từ cos(2A) = 1 - 2sin²A, suy ra sin²A = (1 - cos2A)/2"
  },
  {
    id: 19,
    grade: 11,
    category: "Phương trình lượng giác",
    question: "Phương trình sinx = 1/2 có nghiệm trong [0, 2π) là?",
    options: ["π/6 và 5π/6", "π/3 và 2π/3", "π/4 và 3π/4", "π/2 và 3π/2"],
    correct: 0,
    explanation: "sinx = 1/2 ⟹ x = π/6 + 2kπ hoặc x = 5π/6 + 2kπ"
  },
  {
    id: 20,
    grade: 11,
    category: "Phương trình lượng giác",
    question: "Phương trình cosx = 1/2 có nghiệm trong [0, 2π) là?",
    options: ["π/3 và 5π/3", "π/6 và 11π/6", "π/4 và 7π/4", "π/2 và 3π/2"],
    correct: 0,
    explanation: "cosx = 1/2 ⟹ x = π/3 + 2kπ hoặc x = -π/3 + 2kπ = 5π/3 + 2kπ"
  }
];

// Hàm lấy câu hỏi ngẫu nhiên (không lặp)
let usedQuestionIds = [];

function getRandomQuestion(grade = null) {
  let availableQuestions = trigonometryQuestions.filter(q => !usedQuestionIds.includes(q.id));
  
  if (grade) {
    availableQuestions = availableQuestions.filter(q => q.grade === grade);
  }
  
  if (availableQuestions.length === 0) {
    // Reset nếu hết câu hỏi
    usedQuestionIds = [];
    availableQuestions = trigonometryQuestions.filter(q => !usedQuestionIds.includes(q.id));
    if (grade) {
      availableQuestions = availableQuestions.filter(q => q.grade === grade);
    }
  }
  
  const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  usedQuestionIds.push(randomQuestion.id);
  
  return randomQuestion;
}

// Hàm reset câu hỏi đã dùng
function resetQuestions() {
  usedQuestionIds = [];
}