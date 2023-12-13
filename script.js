const startButton = document.getElementById('start');//починаємо через кнопку по кліку
startButton.addEventListener('click', startGame);
let gameOver = false;//чи закінчилась гра

function startGame() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const mines = parseInt(document.getElementById('mines').value);

    const board = createBoard(rows, cols, mines);//поле
    renderBoard(board);//показ поля
    addCellClickHandlers(board);
}

function createBoard(rows, cols, mines) {//створення поля і розставлення бомб
    const board = [];

    for (let i = 0; i < rows; i++) {//поле, створюються рядки та клітинки з початковими значеннями (без мін і закриті)
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push({ isMine: false, isOpen: false });
        }
        board.push(row);
    }

    let minesPlaced = 0;//бомби на полі
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].isMine) {//перевірка чи є вже бомба тут, якщо немає, то далі
            board[row][col].isMine = true;//бомба ставиться
            minesPlaced++;//лічильник збільшується
        }
    }
    return board;
}

function renderBoard(board) {//зображення поля
    const table = document.getElementById('pole');
    table.innerHTML = '';//очищення таблиці
    for (let i = 0; i < board.length; i++) {//=к-сті рядів поля
        const row = document.createElement('tr');//рядок таблиці
        for (let j = 0; j < board[i].length; j++) {//к-сть клітинок в рядку
            const cell = document.createElement('td');//клітинка таблиці
            cell.className = 'a';
            cell.dataset.row = i;//номер ряду
            cell.dataset.col = j;//номер стовпчика
            row.appendChild(cell);//клітинка додається як дочірній елемент і створюється ряд
        }
        table.appendChild(row);//ряд додається в таблицю
    }
}

function addCellClickHandlers(board) {//нажаття на клітинки
    const cells = document.getElementsByClassName('a');
    for (let i = 0; i < cells.length; i++) {//всі клітинки
        const cell = cells[i];//посилання на клітинку і зберігання в зімнній
        cell.addEventListener('click', handleCellClick.bind(null, board));//під час натискання передається в ф-ію
    }
}

function handleCellClick(board, event) {
    if (gameOver) {
        return;
    }
    const row = event.target.dataset.row;//отримання значення клітинки - номер ряду клітинки на полі
    const col = event.target.dataset.col;//номер стовпця
    const cell = board[row][col];
    
    if (cell.isMine) {
        event.target.classList.add('mine');//показ міни
        endGame(false);
    } else {
        event.target.classList.add('opened');//показ того, що не міна
        const numMines = countAdjacentMines(board, row, col);//підрахунок бомб сусідніх
        if (numMines > 0) {
            event.target.textContent = numMines; // встановлення числа на клітинці
        }
        if (numMines >= 1 && numMines <= 8) {
            event.target.classList.add(`number-${numMines}`);
        }
    }
    cell.isOpen = true;//відкрита клітинка

    if (checkForWin(board)) {//чи виграли гру
        endGame(true);
    }
}

function countAdjacentMines(board, row, col) {//рахує сусідні бомби
    let count = 0;
    const directions = [//напрям руху від клітинки
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ];

    for (const direction of directions) {//перебір всіх напрямів
        const newRow = parseInt(row) + direction.y;
        const newCol = parseInt(col) + direction.x;

        if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {//чи координати в межах
            if (board[newRow][newCol].isMine) {//якщо сусідня бомба
                count++;
            }
        }
    }
    return count;
}

function checkForWin(board) {//чи виграли
    for (let i = 0; i < board.length; i++) {//перебір рядків
        for (let j = 0; j < board[i].length; j++) {//перебір стовпців
            const cell = board[i][j];//кожна клітинка
            if (!cell.isMine && !cell.isOpen) {
                return false;
            }
        }
    }
    return true;
}

function endGame(isWinner) {
    gameOver = true;
    if (isWinner) {
        alert('Ви виграли!');
    } else {
        alert('Гра закінчена! БОМБА!!!');
    }
}
