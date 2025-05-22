document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const dealerCardsElement = document.getElementById('dealerCards');
    const playerCardsElement = document.getElementById('playerCards');
    const dealerScoreElement = document.getElementById('dealerScore');
    const playerScoreElement = document.getElementById('playerScore');
    const gameStatusElement = document.getElementById('gameStatus');
    const dealButton = document.getElementById('dealButton');
    const hitButton = document.getElementById('hitButton');
    const standButton = document.getElementById('standButton');
    const doubleButton = document.getElementById('doubleButton');
    const actionButtons = document.getElementById('actionButtons');
    const betButtons = document.getElementById('betButtons');
    const blackjackBetElement = document.getElementById('blackjackBet');
    
    // Настройки игры
    let deck = [];
    let dealerCards = [];
    let playerCards = [];
    let dealerScore = 0;
    let playerScore = 0;
    let currentBet = 50;
    let gameInProgress = false;
    
    // Инициализация игры
    init();
    
    // Обработчики событий
    dealButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
    doubleButton.addEventListener('click', double);
    
    // Обработчики для кнопок ставок
    document.querySelectorAll('.chip-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (gameInProgress) return;
            
            const value = parseInt(this.getAttribute('data-value'));
            currentBet = value;
            updateBetDisplay();
            
            // Обновление активной кнопки
            document.querySelectorAll('.chip-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Функция инициализации
    function init() {
        // Обновление отображения ставки
        updateBetDisplay();
    }
    
    // Функция начала игры
    function startGame() {
        // Проверка баланса
        const currentBalance = window.getBalance();
        if (currentBalance < currentBet) {
            gameStatusElement.textContent = 'Недостаточно средств!';
            return;
        }
        
        // Списание ставки
        window.updateBalance(-currentBet);
        
        // Сброс предыдущей игры
        dealerCards = [];
        playerCards = [];
        dealerScore = 0;
        playerScore = 0;
        gameInProgress = true;
        
        // Очистка карт
        dealerCardsElement.innerHTML = '';
        playerCardsElement.innerHTML = '';
        
        // Создание новой колоды и перемешивание
        createDeck();
        shuffleDeck();
        
        // Раздача начальных карт
        dealCard(dealerCards, dealerCardsElement, true);
        dealCard(playerCards, playerCardsElement);
        dealCard(dealerCards, dealerCardsElement);
        dealCard(playerCards, playerCardsElement);
        
        // Обновление счета
        updateScores();
        
        // Проверка на блэкджек
        checkForBlackjack();
        
        // Переключение кнопок
        dealButton.style.display = 'none';
        betButtons.style.display = 'none';
        actionButtons.style.display = 'flex';
    }
    
    // Функция создания колоды
    function createDeck() {
        deck = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
    }
    
    // Функция перемешивания колоды
    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    // Функция раздачи карты
    function dealCard(hand, element, isHidden = false) {
        if (deck.length === 0) {
            createDeck();
            shuffleDeck();
        }
        
        const card = deck.pop();
        hand.push(card);
        
        const cardElement = document.createElement('div');
        cardElement.className = isHidden ? 'card card-back' : `card ${card.suit}`;
        
        if (!isHidden) {
            cardElement.setAttribute('data-value', card.value);
            
            const span = document.createElement('span');
            span.textContent = getSuitSymbol(card.suit);
            cardElement.appendChild(span);
            
            // Добавление анимации появления карты
            cardElement.style.opacity = '0';
            cardElement.style.transform = 'translateY(-20px) rotate(-10deg)';
        }
        
        element.appendChild(cardElement);
        
        // Анимация появления карты
        if (!isHidden) {
            setTimeout(() => {
                cardElement.style.transition = 'all 0.5s ease';
                cardElement.style.opacity = '1';
                cardElement.style.transform = 'translateY(0) rotate(0)';
            }, 50);
        }
    }
    
    // Получение символа масти
    function getSuitSymbol(suit) {
        switch (suit) {
            case 'hearts': return '♥';
            case 'diamonds': return '♦';
            case 'clubs': return '♣';
            case 'spades': return '♠';
        }
    }
    
    // Функция обновления счета
    function updateScores() {
        dealerScore = calculateScore(dealerCards);
        playerScore = calculateScore(playerCards);
        
        dealerScoreElement.textContent = dealerCards[0].hidden ? '?' : dealerScore;
        playerScoreElement.textContent = playerScore;
    }
    
    // Функция расчета счета
    function calculateScore(hand) {
        let score = 0;
        let aces = 0;
        
        for (let card of hand) {
            if (card.hidden) continue;
            
            if (card.value === 'A') {
                aces++;
                score += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }
        
        // Корректировка для тузов
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }
    
    // Функция проверки на блэкджек
    function checkForBlackjack() {
        if (playerScore === 21) {
            // У игрока блэкджек
            revealDealerCards();
            
            if (dealerScore === 21) {
                // Ничья
                gameStatusElement.textContent = 'Ничья! У обоих блэкджек.';
                window.updateBalance(currentBet); // Возврат ставки
            } else {
                // Игрок выиграл с блэкджеком (выплата 3:2)
                const winAmount = Math.floor(currentBet * 2.5);
                gameStatusElement.textContent = `Блэкджек! Вы выиграли ${winAmount}!`;
                window.updateBalance(winAmount);
            }
            
            endGame();
        }
    }
    
    // Функция "Взять карту"
    function hit() {
        dealCard(playerCards, playerCardsElement);
        updateScores();
        
        // Проверка на перебор
        if (playerScore > 21) {
            gameStatusElement.textContent = 'Перебор! Вы проиграли.';
            revealDealerCards();
            endGame();
        }
        
        // Отключение кнопки "Удвоить" после взятия карты
        doubleButton.disabled = true;
    }
    
    // Функция "Остановиться"
    function stand() {
        revealDealerCards();
        
        // Дилер берет карты, пока его счет меньше 17
        let dealerTurn = setInterval(() => {
            if (dealerScore < 17) {
                dealCard(dealerCards, dealerCardsElement);
                updateScores();
            } else {
                clearInterval(dealerTurn);
                determineWinner();
            }
        }, 1000);
    }
    
    // Функция "Удвоить"
    function double() {
        // Проверка баланса
        const currentBalance = window.getBalance();
        if (currentBalance < currentBet) {
            gameStatusElement.textContent = 'Недостаточно средств для удвоения!';
            return;
        }
        
        // Удвоение ставки
        window.updateBalance(-currentBet);
        currentBet *= 2;
        updateBetDisplay();
        
        // Взятие одной карты и остановка
        dealCard(playerCards, playerCardsElement);
        updateScores();
        
        // Проверка на перебор
        if (playerScore > 21) {
            gameStatusElement.textContent = 'Перебор! Вы проиграли.';
            revealDealerCards();
            endGame();
        } else {
            stand();
        }
    }
    
    // Функция раскрытия карт дилера
    function revealDealerCards() {
        // Удаление скрытой карты
        dealerCardsElement.innerHTML = '';
        
        // Отображение всех карт дилера
        for (let card of dealerCards) {
            card.hidden = false;
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit}`;
            cardElement.setAttribute('data-value', card.value);
            
            const span = document.createElement('span');
            span.textContent = getSuitSymbol(card.suit);
            cardElement.appendChild(span);
            
            dealerCardsElement.appendChild(cardElement);
        }
        
        updateScores();
    }
    
    // Функция определения победителя
    function determineWinner() {
        if (playerScore > 21) {
            gameStatusElement.textContent = 'Перебор! Вы проиграли.';
        } else if (dealerScore > 21) {
            gameStatusElement.textContent = `Перебор у дилера! Вы выиграли ${currentBet * 2}!`;
            window.updateBalance(currentBet * 2);
        } else if (playerScore > dealerScore) {
            gameStatusElement.textContent = `Вы выиграли ${currentBet * 2}!`;
            window.updateBalance(currentBet * 2);
        } else if (playerScore < dealerScore) {
            gameStatusElement.textContent = 'Дилер выиграл.';
        } else {
            gameStatusElement.textContent = 'Ничья!';
            window.updateBalance(currentBet); // Возврат ставки
        }
        
        endGame();
    }
    
    // Функция завершения игры
    function endGame() {
        gameInProgress = false;
        actionButtons.style.display = 'none';
        dealButton.style.display = 'block';
        betButtons.style.display = 'flex';
        doubleButton.disabled = false;
    }
    
    // Функция обновления отображения ставки
    function updateBetDisplay() {
        blackjackBetElement.textContent = currentBet;
    }
});