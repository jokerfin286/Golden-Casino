document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const wheelElement = document.getElementById('rouletteWheel');
    const wheelNumbersElement = document.getElementById('wheelNumbers');
    const ballElement = document.getElementById('ball');
    const bettingGridElement = document.getElementById('bettingGrid');
    const chipButtons = document.querySelectorAll('.chip-btn');
    const spinButton = document.getElementById('spinRoulette');
    const clearButton = document.getElementById('clearBets');
    const betAmountElement = document.getElementById('rouletteBetAmount');
    const lastNumbersElement = document.getElementById('lastNumbers');
    const winMessageElement = document.getElementById('rouletteWinMessage');
    const wheelContainer = document.querySelector('.roulette-wheel-container');
    
    // Настройки игры
    let currentChipValue = 10;
    let placedBets = [];
    let totalBetAmount = 0;
    let isSpinning = false;
    let lastNumbers = [];
    
    // Номера и цвета рулетки (европейская рулетка)
    const rouletteNumbers = [
        { number: 0, color: 'green' },
        { number: 32, color: 'red' },
        { number: 15, color: 'black' },
        { number: 19, color: 'red' },
        { number: 4, color: 'black' },
        { number: 21, color: 'red' },
        { number: 2, color: 'black' },
        { number: 25, color: 'red' },
        { number: 17, color: 'black' },
        { number: 34, color: 'red' },
        { number: 6, color: 'black' },
        { number: 27, color: 'red' },
        { number: 13, color: 'black' },
        { number: 36, color: 'red' },
        { number: 11, color: 'black' },
        { number: 30, color: 'red' },
        { number: 8, color: 'black' },
        { number: 23, color: 'red' },
        { number: 10, color: 'black' },
        { number: 5, color: 'red' },
        { number: 24, color: 'black' },
        { number: 16, color: 'red' },
        { number: 33, color: 'black' },
        { number: 1, color: 'red' },
        { number: 20, color: 'black' },
        { number: 14, color: 'red' },
        { number: 31, color: 'black' },
        { number: 9, color: 'red' },
        { number: 22, color: 'black' },
        { number: 18, color: 'red' },
        { number: 29, color: 'black' },
        { number: 7, color: 'red' },
        { number: 28, color: 'black' },
        { number: 12, color: 'red' },
        { number: 35, color: 'black' },
        { number: 3, color: 'red' },
        { number: 26, color: 'black' }
    ];
    
    // Инициализация рулетки
    initRouletteWheel();
    updateLastNumbers();
    
    // Добавление 3D эффекта при наведении на колесо
    wheelContainer.addEventListener('mousemove', function(e) {
        if (isSpinning) return;
        
        const rect = wheelContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const angleX = (mouseY - centerY) / 20;
        const angleY = (centerX - mouseX) / 20;
        
        wheelElement.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    wheelContainer.addEventListener('mouseleave', function() {
        if (isSpinning) return;
        wheelElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
    
    // Обработчики событий
    spinButton.addEventListener('click', function() {
        if (isSpinning || placedBets.length === 0) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            spinWheel();
        }, 300);
    });
    
    clearButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            clearAllBets();
        }, 300);
    });
    
    // Обработчики для кнопок фишек
    chipButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (isSpinning) return;
            
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
            
            // Звуковой эффект выбора фишки
            playChipSound();
        });
    });
    
    // Обработчики для ставок на числа и опции с улучшенной обратной связью
    document.querySelectorAll('.number-cell, .zero, .bet-option').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (isSpinning) return;
            this.classList.add('hover-effect');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
        
        element.addEventListener('click', function() {
            if (isSpinning) return;
            
            // Анимация нажатия
            this.classList.add('pulse-animation');
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 300);
            
            const betType = this.hasAttribute('data-number') ? 'number' : 'option';
            const betValue = this.hasAttribute('data-number') ? 
                parseInt(this.getAttribute('data-number')) : 
                this.getAttribute('data-bet');
            
            placeBet(betType, betValue, this);
        });
    });
    
    // В функции initRouletteWheel() обновите позиционирование номеров:
    function initRouletteWheel() {
        wheelNumbersElement.innerHTML = '';
        
        // Удалите старые разделители, если они есть
        const oldDividers = wheelElement.querySelectorAll('.wheel-divider');
        oldDividers.forEach(divider => divider.remove());
        
        // Добавление номеров на колесо с правильным позиционированием
        rouletteNumbers.forEach((item, index) => {
            const numberElement = document.createElement('div');
            numberElement.className = `number number-${item.number} ${item.color}`;
            numberElement.textContent = item.number;
            numberElement.style.width = '40px';
            numberElement.style.height = '40px';
            
            // Расчет позиции на колесе
            const angle = (index * (360 / rouletteNumbers.length)) - 90; // -90 чтобы начать сверху
            const radius = 120;
            
            // Позиционируем номера по окружности
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            
            numberElement.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px) rotate(${angle + 90}deg)`;
            numberElement.style.position = 'absolute';
            numberElement.style.top = '50%';
            numberElement.style.left = '50%';
            
            wheelNumbersElement.appendChild(numberElement);
        });
        
        // Добавьте этот CSS для лучшего отображения шарика:
        const style = document.createElement('style');
        style.textContent = `
            .ball {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                background: radial-gradient(circle at 30% 30%, white, #d4af37);
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 10;
                will-change: transform;
            }
            
            .wheel-outer {
                will-change: transform;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Функция размещения ставки с улучшенной анимацией
    function placeBet(type, value, element) {
        // Проверка баланса
        const currentBalance = window.getBalance ? window.getBalance() : parseFloat(document.querySelector('.balance-amount').textContent);
        if (currentBalance < currentChipValue) {
            showWinMessage('Недостаточно средств!', false);
            
            // Анимация отказа
            element.classList.add('shake-animation');
            setTimeout(() => {
                element.classList.remove('shake-animation');
            }, 500);
            
            return;
        }
        
        // Списание ставки
        if (window.updateBalance) {
            window.updateBalance(-currentChipValue);
        } else {
            const balanceElement = document.querySelector('.balance-amount');
            balanceElement.textContent = (parseFloat(balanceElement.textContent) - currentChipValue).toFixed(1);
        }
        
        totalBetAmount += currentChipValue;
        updateBetDisplay();
        
        // Добавление ставки в список
        placedBets.push({ type, value, amount: currentChipValue });
        
        // Отображение фишки на столе с анимацией
        const rect = element.getBoundingClientRect();
        const tableRect = bettingGridElement.getBoundingClientRect();
        
        // Создаем фишку сначала у кнопки выбора фишки
        const activeChipBtn = document.querySelector('.chip-btn.active');
        const chipBtnRect = activeChipBtn.getBoundingClientRect();
        
        const chip = document.createElement('div');
        chip.className = 'placed-bet';
        chip.textContent = currentChipValue;
        
        // Начальная позиция - у кнопки выбора фишки
        chip.style.left = `${chipBtnRect.left - tableRect.left + chipBtnRect.width / 2 - 15}px`;
        chip.style.top = `${chipBtnRect.top - tableRect.top + chipBtnRect.height / 2 - 15}px`;
        chip.style.transform = 'scale(0.5)';
        chip.style.opacity = '0.5';
        
        bettingGridElement.appendChild(chip);
        
        // Анимация перемещения фишки
        setTimeout(() => {
            chip.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            chip.style.left = `${rect.left - tableRect.left + rect.width / 2 - 15}px`;
            chip.style.top = `${rect.top - tableRect.top + rect.height / 2 - 15}px`;
            chip.style.transform = 'scale(1)';
            chip.style.opacity = '1';
            
            // Звуковой эффект размещения фишки
            playChipPlaceSound();
        }, 10);
        
        // Подсветка ячейки, на которую сделана ставка
        element.classList.add('bet-placed');
        setTimeout(() => {
            element.classList.remove('bet-placed');
        }, 1000);
    }
    
    // В функции spinWheel() замените текущую реализацию на эту:
function spinWheel() {
    if (isSpinning || placedBets.length === 0) return;
    
    isSpinning = true;
    spinButton.disabled = true;
    clearButton.disabled = true;
    
    winMessageElement.classList.remove('show');
    winMessageElement.textContent = '';
    
    playRouletteSpinSound();
    
    const resultIndex = Math.floor(Math.random() * rouletteNumbers.length);
    const result = rouletteNumbers[resultIndex];
    
    // Рассчитываем угол для выбранного номера
    const singleSectorAngle = 360 / rouletteNumbers.length;
    const resultAngle = 360 - (resultIndex * singleSectorAngle);
    
    // Количество полных оборотов (3-5 для хорошего эффекта)
    const rotations = 5;
    const totalRotation = rotations * 360 + resultAngle;
    
    const wheelOuter = wheelElement.querySelector('.wheel-outer');
    const ballElement = document.getElementById('ball');
    
    // Сбрасываем позиции перед началом анимации
    wheelOuter.style.transition = 'none';
    wheelOuter.style.transform = 'rotate(0deg)';
    ballElement.style.transition = 'none';
    ballElement.style.transform = 'translate(0, 0)';
    
    // Принудительный рефлоу для сброса анимации
    wheelOuter.offsetHeight;
    ballElement.offsetHeight;
    
    // Настраиваем анимацию колеса
    wheelOuter.style.transition = `transform 8s cubic-bezier(0.15, 0.5, 0.25, 1)`;
    wheelOuter.style.transform = `rotate(${totalRotation}deg)`;
    
    // Анимация шарика с задержкой
    setTimeout(() => {
        ballElement.style.transition = 'all 8s cubic-bezier(0.15, 0.5, 0.25, 1)';
        
        // Рассчитываем позицию шарика с учетом центра колеса
        const ballRadius = 120;
        const ballStartAngle = -90; // начинаем сверху
        const ballEndAngle = resultAngle + ballStartAngle;
        
        // Начальная позиция (верх колеса)
        const startX = ballRadius * Math.cos(ballStartAngle * Math.PI / 180);
        const startY = ballRadius * Math.sin(ballStartAngle * Math.PI / 180);
        ballElement.style.transform = `translate(${startX}px, ${startY}px)`;
        
        // Принудительный рефлоу
        ballElement.offsetHeight;
        
        // Конечная позиция
        const endX = ballRadius * Math.cos(ballEndAngle * Math.PI / 180);
        const endY = ballRadius * Math.sin(ballEndAngle * Math.PI / 180);
        ballElement.style.transform = `translate(${endX}px, ${endY}px)`;
        
        // Добавляем эффект "прыгающего" шарика в конце
        setTimeout(() => {
            ballElement.style.transition = 'transform 0.3s ease-out';
            
            // Небольшое смещение для эффекта отскока
            const bounceX = endX * 1.05;
            const bounceY = endY * 1.05;
            ballElement.style.transform = `translate(${bounceX}px, ${bounceY}px)`;
            
            setTimeout(() => {
                ballElement.style.transform = `translate(${endX}px, ${endY}px)`;
            }, 300);
        }, 7500); // За 0.5с до остановки колеса
    }, 500); // Небольшая задержка перед началом движения шарика
    
    // Проверка результатов после остановки колеса
    setTimeout(() => {
        playBallStopSound();
        
        // Подсветка выигрышного номера
        const winningNumber = wheelNumbersElement.querySelector(`.number-${result.number}`);
        if (winningNumber) {
            winningNumber.classList.add('winning-number');
            setTimeout(() => {
                winningNumber.classList.remove('winning-number');
            }, 3000);
        }
        
        // Добавление результата в историю
        addToHistory(result);
        
        // Проверка выигрышей
        checkWinnings(result);
        
        // Сброс ставок
        clearAllBets(false);
        
        isSpinning = false;
        spinButton.disabled = false;
        clearButton.disabled = false;
    }, 8500); // Уменьшил время анимации на 0.5с для лучшего восприятия
}
    // Добавьте эту вспомогательную функцию для добавления в историю
function addToHistory(result) {
    const historyItem = document.createElement('span');
    historyItem.className = `last-number ${result.color}`;
    historyItem.textContent = result.number;
    historyItem.style.transform = 'scale(0)';
    
    lastNumbersElement.insertBefore(historyItem, lastNumbersElement.firstChild);
    
    setTimeout(() => {
        historyItem.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        historyItem.style.transform = 'scale(1)';
    }, 10);
    
    // Обновление истории
    lastNumbers.unshift(result);
    if (lastNumbers.length > 5) {
        if (lastNumbersElement.children.length > 5) {
            const lastChild = lastNumbersElement.lastChild;
            lastChild.style.transition = 'transform 0.5s, opacity 0.5s';
            lastChild.style.transform = 'scale(0)';
            lastChild.style.opacity = '0';
            
            setTimeout(() => {
                lastNumbersElement.removeChild(lastChild);
            }, 500);
        }
        lastNumbers.pop();
    }
}
    // Функция проверки выигрышей с улучшенной анимацией
    function checkWinnings(result) {
        let totalWin = 0;
        let winningBets = [];
        
        placedBets.forEach(bet => {
            let win = 0;
            
            if (bet.type === 'number' && bet.value === result.number) {
                // Прямая ставка (35:1)
                win = bet.amount * 36;
                winningBets.push({ type: 'number', value: bet.value, win: win });
            } else if (bet.type === 'option') {
                // Проверка различных типов ставок
                let isWin = false;
                
                switch (bet.value) {
                    case 'red':
                        if (result.color === 'red') { win = bet.amount * 2; isWin = true; }
                        break;
                    case 'black':
                        if (result.color === 'black') { win = bet.amount * 2; isWin = true; }
                        break;
                    case 'even':
                        if (result.number !== 0 && result.number % 2 === 0) { win = bet.amount * 2; isWin = true; }
                        break;
                    case 'odd':
                        if (result.number !== 0 && result.number % 2 !== 0) { win = bet.amount * 2; isWin = true; }
                        break;
                    case 'low':
                        if (result.number >= 1 && result.number <= 18) { win = bet.amount * 2; isWin = true; }
                        break;
                    case 'high':
                        if (result.number >= 19 && result.number <= 36) { win = bet.amount * 2; isWin = true; }
                        break;
                    case 'first12':
                        if (result.number >= 1 && result.number <= 12) { win = bet.amount * 3; isWin = true; }
                        break;
                    case 'second12':
                        if (result.number >= 13 && result.number <= 24) { win = bet.amount * 3; isWin = true; }
                        break;
                    case 'third12':
                        if (result.number >= 25 && result.number <= 36) { win = bet.amount * 3; isWin = true; }
                        break;
                }
                
                if (isWin) {
                    winningBets.push({ type: 'option', value: bet.value, win: win });
                }
            }
            
            totalWin += win;
        });
        
        // Подсветка выигрышных ставок
        if (winningBets.length > 0) {
            winningBets.forEach(bet => {
                let selector;
                
                if (bet.type === 'number') {
                    selector = `.number-cell[data-number="${bet.value}"], .zero[data-number="${bet.value}"]`;
                } else {
                    selector = `.bet-option[data-bet="${bet.value}"]`;
                }
                
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.classList.add('winning-bet');
                    
                    // Создаем анимацию выигрыша
                    const winAmount = document.createElement('div');
                    winAmount.className = 'win-amount';
                    winAmount.textContent = `+${bet.win}`;
                    element.appendChild(winAmount);
                    
                    setTimeout(() => {
                        winAmount.style.opacity = '1';
                        winAmount.style.transform = 'translateY(-20px)';
                    }, 10);
                    
                    setTimeout(() => {
                        element.classList.remove('winning-bet');
                        winAmount.style.opacity = '0';
                        setTimeout(() => {
                            if (element.contains(winAmount)) {
                                element.removeChild(winAmount);
                            }
                        }, 500);
                    }, 3000);
                });
            });
        }
        
        // Обновление баланса и отображение сообщения
        if (totalWin > 0) {
            // Задержка для драматического эффекта
            setTimeout(() => {
                if (window.updateBalance) {
                    window.updateBalance(totalWin);
                } else {
                    const balanceElement = document.querySelector('.balance-amount');
                    balanceElement.textContent = (parseFloat(balanceElement.textContent) + totalWin).toFixed(1);
                }
                
                showWinMessage(`Выигрыш! +${totalWin}`, true);
                
                // Звук выигрыша
                playWinSound(totalWin);
                
                // Анимация монет при крупном выигрыше
                if (totalWin >= 100) {
                    createCoinAnimation();
                }
            }, 1000);
        } else {
            showWinMessage(`Выпало: ${result.number} ${result.color === 'red' ? 'красное' : result.color === 'black' ? 'черное' : 'зеро'}. Нет выигрыша.`, false);
            
            // Звук проигрыша
            playLoseSound();
        }
    }
    
    // Функция очистки всех ставок с анимацией
    function clearAllBets(returnMoney = true) {
        // Возврат денег, если это не после вращения
        if (returnMoney && totalBetAmount > 0) {
            if (window.updateBalance) {
                window.updateBalance(totalBetAmount);
            } else {
                const balanceElement = document.querySelector('.balance-amount');
                balanceElement.textContent = (parseFloat(balanceElement.textContent) + totalBetAmount).toFixed(1);
            }
            
            // Звук возврата фишек
            playChipsReturnSound();
        }
        
        // Очистка ставок
        placedBets = [];
        totalBetAmount = 0;
        updateBetDisplay();
        
        // Удаление фишек со стола с анимацией
        const chips = bettingGridElement.querySelectorAll('.placed-bet');
        chips.forEach((chip, index) => {
            // Анимация исчезновения с задержкой для каждой фишки
            setTimeout(() => {
                chip.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                chip.style.transform = 'scale(0)';
                chip.style.opacity = '0';
                
                setTimeout(() => {
                    chip.remove();
                }, 500);
            }, index * 50); // Небольшая задержка для каждой следующей фишки
        });
    }
    
    // Функция обновления отображения ставки с анимацией
    function updateBetDisplay() {
        const oldValue = parseInt(betAmountElement.textContent);
        const newValue = totalBetAmount;
        
        if (oldValue !== newValue) {
            betAmountElement.classList.add('update-animation');
            
            setTimeout(() => {
                betAmountElement.textContent = newValue;
                
                setTimeout(() => {
                    betAmountElement.classList.remove('update-animation');
                }, 300);
            }, 300);
        } else {
            betAmountElement.textContent = newValue;
        }
    }
    
    // Функция обновления истории последних чисел
    function updateLastNumbers() {
        lastNumbersElement.innerHTML = '';
        
        lastNumbers.forEach(item => {
            const numberElement = document.createElement('span');
            numberElement.className = `last-number ${item.color}`;
            numberElement.textContent = item.number;
            lastNumbersElement.appendChild(numberElement);
        });
    }
    
    // Отображение сообщения о выигрыше с улучшенной анимацией
    function showWinMessage(message, isWin) {
        winMessageElement.textContent = message;
        winMessageElement.classList.add('show');
        
        if (isWin) {
            winMessageElement.style.color = '#ffd700';
            winMessageElement.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
            
            // Добавляем анимацию для выигрыша
            winMessageElement.classList.add('win-animation');
            setTimeout(() => {
                winMessageElement.classList.remove('win-animation');
            }, 3000);
        } else {
            winMessageElement.style.color = '#cccccc';
            winMessageElement.style.textShadow = 'none';
        }
    }
    
    // Функция создания анимации падающих монет
    function createCoinAnimation() {
        const container = document.querySelector('.roulette-game');
        const coinCount = 30;
        
        for (let i = 0; i < coinCount; i++) {
            const coin = document.createElement('div');
            coin.className = 'falling-coin';
            coin.innerHTML = '🪙';
            coin.style.left = `${Math.random() * 100}%`;
            coin.style.animationDuration = `${1 + Math.random() * 2}s`;
            coin.style.animationDelay = `${Math.random() * 0.5}s`;
            coin.style.fontSize = `${Math.random() * 20 + 20}px`;
            
            container.appendChild(coin);
            
            // Удаление монеты после завершения анимации
            setTimeout(() => {
                coin.remove();
            }, 3000);
        }
    }
    
    // Функция для получения баланса (если функция window.getBalance не определена)
    window.getBalance = window.getBalance || function() {
        return parseFloat(document.querySelector('.balance-amount').textContent);
    };
    
    // Функция для обновления баланса (если функция window.updateBalance не определена)
    window.updateBalance = window.updateBalance || function(amount) {
        const balanceElement = document.querySelector('.balance-amount');
        const currentBalance = parseFloat(balanceElement.textContent);
        balanceElement.textContent = (currentBalance + amount).toFixed(1);
        
        // Анимация изменения баланса
        balanceElement.classList.add('update-animation');
        setTimeout(() => {
            balanceElement.classList.remove('update-animation');
        }, 600);
        
        return currentBalance + amount;
    };
    
    // Звуковые эффекты (заглушки, так как звуки не подключены)
    function playChipSound() {
        console.log('Playing chip selection sound');
    }
    
    function playChipPlaceSound() {
        console.log('Playing chip placement sound');
    }
    
    function playRouletteSpinSound() {
        console.log('Playing roulette spin sound');
    }
    
    function playRouletteSlowSound() {
        console.log('Playing roulette slowing sound');
    }
    
    function playBallStopSound() {
        console.log('Playing ball stop sound');
    }
    
    function playWinSound(amount) {
        if (amount >= 500) {
            console.log('Playing big win sound');
        } else {
            console.log('Playing win sound');
        }
    }
    
    function playLoseSound() {
        console.log('Playing lose sound');
    }
    
    function playChipsReturnSound() {
        console.log('Playing chips return sound');
    }
});