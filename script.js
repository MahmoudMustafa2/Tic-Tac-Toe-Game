
// المتغير الذي يحتفظ باللاعب الحالي (X أو O)
let currentPlayer = "X";

// عدد الصفوف والأعمدة في اللوحة (في هذه الحالة 3x3)
let Number_of_Rows = 3;

// إجمالي عدد الأدوار الممكنة في اللعبة
const turns = Number_of_Rows ** 2;

// عداد يحسب عدد الأدوار التي تم لعبها
let turnsCounter = 0;


// دالة لإنشاء مصفوفة تمثل لوحة اللعب
const createBoardArray = () => {
  let board = [];

  // تكرار لإنشاء الصفوف وملئها بخانات فارغة "_"
  for (let row = 0; row < Number_of_Rows; row++) {
    board.push(Array.from({ length: Number_of_Rows }, () => "_"));
  }
  return board;
};


// اللوحة الحالية التي سيتم اللعب عليها
let board = createBoardArray();



// زر إعادة ضبط اللعبة
const resetButton = document.querySelector("#reset");




// دالة لحساب إحداثيات الخلية (الصف والعمود) بناءً على فهرسها
const cellPlacement = (index, numberofrows) => {
  const row = Math.floor(index / numberofrows); // حساب الصف
  const col = index % numberofrows; // حساب العمود
  return [row, col];   
};







// دالة للتحقق مما إذا كان أحد الصفوف يحتوي على نفس رمز اللاعب
const checkRows = (currentPlayer) => {
  let column = 0;
  for (let row = 0; row < Number_of_Rows; row++) {
    while (column < Number_of_Rows) {
      if (board[row][column] !== currentPlayer) {
        column = 0; // إذا لم يتطابق الرمز مع اللاعب الحالي، يتم إعادة العمود إلى الصفر
        break;
      }
      column++;
    }
    // إذا كانت جميع الخانات في الصف تحتوي على رمز اللاعب الحالي، يعني فوز
    if (column === Number_of_Rows) {
      return true;
    }
  }
};




// دالة للتحقق مما إذا كان أحد الأعمدة يحتوي على نفس رمز اللاعب
const checkColumns = () => {
  let row = 0;
  for (let column = 0; column < Number_of_Rows; column++) {
    while (row < Number_of_Rows) {
      if (board[row][column] !== currentPlayer) {
        row = 0; 
        break;
      }
      row++;
    }
    if (row === Number_of_Rows) {
      return true;
    }
  }
};





// دالة للتحقق من القطر الرئيسي إذا كان يحتوي على نفس رمز اللاعب
const checkDiagonals = () => {
  let count = 0;
  while (count < Number_of_Rows) {
    if (board[count][count] !== currentPlayer) {
      count = 0; 
      break;
    }
    count++;
  }
  if (count === Number_of_Rows) {
    return true;
  }
};



// دالة للتحقق من القطر العكسي إذا كان يحتوي على نفس رمز اللاعب
const checkReverseDiagonals = () => {
  let count = 0;

  while (count < Number_of_Rows) {
    if (board[count][Number_of_Rows - 1 - count] !== currentPlayer) {
      count = 0; 
      break;
    }
    count++;
  }
  if (count === Number_of_Rows) {
    return true;
  }
};








// دالة للتحقق من الفوز، تعتمد على دوال التحقق من الصفوف والأعمدة والأقطار
const checkWinner = (currentPlayer) => {
  if (checkRows(currentPlayer)) return true;
  if (checkColumns(currentPlayer)) return true;
  if (checkDiagonals(currentPlayer)) return true;
  if (checkReverseDiagonals(currentPlayer)) return true;
};






// دالة لإعادة ضبط اللعبة واللوحة
const resetBoard = () => {
  document.querySelector(".board").remove(); // إزالة اللوحة الحالية
  createBoard(); // إنشاء لوحة جديدة
  board = createBoardArray(); // إعادة تعيين اللوحة
  currentPlayer = "X"; // إعادة تعيين اللاعب الحالي إلى X
  turnsCounter = 0; // إعادة تعيين عداد الأدوار
};





// دالة لعرض رسالة الفوز وإعادة ضبط اللعبة
const eventWhenWin = (currentPlayer) => {
  setTimeout(() => {
    alert(`Player ${currentPlayer} won!`);
    resetBoard();
  }, 100);
};





// دالة لعرض رسالة التعادل وإعادة ضبط اللعبة
const runDrawEvent = () => {
  setTimeout(() => {
    alert("Draw!");
    resetBoard();
  }, 100);
};





// دالة لرسم علامة اللاعب الحالي في الخلية المحددة
const drawMark = (cell, currentPlayer) => {
  cell.querySelector(".value").textContent = currentPlayer;
  cell.classList.add(`cell--${currentPlayer}`);
};






// دالة يتم استدعاؤها عند الضغط على خلية، تقوم بتحديث الخلية والتحقق من الفوز أو التعادل
const cellClick = (event, index) => {
  const cell = event.target;
  const [row, col] = cellPlacement(index, Number_of_Rows); // الحصول على مكان الخلية

  if (board[row][col] === "_") { // التحقق من أن الخلية فارغة
    turnsCounter++;
    board[row][col] = currentPlayer; // تعيين رمز اللاعب الحالي في الخلية

    drawMark(cell, currentPlayer); // رسم علامة اللاعب في الخلية

    if (checkWinner(currentPlayer)) { // التحقق من الفوز
      eventWhenWin(currentPlayer);
    } else {
      turnsCounter === turns && runDrawEvent(); // التحقق من التعادل
      currentPlayer = currentPlayer === "X" ? "O" : "X"; // تبديل اللاعب
    }
  }
};






// دالة لإنشاء عنصر خلية في اللوحة
const createCell = (index) => {
  const cellElementString = `<div class="cell" role="button" tabindex="${index + 1}"><span class="value"></span></div>`;
  const cellElement = document.createRange().createContextualFragment(cellElementString);

  cellElement.querySelector(".cell").onclick = (event) => cellClick(event, index); // تعيين حدث الضغط على الخلية
  cellElement.querySelector(".cell").onkeydown = (event) =>
    event.key === "Enter" ? cellClick(event, index) : true; // تعيين حدث الضغط على Enter في الخلية

  return cellElement;
};






// دالة لإنشاء لوحة اللعبة
const createBoard = () => {
  const container = document.querySelector(".container");
  const board = document.createElement("div");

  board.classList.add("board");

  for (let i = 0; i < Number_of_Rows ** 2; i++) { // إنشاء الخلايا وإضافتها إلى اللوحة
    const cellElement = createCell(i);
    board.appendChild(cellElement);
    document.documentElement.style.setProperty("--grid-rows", Number_of_Rows); // ضبط عدد الصفوف في الشبكة
  }

  container.insertAdjacentElement("afterbegin", board); // إضافة اللوحة إلى الصفحة
};




// تعيين حدث إعادة الضبط عند الضغط على زر "إعادة"
resetButton.addEventListener("click", resetBoard);
// إنشاء اللوحة عند تحميل الصفحة
createBoard();
