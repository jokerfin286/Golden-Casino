document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    const spinButton = document.getElementById('spinButton');
    const lever = document.getElementById('lever');
    const betAmountElement = document.getElementById('betAmount');
    const increaseBetButton = document.getElementById('increaseBet');
    const decreaseBetButton = document.getElementById('decreaseBet');
    const maxBetButton = document.getElementById('maxBet');
    const winMessageElement = document.getElementById('winMessage');
    
    // Настройки игры
    let betAmount = 10;
    let isSpinning = false;
    const maxBet = 100;
    const minBet = 1;
    
    // Символы и их значения
    const symbols = ['7️⃣', '🍒', '🍋', '🍇', '🔔'];
    const payouts = {
        '7️⃣': 100,
        '🍒': 50,
        '🍋': 25,
        '🍇': 15,
        '🔔': 10
    };
    
    // Инициализация барабанов
    initReels();
    
    // Обработчики событий
    spinButton.addEventListener('click', startSpin);
    lever.addEventListener('click', function() {
        lever.classList.add('pulled');
        startSpin();
        setTimeout(() => {
            lever.classList.remove('pulled');
        }, 1000);
    });
    increaseBetButton.addEventListener('click', increaseBet);
    decreaseBetButton.addEventListener('click', decreaseBet);
    maxBetButton.addEventListener('click', setMaxBet);
    
    // Функция инициализации барабанов
    function initReels() {
        reels.forEach(reel => {
            // Очистка барабана
            reel.innerHTML = '';
            
            // Добавление случайных символов
            for (let i = 0; i < 5; i++) {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'slot-symbol';
                symbolDiv.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                reel.appendChild(symbolDiv);
            }
        });
    }
    
    // Функция запуска вращения
    function startSpin() {
        if (isSpinning) return;
        
        // Проверка баланса
        const currentBalance = window.getBalance();
        if (currentBalance < betAmount) {
            showWinMessage('Недостаточно средств!', false);
            return;
        }
        
        // Списание ставки
        window.updateBalance(-betAmount);
        
        isSpinning = true;
        spinButton.disabled = true;
        increaseBetButton.disabled = true;
        decreaseBetButton.disabled = true;
        maxBetButton.disabled = true;
        
        // Анимация рычага
        lever.querySelector('.lever-handle').style.transform = 'rotate(30deg)';
        
        // Скрытие предыдущего сообщения о выигрыше
        winMessageElement.classList.remove('show');
        winMessageElement.textContent = '';
        
        // Анимация вращения барабанов
        const spinDurations = [1500, 2000, 2500]; // Разное время для каждого барабана
        const results = [];
        
        reels.forEach((reel, index) => {
            // Добавляем класс для анимации
            reel.classList.add('spinning');
            
            // Создаем новый набор символов для вращения
            const spinSymbols = [];
            for (let i = 0; i < 20; i++) {
                spinSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }
            
            // Добавляем результат (последние 3 символа будут видны)
            const result = symbols[Math.floor(Math.random() * symbols.length)];
            results.push(result);
            spinSymbols.push(result);
            
            // Анимация вращения
            animateReel(reel, spinSymbols, spinDurations[index], index === 2);
            
            // Звуковой эффект вращения
            playSpinSound();
        });
        
        // Проверка результатов после остановки всех барабанов
        setTimeout(() => {
            checkResults(results);
            isSpinning = false;
            spinButton.disabled = false;
            increaseBetButton.disabled = false;
            decreaseBetButton.disabled = false;
            maxBetButton.disabled = false;
            lever.querySelector('.lever-handle').style.transform = '';
            
            // Удаляем класс анимации
            reels.forEach(reel => {
                reel.classList.remove('spinning');
            });
        }, spinDurations[2] + 500);
    }
    
    // Анимация вращения барабана
    function animateReel(reel, symbols, duration, isLastReel) {
        // Очистка барабана
        reel.innerHTML = '';
        
        // Добавление символов для анимации
        symbols.forEach(symbol => {
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'slot-symbol';
            symbolDiv.textContent = symbol;
            reel.appendChild(symbolDiv);
        });
        
        // Анимация прокрутки
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            reel.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.5, 0.5, 1)`;
            reel.style.transform = `translateY(calc(-100% + 150px))`;
        }, 50);
        
        // Звуковой эффект остановки барабана
        setTimeout(() => {
            playStopSound();
            
            // Добавляем эффект тряски при остановке
            reel.style.animation = 'shake 0.3s';
            setTimeout(() => {
                reel.style.animation = '';
            }, 300);
        }, duration);
    }
    
    // Проверка результатов
    function checkResults(results) {
        // Проверка на выигрыш (все символы одинаковые)
        if (results[0] === results[1] && results[1] === results[2]) {
            const winAmount = betAmount * payouts[results[0]];
            window.updateBalance(winAmount);
            showWinMessage(`Выигрыш! +${winAmount}`, true);
            
            // Подсветка выигрышных символов
            highlightWinningSymbols();
            
            // Звук выигрыша
            playWinSound(winAmount);
        } else {
            showWinMessage('Попробуйте еще раз!', false);
            playLoseSound();
        }
    }
    
    // Подсветка выигрышных символов
    function highlightWinningSymbols() {
        reels.forEach(reel => {
            const visibleSymbol = reel.querySelector('.slot-symbol');
            if (visibleSymbol) {
                visibleSymbol.classList.add('highlight');
                
                // Анимация пульсации
                visibleSymbol.style.animation = 'jackpot 0.5s ease infinite';
                
                // Удаление анимации через 3 секунды
                setTimeout(() => {
                    visibleSymbol.classList.remove('highlight');
                    visibleSymbol.style.animation = '';
                }, 3000);
            }
        });
    }
    
    // Отображение сообщения о выигрыше
    function showWinMessage(message, isWin) {
        winMessageElement.textContent = message;
        winMessageElement.classList.add('show');
        
        if (isWin) {
            winMessageElement.style.color = 'var(--win-color)';
            winMessageElement.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
        } else {
            winMessageElement.style.color = 'var(--light-text)';
            winMessageElement.style.textShadow = 'none';
        }
    }
    
    // Функции управления ставкой
    function increaseBet() {
        if (betAmount < maxBet) {
            betAmount += 5;
            updateBetDisplay();
            playButtonSound();
        }
    }
    
    function decreaseBet() {
        if (betAmount > minBet) {
            betAmount -= 5;
            updateBetDisplay();
            playButtonSound();
        }
    }
    
    function setMaxBet() {
        betAmount = maxBet;
        updateBetDisplay();
        playButtonSound();
    }
    
    function updateBetDisplay() {
        betAmountElement.textContent = betAmount;
        betAmountElement.classList.add('fade-in');
        setTimeout(() => {
            betAmountElement.classList.remove('fade-in');
        }, 500);
    }
    
    // Звуковые эффекты (заглушки, так как звуки не подключены)
    function playSpinSound() {
        // Звук вращения барабанов
        console.log('Playing spin sound');
    }
    
    function playStopSound() {
        // Звук остановки барабана
        console.log('Playing stop sound');
    }
    
    function playWinSound(amount) {
        // Звук выигрыша (разный в зависимости от суммы)
        if (amount >= 500) {
            console.log('Playing big win sound');
        } else {
            console.log('Playing win sound');
        }
    }
    
    function playLoseSound() {
        // Звук проигрыша
        console.log('Playing lose sound');
    }
    
    function playButtonSound() {
        // Звук нажатия кнопки
        console.log('Playing button sound');
    }
});