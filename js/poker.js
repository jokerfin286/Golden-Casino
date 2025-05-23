document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const dealButton = document.getElementById('dealBtn');
    const foldButton = document.getElementById('foldBtn');
    const checkButton = document.getElementById('checkBtn');
    const callButton = document.getElementById('callBtn');
    const raiseButton = document.getElementById('raiseBtn');
    const betAmountElement = document.getElementById('pokerBetAmount');
    const potAmountElement = document.getElementById('potAmount');
    const playerChipsElement = document.getElementById('playerChips');
    const gameMessageElement = document.getElementById('gameMessage');
    const chipButtons = document.querySelectorAll('.chip-btn');
    
    // Карты
    const playerCard1 = document.getElementById('playerCard1');
    const playerCard2 = document.getElementById('playerCard2');
    const dealerCard1 = document.getElementById('dealerCard1');
    const dealerCard2 = document.getElementById('dealerCard2');
    const communityCards = [
        document.getElementById('communityCard1'),
        document.getElementById('communityCard2'),
        document.getElementById('communityCard3'),
        document.getElementById('communityCard4'),
        document.getElementById('communityCard5')
    ];
    
    // Настройки игры
    let currentChipValue = 10;
    let currentBet = 0;
    let potAmount = 0;
    let playerChips = 5000;
    let dealerChips = 5000;
    let gameStage = 'init'; // init, preflop, flop, turn, river, showdown
    let playerCards = [];
    let dealerCards = [];
    let communityCardsData = [];
    let deck = [];
    let dealerBet = 0;
    
    // Инициализация игры
    updateChips();
    updateBetDisplay();
    updatePotDisplay();
    showGameMessage('Добро пожаловать в Техасский Холдем! Нажмите "Раздать" для начала игры.');
    
    // Обработчики событий
    dealButton.addEventListener('click', startNewHand);
    foldButton.addEventListener('click', fold);
    checkButton.addEventListener('click', check);
    callButton.addEventListener('click', call);
    raiseButton.addEventListener('click', raise);
    
    // Обработчики для кнопок фишек
    chipButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (gameStage === 'init') return;
            
            const value = parseInt(this.getAttribute('data-value'));
            currentChipValue = value;
            
            // Обновление активной кнопки с анимацией
            chipButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('pulse-animation');
            });
            
            this.classList.add('active');
            this.classList.add('pulse-animation');
            
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 500);
        });
    });
    
    // Функция начала новой раздачи
    function startNewHand() {
        // Сброс предыдущей игры
        resetGame();
        
        // Создание и перемешивание колоды
        createDeck();
        shuffleDeck();
        
        // Раздача карт
        dealCards();
        
        // Обновление интерфейса
        updateGameStage('preflop');
        updateButtons();
        
        // Начальные ставки (блайнды)
        const smallBlind = 5;
        const bigBlind = 10;
        
        // Игрок ставит малый блайнд
        placeBet(smallBlind, 'player');
        
        // Дилер ставит большой блайнд
        placeBet(bigBlind, 'dealer');
        
        // Обновление сообщения
        showGameMessage('Ваш ход. Дилер поставил большой блайнд (10).');
    }
    
    // Функция сброса игры
    function resetGame() {
        gameStage = 'init';
        currentBet = 0;
        potAmount = 0;
        playerCards = [];
        dealerCards = [];
        communityCardsData = [];
        dealerBet = 0;
        
        // Сброс отображения карт
        resetCardDisplay();
        
        // Обновление отображения
        updateBetDisplay();
        updatePotDisplay();
    }
    
    // Функция создания колоды
    function createDeck() {
        deck = [];
        const suits = ['♥', '♦', '♣', '♠'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push({
                    suit: suit,
                    value: value,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                    numericValue: getNumericValue(value)
                });
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
    
    // Функция раздачи карт
    function dealCards() {
        // Раздача карт игроку
        playerCards = [deck.pop(), deck.pop()];
        
        // Раздача карт дилеру
        dealerCards = [deck.pop(), deck.pop()];
        
        // Анимация раздачи карт
        setTimeout(() => {
            displayCard(playerCard1, playerCards[0], true);
        }, 300);
        
        setTimeout(() => {
            displayCard(playerCard2, playerCards[1], true);
        }, 600);
        
        setTimeout(() => {
            dealerCard1.classList.add('card-dealt');
        }, 900);
        
        setTimeout(() => {
            dealerCard2.classList.add('card-dealt');
        }, 1200);
    }
    
    // Функция отображения карты
    function displayCard(cardElement, cardData, show = false) {
        cardElement.classList.remove('card-back', 'card-placeholder');
        cardElement.classList.add('card-dealt');
        
        if (show) {
            setTimeout(() => {
                cardElement.classList.add('card-front');
                cardElement.innerHTML = `
                    <div class="card-value">${cardData.value}</div>
                    <div class="card-suit ${cardData.color}">${cardData.suit}</div>
                    <div class="card-value" style="transform: rotate(180deg)">${cardData.value}</div>
                `;
            }, 300);
        }
    }
    
    // Функция сброса отображения карт
    function resetCardDisplay() {
        playerCard1.className = 'card card-back';
        playerCard2.className = 'card card-back';
        dealerCard1.className = 'card card-back';
        dealerCard2.className = 'card card-back';
        
        playerCard1.innerHTML = '';
        playerCard2.innerHTML = '';
        dealerCard1.innerHTML = '';
        dealerCard2.innerHTML = '';
        
        communityCards.forEach(card => {
            card.className = 'card card-placeholder';
            card.innerHTML = '';
        });
    }
    
    // Функция обновления стадии игры
    function updateGameStage(stage) {
        gameStage = stage;
        
        switch (stage) {
            case 'preflop':
                // Уже раздали карты игрокам
                break;
            case 'flop':
                // Открываем 3 общие карты
                communityCardsData = [deck.pop(), deck.pop(), deck.pop()];
                
                setTimeout(() => {
                    displayCard(communityCards[0], communityCardsData[0], true);
                }, 300);
                
                setTimeout(() => {
                    displayCard(communityCards[1], communityCardsData[1], true);
                }, 600);
                
                setTimeout(() => {
                    displayCard(communityCards[2], communityCardsData[2], true);
                }, 900);
                
                break;
            case 'turn':
                // Открываем 4-ю общую карту
                communityCardsData.push(deck.pop());
                
                setTimeout(() => {
                    displayCard(communityCards[3], communityCardsData[3], true);
                }, 300);
                
                break;
            case 'river':
                // Открываем 5-ю общую карту
                communityCardsData.push(deck.pop());
                
                setTimeout(() => {
                    displayCard(communityCards[4], communityCardsData[4], true);
                }, 300);
                
                break;
            case 'showdown':
                // Показываем карты дилера
                setTimeout(() => {
                    displayCard(dealerCard1, dealerCards[0], true);
                }, 300);
                
                setTimeout(() => {
                    displayCard(dealerCard2, dealerCards[1], true);
                }, 600);
                
                // Определяем победителя
                setTimeout(() => {
                    determineWinner();
                }, 1500);
                
                break;
        }
        
        updateButtons();
    }
    
    // Функция обновления кнопок
    function updateButtons() {
        if (gameStage === 'init') {
            dealButton.disabled = false;
            foldButton.disabled = true;
            checkButton.disabled = true;
            callButton.disabled = true;
            raiseButton.disabled = true;
        } else if (gameStage === 'showdown') {
            dealButton.disabled = false;
            foldButton.disabled = true;
            checkButton.disabled = true;
            callButton.disabled = true;
            raiseButton.disabled = true;
        } else {
            dealButton.disabled = true;
            foldButton.disabled = false;
            
            // Если ставка дилера равна ставке игрока, можно сделать чек
            if (dealerBet === currentBet) {
                checkButton.disabled = false;
                callButton.disabled = true;
            } else {
                checkButton.disabled = true;
                callButton.disabled = false;
            }
            
            // Рейз доступен, если у игрока достаточно фишек
            raiseButton.disabled = playerChips < currentChipValue;
        }
    }
    
    // Функция размещения ставки
    function placeBet(amount, player) {
        if (player === 'player') {
            if (amount > playerChips) {
                amount = playerChips; // All-in
            }
            
            playerChips -= amount;
            currentBet += amount;
            updateChips();
        } else {
            dealerChips -= amount;
            dealerBet += amount;
        }
        
        potAmount += amount;
        updateBetDisplay();
        updatePotDisplay();
    }
    
    // Функции действий игрока
    function fold() {
        showGameMessage('Вы сбросили карты. Дилер выиграл банк.');
        
        // Дилер забирает банк
        dealerChips += potAmount;
        potAmount = 0;
        updatePotDisplay();
        
        // Переход к новой раздаче
        setTimeout(() => {
            updateGameStage('init');
        }, 2000);
    }
    
    function check() {
        // Дилер тоже делает чек
        const nextStage = getNextStage();
        showGameMessage(`Вы сделали чек. Дилер тоже делает чек.`);
        
        setTimeout(() => {
            updateGameStage(nextStage);
            
            if (nextStage !== 'showdown') {
                // Дилер делает ставку после чека
                dealerAction();
            }
        }, 1000);
    }
    
    function call() {
        const callAmount = dealerBet - currentBet;
        placeBet(callAmount, 'player');
        
        const nextStage = getNextStage();
        showGameMessage(`Вы уравняли ставку дилера.`);
        
        setTimeout(() => {
            updateGameStage(nextStage);
            
            if (nextStage !== 'showdown') {
                // Дилер делает ставку после колла
                dealerAction();
            }
        }, 1000);
    }
    
    function raise() {
        // Сначала уравниваем ставку дилера
        const callAmount = dealerBet - currentBet;
        if (callAmount > 0) {
            placeBet(callAmount, 'player');
        }
        
        // Затем делаем рейз
        placeBet(currentChipValue, 'player');
        
        showGameMessage(`Вы повысили ставку на ${currentChipValue}.`);
        
        // Дилер отвечает на рейз
        setTimeout(() => {
            dealerAction();
        }, 1000);
    }
    
    // Функция действия дилера
    function dealerAction() {
        // Простая логика дилера: 50% колл, 30% рейз, 20% фолд
        const action = Math.random();
        
        if (action < 0.2 && currentBet > 0) {
            // Фолд
            showGameMessage('Дилер сбросил карты. Вы выиграли банк!');
            
            // Игрок забирает банк
            playerChips += potAmount;
            potAmount = 0;
            updatePotDisplay();
            updateChips();
            
            // Переход к новой раздаче
            setTimeout(() => {
                updateGameStage('init');
            }, 2000);
        } else if (action < 0.5 || currentBet > dealerBet) {
            // Колл
            const callAmount = currentBet - dealerBet;
            if (callAmount > 0) {
                placeBet(callAmount, 'dealer');
                showGameMessage('Дилер уравнял вашу ставку.');
            } else {
                showGameMessage('Дилер делает чек.');
            }
            
            // Переход к следующей стадии
            setTimeout(() => {
                updateGameStage(getNextStage());
            }, 1000);
        } else {
            // Рейз
            const raiseAmount = Math.min(50, Math.floor(Math.random() * 3) * 10 + 10); // 10, 20, 30, 40 или 50
            
            // Сначала уравниваем ставку игрока
            const callAmount = currentBet - dealerBet;
            if (callAmount > 0) {
                placeBet(callAmount, 'dealer');
            }
            
            // Затем делаем рейз
            placeBet(raiseAmount, 'dealer');
            
            showGameMessage(`Дилер повысил ставку на ${raiseAmount}.`);
            updateButtons();
        }
    }
    
    // Функция определения следующей стадии
    function getNextStage() {
        switch (gameStage) {
            case 'preflop': return 'flop';
            case 'flop': return 'turn';
            case 'turn': return 'river';
            case 'river': return 'showdown';
            default: return 'init';
        }
    }
    
    // Функция определения победителя
    function determineWinner() {
        // Все карты для оценки комбинаций
        const playerAllCards = [...playerCards, ...communityCardsData];
        const dealerAllCards = [...dealerCards, ...communityCardsData];
        
        // Оценка комбинаций
        const playerHandRank = evaluateHand(playerAllCards);
        const dealerHandRank = evaluateHand(dealerAllCards);
        
        // Сравнение комбинаций
        if (playerHandRank.rank > dealerHandRank.rank) {
            // Игрок выиграл
            playerWins();
        } else if (playerHandRank.rank < dealerHandRank.rank) {
            // Дилер выиграл
            dealerWins();
        } else {
            // Одинаковые комбинации, сравниваем по старшей карте
            if (playerHandRank.highCard > dealerHandRank.highCard) {
                playerWins();
            } else if (playerHandRank.highCard < dealerHandRank.highCard) {
                dealerWins();
            } else {
                // Ничья
                showGameMessage(`Ничья! Банк делится поровну. У вас и у дилера ${getHandName(playerHandRank.rank)}.`);
                
                // Делим банк
                const halfPot = Math.floor(potAmount / 2);
                playerChips += halfPot;
                dealerChips += potAmount - halfPot;
                potAmount = 0;
                
                updatePotDisplay();
                updateChips();
                
                // Переход к новой раздаче
                setTimeout(() => {
                    updateGameStage('init');
                }, 3000);
            }
        }
    }
    
    // Функция победы игрока
    function playerWins() {
        const playerHandRank = evaluateHand([...playerCards, ...communityCardsData]);
        showGameMessage(`Вы выиграли банк! У вас ${getHandName(playerHandRank.rank)}.`, 'win');
        
        // Игрок забирает банк
        playerChips += potAmount;
        potAmount = 0;
        
        updatePotDisplay();
        updateChips();
        
        // Подсветка карт игрока
        playerCard1.classList.add('card-highlight');
        playerCard2.classList.add('card-highlight');
        
        // Переход к новой раздаче
        setTimeout(() => {
            playerCard1.classList.remove('card-highlight');
            playerCard2.classList.remove('card-highlight');
            updateGameStage('init');
        }, 3000);
    }
    
    // Функция победы дилера
    function dealerWins() {
        const dealerHandRank = evaluateHand([...dealerCards, ...communityCardsData]);
        showGameMessage(`Дилер выиграл банк. У дилера ${getHandName(dealerHandRank.rank)}.`, 'lose');
        
        // Дилер забирает банк
        dealerChips += potAmount;
        potAmount = 0;
        
        updatePotDisplay();
        
        // Подсветка карт дилера
        dealerCard1.classList.add('card-highlight');
        dealerCard2.classList.add('card-highlight');
        
        // Переход к новой раздаче
        setTimeout(() => {
            dealerCard1.classList.remove('card-highlight');
            dealerCard2.classList.remove('card-highlight');
            updateGameStage('init');
        }, 3000);
    }
    
    // Функция оценки комбинации
    function evaluateHand(cards) {
        // Сортировка карт по номиналу (от большего к меньшему)
        cards.sort((a, b) => b.numericValue - a.numericValue);
        
        // Проверка на роял-флеш
        if (hasRoyalFlush(cards)) {
            return { rank: 9, highCard: 14 }; // Туз имеет значение 14
        }
        
        // Проверка на стрит-флеш
        const straightFlush = hasStraightFlush(cards);
        if (straightFlush) {
            return { rank: 8, highCard: straightFlush };
        }
        
        // Проверка на каре
        const fourOfAKind = hasFourOfAKind(cards);
        if (fourOfAKind) {
            return { rank: 7, highCard: fourOfAKind };
        }
        
        // Проверка на фулл-хаус
        const fullHouse = hasFullHouse(cards);
        if (fullHouse) {
            return { rank: 6, highCard: fullHouse };
        }
        
        // Проверка на флеш
        const flush = hasFlush(cards);
        if (flush) {
            return { rank: 5, highCard: flush };
        }
        
        // Проверка на стрит
        const straight = hasStraight(cards);
        if (straight) {
            return { rank: 4, highCard: straight };
        }
        
        // Проверка на тройку
        const threeOfAKind = hasThreeOfAKind(cards);
        if (threeOfAKind) {
            return { rank: 3, highCard: threeOfAKind };
        }
        
        // Проверка на две пары
        const twoPair = hasTwoPair(cards);
        if (twoPair) {
            return { rank: 2, highCard: twoPair };
        }
        
        // Проверка на пару
        const pair = hasPair(cards);
        if (pair) {
            return { rank: 1, highCard: pair };
        }
        
        // Старшая карта
        return { rank: 0, highCard: cards[0].numericValue };
    }
    
    // Вспомогательные функции для оценки комбинаций
    function hasRoyalFlush(cards) {
        // Проверяем наличие 10, J, Q, K, A одной масти
        const suits = ['♥', '♦', '♣', '♠'];
        
        for (let suit of suits) {
            const suitCards = cards.filter(card => card.suit === suit);
            
            if (suitCards.length >= 5) {
                const values = [10, 11, 12, 13, 14]; // 10, J, Q, K, A
                const hasAllValues = values.every(value => 
                    suitCards.some(card => card.numericValue === value)
                );
                
                if (hasAllValues) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    function hasStraightFlush(cards) {
        const suits = ['♥', '♦', '♣', '♠'];
        
        for (let suit of suits) {
            const suitCards = cards.filter(card => card.suit === suit);
            
            if (suitCards.length >= 5) {
                const straightHighCard = hasStraight(suitCards);
                if (straightHighCard) {
                    return straightHighCard;
                }
            }
        }
        
        return false;
    }
    
    function hasFourOfAKind(cards) {
        // Группируем карты по номиналу
        const valueGroups = {};
        
        for (let card of cards) {
            if (!valueGroups[card.numericValue]) {
                valueGroups[card.numericValue] = [];
            }
            valueGroups[card.numericValue].push(card);
        }
        
        // Ищем группу из 4 карт
        for (let value in valueGroups) {
            if (valueGroups[value].length >= 4) {
                return parseInt(value);
            }
        }
        
        return false;
    }
    
    function hasFullHouse(cards) {
        // Группируем карты по номиналу
        const valueGroups = {};
        
        for (let card of cards) {
            if (!valueGroups[card.numericValue]) {
                valueGroups[card.numericValue] = [];
            }
            valueGroups[card.numericValue].push(card);
        }
        
        let hasThree = false;
        let hasPair = false;
        let threeValue = 0;
        
        // Ищем тройку и пару
        for (let value in valueGroups) {
            if (valueGroups[value].length >= 3) {
                hasThree = true;
                threeValue = Math.max(threeValue, parseInt(value));
            } else if (valueGroups[value].length >= 2) {
                hasPair = true;
            }
        }
        
        return (hasThree && hasPair) ? threeValue : false;
    }
    
    function hasFlush(cards) {
        const suits = ['♥', '♦', '♣', '♠'];
        
        for (let suit of suits) {
            const suitCards = cards.filter(card => card.suit === suit);
            
            if (suitCards.length >= 5) {
                return suitCards[0].numericValue; // Возвращаем старшую карту флеша
            }
        }
        
        return false;
    }
    
    function hasStraight(cards) {
        // Удаляем дубликаты по номиналу
        const uniqueValues = [];
        const seen = {};
        
        for (let card of cards) {
            if (!seen[card.numericValue]) {
                seen[card.numericValue] = true;
                uniqueValues.push(card.numericValue);
            }
        }
        
        // Сортируем по убыванию
        uniqueValues.sort((a, b) => b - a);
        
        // Проверяем наличие 5 последовательных карт
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
                return uniqueValues[i]; // Возвращаем старшую карту стрита
            }
        }
        
        // Проверка на стрит A-5
        if (uniqueValues.includes(14) && // Туз
            uniqueValues.includes(2) &&
            uniqueValues.includes(3) &&
            uniqueValues.includes(4) &&
            uniqueValues.includes(5)) {
            return 5; // Старшая карта - 5
        }
        
        return false;
    }
    
    function hasThreeOfAKind(cards) {
        // Группируем карты по номиналу
        const valueGroups = {};
        
        for (let card of cards) {
            if (!valueGroups[card.numericValue]) {
                valueGroups[card.numericValue] = [];
            }
            valueGroups[card.numericValue].push(card);
        }
        
        // Ищем группу из 3 карт
        for (let value in valueGroups) {
            if (valueGroups[value].length >= 3) {
                return parseInt(value);
            }
        }
        
        return false;
    }
    
    function hasTwoPair(cards) {
        // Группируем карты по номиналу
        const valueGroups = {};
        const pairs = [];
        
        for (let card of cards) {
            if (!valueGroups[card.numericValue]) {
                valueGroups[card.numericValue] = [];
            }
            valueGroups[card.numericValue].push(card);
        }
        
        // Ищем пары
        for (let value in valueGroups) {
            if (valueGroups[value].length >= 2) {
                pairs.push(parseInt(value));
            }
        }
        
        // Если есть хотя бы две пары
        if (pairs.length >= 2) {
            pairs.sort((a, b) => b - a);
            return pairs[0]; // Возвращаем старшую пару
        }
        
        return false;
    }
    
    function hasPair(cards) {
        // Группируем карты по номиналу
        const valueGroups = {};
        
        for (let card of cards) {
            if (!valueGroups[card.numericValue]) {
                valueGroups[card.numericValue] = [];
            }
            valueGroups[card.numericValue].push(card);
        }
        
        // Ищем пару
        for (let value in valueGroups) {
            if (valueGroups[value].length >= 2) {
                return parseInt(value);
            }
        }
        
        return false;
    }
    
    // Функция получения числового значения карты
    function getNumericValue(value) {
        switch (value) {
            case 'J': return 11;
            case 'Q': return 12;
            case 'K': return 13;
            case 'A': return 14;
            default: return parseInt(value);
        }
    }
    
    // Функция получения названия комбинации
    function getHandName(rank) {
        switch (rank) {
            case 9: return 'Роял-флеш';
            case 8: return 'Стрит-флеш';
            case 7: return 'Каре';
            case 6: return 'Фулл-хаус';
            case 5: return 'Флеш';
            case 4: return 'Стрит';
            case 3: return 'Тройка';
            case 2: return 'Две пары';
            case 1: return 'Пара';
            case 0: return 'Старшая карта';
            default: return 'Неизвестная комбинация';
        }
    }
    
    // Функция обновления отображения фишек
    function updateChips() {
        playerChipsElement.textContent = playerChips;
    }
    
    // Функция обновления отображения ставки
    function updateBetDisplay() {
        betAmountElement.textContent = currentBet;
    }
    
    // Функция обновления отображения банка
    function updatePotDisplay() {
        potAmountElement.textContent = potAmount;
    }
    
    // Функция отображения сообщения
    function showGameMessage(message, type = '') {
        gameMessageElement.textContent = message;
        gameMessageElement.className = 'game-message';
        
        if (type === 'win') {
            gameMessageElement.classList.add('win-message');
        } else if (type === 'lose') {
            gameMessageElement.classList.add('lose-message');
        }
    }
});