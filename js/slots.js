document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const slotGrid = document.getElementById('slotGrid');
    const slotScreen = document.getElementById('slotScreen');
    const spinButton = document.getElementById('spinSlots');
    const betAmountElement = document.getElementById('slotsBetAmount');
    const linesAmountElement = document.getElementById('linesAmount');
    const decreaseBetButton = document.getElementById('decreaseSlotsBet');
    const increaseBetButton = document.getElementById('increaseSlotsBet');
    const decreaseLinesButton = document.getElementById('decreaseLines');
    const increaseLinesButton = document.getElementById('increaseLines');
    const maxBetButton = document.getElementById('maxSlotsBet');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const paylines = document.querySelectorAll('.payline');
    const winMessageElement = document.getElementById('slotsWinMessage');
    const slotContainer = document.querySelector('.video-slot');
    
    // Настройки игры
    let betAmount = 25;
    let linesAmount = 20;
    let isSpinning = false;
    const maxBet = 100;
    const minBet = 5;
    const maxLines = 20;
    const minLines = 1;
    
    // Символы для разных тем с весами и выплатами
    const themeSymbols = {
        egypt: [
            { symbol: '🏺', weight: 20, payout: 5 },
            { symbol: '👑', weight: 15, payout: 10 },
            { symbol: '🐪', weight: 20, payout: 5 },
            { symbol: '🔮', weight: 10, payout: 15 },
            { symbol: '🐍', weight: 15, payout: 10 },
            { symbol: '👁️', weight: 5, payout: 25 },
            { symbol: '🕌', weight: 10, payout: 15 },
            { symbol: '🐫', weight: 5, payout: 25 }
        ],
        fruits: [
            { symbol: '🍎', weight: 20, payout: 5 },
            { symbol: '🍌', weight: 20, payout: 5 },
            { symbol: '🍇', weight: 15, payout: 10 },
            { symbol: '🍒', weight: 10, payout: 15 },
            { symbol: '🍋', weight: 15, payout: 10 },
            { symbol: '🍉', weight: 10, payout: 15 },
            { symbol: '🍓', weight: 5, payout: 25 },
            { symbol: '🥝', weight: 5, payout: 25 }
        ],
        space: [
            { symbol: '🚀', weight: 15, payout: 10 },
            { symbol: '🛸', weight: 10, payout: 15 },
            { symbol: '🌟', weight: 20, payout: 5 },
            { symbol: '🪐', weight: 10, payout: 15 },
            { symbol: '👽', weight: 5, payout: 25 },
            { symbol: '🌌', weight: 15, payout: 10 },
            { symbol: '☄️', weight: 20, payout: 5 },
            { symbol: '🌠', weight: 5, payout: 25 }
        ]
    };
    
    // Специальные символы
    const specialSymbols = {
        egypt: { wild: '🧞', scatter: '📜' },
        fruits: { wild: '🌈', scatter: '🎰' },
        space: { wild: '🌀', scatter: '🌍' }
    };
    
    let currentTheme = 'egypt';
    
    // Инициализация слотов
    initSlots();
    
    // Добавление 3D эффекта при наведении на слоты
    slotContainer.addEventListener('mousemove', function(e) {
        if (isSpinning) return;
        
        const rect = slotContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const angleX = (mouseY - centerY) / 30;
        const angleY = (centerX - mouseX) / 30;
        
        slotScreen.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    slotContainer.addEventListener('mouseleave', function() {
        if (isSpinning) return;
        slotScreen.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
    
    // Обработчики событий с улучшенной обратной связью
    spinButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            startSpin();
        }, 300);
    });
    
    decreaseBetButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            decreaseBet();
        }, 300);
    });
    
    increaseBetButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            increaseBet();
        }, 300);
    });
    
    decreaseLinesButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            decreaseLines();
        }, 300);
    });
    
    increaseLinesButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            increaseLines();
        }, 300);
    });
    
    maxBetButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Анимация кнопки
        this.classList.add('pulse-animation');
        setTimeout(() => {
            this.classList.remove('pulse-animation');
            setMaxBet();
        }, 300);
    });
    
    // Обработчики для кнопок выбора темы с улучшенной обратной связью
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (isSpinning) return;
            
            const theme = this.getAttribute('data-theme');
            
            // Анимация кнопки
            this.classList.add('pulse-animation');
            setTimeout(() => {
                this.classList.remove('pulse-animation');
                
                // Обновление активной кнопки
                themeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                changeTheme(theme);
                
                // Звук изменения темы
                playThemeChangeSound();
            }, 300);
        });
    });
    
    // Функция инициализации слотов с улучшенным визуальным оформлением
    function initSlots() {
        // Очистка сетки
        slotGrid.innerHTML = '';
        
        // Создание трех рядов
        for (let i = 0; i < 3; i++) {
            const row = document.createElement('div');
            row.className = 'slot-row';
            
            // Создание пяти ячеек в каждом ряду
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.className = 'slot-cell';
                
                // Добавление случайного символа с учетом весов
                const symbol = getWeightedRandomSymbol();
                cell.textContent = symbol;
                
                // Д��бавление эффекта при наведении
                cell.addEventListener('mouseenter', function() {
                    if (isSpinning) return;
                    this.style.transform = 'scale(1.1)';
                    this.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.5)';
                    this.style.zIndex = '10';
                });
                
                cell.addEventListener('mouseleave', function() {
                    if (isSpinning) return;
                    this.style.transform = '';
                    this.style.boxShadow = '';
                    this.style.zIndex = '';
                });
                
                row.appendChild(cell);
            }
            
            slotGrid.appendChild(row);
        }
        
        // Добавление специальных символов с небольшой вероятностью
        addSpecialSymbols();
    }
    
    // Функция получения случайного символа с учетом весов
    function getWeightedRandomSymbol() {
        const symbols = themeSymbols[currentTheme];
        const totalWeight = symbols.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of symbols) {
            if (random < item.weight) {
                return item.symbol;
            }
            random -= item.weight;
        }
        
        return symbols[0].symbol; // Fallback
    }
    
    // Функция добавления специальных символов
    function addSpecialSymbols() {
        const rows = slotGrid.querySelectorAll('.slot-row');
        const special = specialSymbols[currentTheme];
        
        // Добавление Wild символа с вероятностью 5%
        if (Math.random() < 0.05) {
            const randomRow = Math.floor(Math.random() * 3);
            const randomCol = Math.floor(Math.random() * 5);
            
            const cell = rows[randomRow].querySelectorAll('.slot-cell')[randomCol];
            cell.textContent = special.wild;
            cell.classList.add('wild-symbol');
        }
        
        // Добавление Scatter символа с вероятностью 5%
        if (Math.random() < 0.05) {
            const randomRow = Math.floor(Math.random() * 3);
            const randomCol = Math.floor(Math.random() * 5);
            
            const cell = rows[randomRow].querySelectorAll('.slot-cell')[randomCol];
            if (!cell.classList.contains('wild-symbol')) {
                cell.textContent = special.scatter;
                cell.classList.add('scatter-symbol');
            }
        }
    }
    
    // Функция запуска вращения с улучшенной анимацией
    function startSpin() {
        if (isSpinning) return;
        
        // Проверка баланса
        const currentBalance = window.getBalance();
        const totalBet = betAmount * linesAmount;
        
        if (currentBalance < totalBet) {
            showWinMessage('Недостаточно средств!', false);
            
            // Анимация отказа
            spinButton.classList.add('shake-animation');
            setTimeout(() => {
                spinButton.classList.remove('shake-animation');
            }, 500);
            
            return;
        }
        
        // Списание ставки
        window.updateBalance(-totalBet);
        
        isSpinning = true;
        spinButton.disabled = true;
        decreaseBetButton.disabled = true;
        increaseBetButton.disabled = true;
        decreaseLinesButton.disabled = true;
        increaseLinesButton.disabled = true;
        maxBetButton.disabled = true;
        
        // Сброс 3D эффекта во время вращения
        slotScreen.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        
        // Скрытие предыдущего сообщения о выигрыше
        winMessageElement.classList.remove('show');
        winMessageElement.textContent = '';
        
        // Скрытие линий выплат
        paylines.forEach(payline => {
            payline.classList.remove('active');
        });
        
        // Звук запуска вращения
        playSpinStartSound();
        
        // Анимация вращения с улучшенной физикой
        animateSlots();
    }
    
    // Анимация вращения слотов с улучшенной физикой
    function animateSlots() {
        // Добавляем класс анимации для всех ячеек
        const cells = document.querySelectorAll('.slot-cell');
        cells.forEach(cell => {
            cell.classList.add('spinning');
            
            // Создаем эффект размытия при вращении
            cell.style.filter = 'blur(2px)';
        });
        
        // Создаем новую сетку с случайными символами
        const newGrid = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                row.push(getWeightedRandomSymbol());
            }
            newGrid.push(row);
        }
        
        // Добавляем специальные символы в результат
        addSpecialSymbolsToResult(newGrid);
        
        // Анимация вращения с разной задержкой для каждого столбца
        setTimeout(() => {
            updateColumn(0, newGrid);
            playReelStopSound();
            
            setTimeout(() => {
                updateColumn(1, newGrid);
                playReelStopSound();
                
                setTimeout(() => {
                    updateColumn(2, newGrid);
                    playReelStopSound();
                    
                    setTimeout(() => {
                        updateColumn(3, newGrid);
                        playReelStopSound();
                        
                        setTimeout(() => {
                            updateColumn(4, newGrid);
                            playReelStopSound();
                            
                            // Проверка выигрышных комбинаций
                            setTimeout(() => {
                                checkWinningCombinations(newGrid);
                                
                                isSpinning = false;
                                spinButton.disabled = false;
                                decreaseBetButton.disabled = false;
                                increaseBetButton.disabled = false;
                                decreaseLinesButton.disabled = false;
                                increaseLinesButton.disabled = false;
                                maxBetButton.disabled = false;
                            }, 500);
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, 1000);
    }
    
    // Функция добавления специальных символов в результат
    function addSpecialSymbolsToResult(grid) {
        const special = specialSymbols[currentTheme];
        
        // Добавление Wild символа с вероятностью 10%
        if (Math.random() < 0.1) {
            const randomRow = Math.floor(Math.random() * 3);
            const randomCol = Math.floor(Math.random() * 5);
            grid[randomRow][randomCol] = special.wild;
        }
        
        // Добавление Scatter символа с вероятностью 10%
        if (Math.random() < 0.1) {
            const randomRow = Math.floor(Math.random() * 3);
            const randomCol = Math.floor(Math.random() * 5);
            
            if (grid[randomRow][randomCol] !== special.wild) {
                grid[randomRow][randomCol] = special.scatter;
            }
        }
    }
    
    // Обновление символов в столбце с улучшенной анимацией
    function updateColumn(colIndex, newGrid) {
        const rows = slotGrid.querySelectorAll('.slot-row');
        
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('.slot-cell');
            const cell = cells[colIndex];
            
            if (cell) {
                // Анимация обновления символа
                cell.style.transform = 'scale(0) rotateY(180deg)';
                cell.style.filter = 'blur(0)';
                cell.classList.remove('spinning');
                cell.classList.remove('wild-symbol');
                cell.classList.remove('scatter-symbol');
                
                setTimeout(() => {
                    cell.textContent = newGrid[rowIndex][colIndex];
                    
                    // Добавление классов для специальных символов
                    const special = specialSymbols[currentTheme];
                    if (newGrid[rowIndex][colIndex] === special.wild) {
                        cell.classList.add('wild-symbol');
                    } else if (newGrid[rowIndex][colIndex] === special.scatter) {
                        cell.classList.add('scatter-symbol');
                    }
                    
                    cell.classList.remove('highlight');
                    cell.style.transform = 'scale(1) rotateY(0)';
                    
                    // Добавляем эффект отскока при остановке
                    setTimeout(() => {
                        cell.classList.add('bounce-effect');
                        setTimeout(() => {
                            cell.classList.remove('bounce-effect');
                        }, 500);
                    }, 100);
                }, 150);
            }
        });
    }
    
    // Проверка выигрышных комбинаций с улучшенной анимацией
    function checkWinningCombinations(grid) {
        let totalWin = 0;
        const winningLines = [];
        const winningCells = [];
        const special = specialSymbols[currentTheme];
        
        // Проверка горизонтальных линий (в зависимости от количества активных линий)
        for (let i = 0; i < Math.min(3, linesAmount); i++) {
            const row = grid[i];
            
            // Проверка комбинаций слева направо
            for (let j = 0; j < row.length - 2; j++) {
                const symbol = row[j];
                if (symbol === special.scatter) continue; // Scatter не участвует в обычных комбинациях
                
                let count = 1;
                let wildCount = 0;
                
                if (symbol === special.wild) {
                    wildCount = 1;
                }
                
                for (let k = j + 1; k < row.length; k++) {
                    if (row[k] === symbol || row[k] === special.wild) {
                        count++;
                        if (row[k] === special.wild) {
                            wildCount++;
                        }
                    } else {
                        break;
                    }
                }
                
                if (count >= 3) {
                    // Находим выплату для символа
                    let payout = 0;
                    if (symbol !== special.wild) {
                        const symbolData = themeSymbols[currentTheme].find(s => s.symbol === symbol);
                        payout = symbolData ? symbolData.payout : 5; // Значение по умолчанию, если символ не найден
                    } else {
                        payout = 50; // Выплата за комбинацию из Wild символов
                    }
                    
                    // Увеличиваем выплату, если есть Wild символы в комбинации
                    if (wildCount > 0 && symbol !== special.wild) {
                        payout *= (1 + wildCount * 0.5); // +50% за каждый Wild
                    }
                    
                    const lineWin = betAmount * count * payout / 10;
                    totalWin += lineWin;
                    winningLines.push(i);
                    
                    // Запоминаем выигрышные ячейки
                    for (let k = j; k < j + count; k++) {
                        winningCells.push({row: i, col: k, win: lineWin});
                    }
                    
                    break; // Переходим к следующей линии
                }
            }
        }
        
        // Проверка на Scatter символы (выигрыш независимо от линий)
        let scatterCount = 0;
        const scatterPositions = [];
        
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === special.scatter) {
                    scatterCount++;
                    scatterPositions.push({row: i, col: j});
                }
            }
        }
        
        if (scatterCount >= 3) {
            const scatterWin = betAmount * linesAmount * scatterCount;
            totalWin += scatterWin;
            
            // Добавляем Scatter символы в список выигрышных ячеек
            scatterPositions.forEach(pos => {
                winningCells.push({row: pos.row, col: pos.col, win: scatterWin / scatterCount, isScatter: true});
            });
            
            // Активируем бонусные вращения (в данном случае просто показываем сообщение)
            setTimeout(() => {
                showBonusMessage(`Выпало ${scatterCount} Scatter! Бонусные вращения!`);
            }, 1500);
        }
        
        // Подсветка выигрышных ячеек с анимацией
        if (winningCells.length > 0) {
            const rows = slotGrid.querySelectorAll('.slot-row');
            
            winningCells.forEach(({row, col, win, isScatter}) => {
                const rowElement = rows[row];
                const cells = rowElement.querySelectorAll('.slot-cell');
                const cell = cells[col];
                
                // Добавляем класс подсветки
                cell.classList.add('highlight');
                
                // Создаем анимацию выигрыша
                const winAmount = document.createElement('div');
                winAmount.className = 'win-amount';
                winAmount.textContent = `+${Math.round(win)}`;
                cell.appendChild(winAmount);
                
                setTimeout(() => {
                    winAmount.style.opacity = '1';
                    winAmount.style.transform = 'translateY(-20px)';
                }, 10);
                
                // Для Scatter добавляем особую анимацию
                if (isScatter) {
                    cell.classList.add('scatter-win');
                }
                
                // Удаляем анимацию через некоторое время
                setTimeout(() => {
                    winAmount.style.opacity = '0';
                    setTimeout(() => {
                        if (cell.contains(winAmount)) {
                            cell.removeChild(winAmount);
                        }
                    }, 500);
                }, 3000);
            });
        }
        
        // Отображение выигрышных линий с анимацией
        winningLines.forEach((lineIndex, index) => {
            // Добавляем задержку для каждой линии
            setTimeout(() => {
                paylines[lineIndex].classList.add('active');
                
                // Звук активации линии
                playLineWinSound();
            }, index * 300);
        });
        
        // Обновление баланса и отображение сообщения
        if (totalWin > 0) {
            // Задержка для драматического эффекта
            setTimeout(() => {
                window.updateBalance(totalWin);
                showWinMessage(`Выигрыш! +${Math.round(totalWin)}`, true);
                
                // Звук выигрыша
                playWinSound(totalWin);
                
                // Анимация монет при крупном выигрыше
                if (totalWin >= 100) {
                    createCoinAnimation();
                }
            }, 1000);
        } else {
            showWinMessage('Попробуйте еще раз!', false);
            
            // Звук проигрыша
            playLoseSound();
        }
    }
    
    // Отображение сообщения о выигрыше с улучшенной анимацией
    function showWinMessage(message, isWin) {
        winMessageElement.textContent = message;
        winMessageElement.classList.add('show');
        
        if (isWin) {
            winMessageElement.style.color = 'var(--win-color)';
            winMessageElement.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
            
            // Добавляем анимацию для выигрыша
            winMessageElement.classList.add('win-animation');
            setTimeout(() => {
                winMessageElement.classList.remove('win-animation');
            }, 3000);
        } else {
            winMessageElement.style.color = 'var(--light-text)';
            winMessageElement.style.textShadow = 'none';
        }
    }
    
    // Отображение сообщения о бонусе
    function showBonusMessage(message) {
        const bonusMessage = document.createElement('div');
        bonusMessage.className = 'bonus-message';
        bonusMessage.textContent = message;
        
        slotScreen.appendChild(bonusMessage);
        
        setTimeout(() => {
            bonusMessage.classList.add('show');
        }, 10);
        
        // Звук бонуса
        playBonusSound();
        
        // Удаление сообщения через некоторое время
        setTimeout(() => {
            bonusMessage.classList.remove('show');
            setTimeout(() => {
                slotScreen.removeChild(bonusMessage);
            }, 500);
        }, 4000);
    }
    
    // Изменение темы слотов с улучшенной анимацией
    function changeTheme(theme) {
        // Сохраняем старую тему для анимации перехода
        const oldTheme = currentTheme;
        currentTheme = theme;
        
        // Анимация перехода
        slotScreen.style.opacity = '0';
        slotScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            // Обновление фона
            slotScreen.className = `slot-screen ${theme}-theme`;
            
            // Обновление символов с анимацией
            const rows = slotGrid.querySelectorAll('.slot-row');
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('.slot-cell');
                cells.forEach((cell, colIndex) => {
                    // Анимация смены символа
                    cell.style.transform = 'scale(0) rotateY(180deg)';
                    
                    setTimeout(() => {
                        // Обновляем символ
                        cell.textContent = getWeightedRandomSymbol();
                        cell.classList.remove('wild-symbol');
                        cell.classList.remove('scatter-symbol');
                        cell.classList.remove('highlight');
                        
                        // Возвращаем нормальный размер
                        cell.style.transform = 'scale(1) rotateY(0)';
                    }, 150 + (rowIndex * 100) + (colIndex * 50));
                });
            });
            
            // Добавляем специальные символы после обновления всех ячеек
            setTimeout(() => {
                addSpecialSymbols();
                
                // Показываем слоты с анимацией
                slotScreen.style.opacity = '1';
                slotScreen.style.transform = 'scale(1)';
            }, 800);
        }, 300);
    }
    
    // Функция создания анимации падающих монет
    function createCoinAnimation() {
        const container = document.querySelector('.slots-game');
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
    
    // Функции управления ставкой и линиями с улучшенной обратной связью
    function increaseBet() {
        if (betAmount < maxBet) {
            betAmount += 5;
            updateBetDisplay();
            playButtonSound();
        } else {
            // Анимация достижения максимума
            betAmountElement.classList.add('max-value-animation');
            setTimeout(() => {
                betAmountElement.classList.remove('max-value-animation');
            }, 500);
        }
    }
    
    function decreaseBet() {
        if (betAmount > minBet) {
            betAmount -= 5;
            updateBetDisplay();
            playButtonSound();
        } else {
            // Анимация достижения минимума
            betAmountElement.classList.add('min-value-animation');
            setTimeout(() => {
                betAmountElement.classList.remove('min-value-animation');
            }, 500);
        }
    }
    
    function increaseLines() {
        if (linesAmount < maxLines) {
            linesAmount += 1;
            updateLinesDisplay();
            playButtonSound();
            
            // Подсветка активных линий
            highlightActiveLines();
        } else {
            // Анимация достижения максимума
            linesAmountElement.classList.add('max-value-animation');
            setTimeout(() => {
                linesAmountElement.classList.remove('max-value-animation');
            }, 500);
        }
    }
    
    function decreaseLines() {
        if (linesAmount > minLines) {
            linesAmount -= 1;
            updateLinesDisplay();
            playButtonSound();
            
            // Подсветка активных линий
            highlightActiveLines();
        } else {
            // Анимация достижения минимума
            linesAmountElement.classList.add('min-value-animation');
            setTimeout(() => {
                linesAmountElement.classList.remove('min-value-animation');
            }, 500);
        }
    }
    
    function setMaxBet() {
        const oldBet = betAmount;
        const oldLines = linesAmount;
        
        betAmount = maxBet;
        linesAmount = maxLines;
        
        // Анимация только если значения изменились
        if (oldBet !== maxBet) {
            updateBetDisplay(true);
        }
        
        if (oldLines !== maxLines) {
            updateLinesDisplay(true);
            highlightActiveLines();
        }
        
        playButtonSound();
    }
    
    // Подсветка активных линий
    function highlightActiveLines() {
        paylines.forEach((payline, index) => {
            if (index < linesAmount) {
                payline.classList.add('preview');
                
                setTimeout(() => {
                    payline.classList.remove('preview');
                }, 1000);
            }
        });
    }
    
    function updateBetDisplay(isMax = false) {
        const oldValue = parseInt(betAmountElement.textContent);
        const newValue = betAmount;
        
        if (oldValue !== newValue) {
            betAmountElement.classList.add('update-animation');
            
            setTimeout(() => {
                betAmountElement.textContent = newValue;
                
                if (isMax) {
                    betAmountElement.classList.add('max-value-animation');
                    setTimeout(() => {
                        betAmountElement.classList.remove('max-value-animation');
                    }, 500);
                }
                
                setTimeout(() => {
                    betAmountElement.classList.remove('update-animation');
                }, 300);
            }, 300);
        } else {
            betAmountElement.textContent = newValue;
        }
    }
    
    function updateLinesDisplay(isMax = false) {
        const oldValue = parseInt(linesAmountElement.textContent);
        const newValue = linesAmount;
        
        if (oldValue !== newValue) {
            linesAmountElement.classList.add('update-animation');
            
            setTimeout(() => {
                linesAmountElement.textContent = newValue;
                
                if (isMax) {
                    linesAmountElement.classList.add('max-value-animation');
                    setTimeout(() => {
                        linesAmountElement.classList.remove('max-value-animation');
                    }, 500);
                }
                
                setTimeout(() => {
                    linesAmountElement.classList.remove('update-animation');
                }, 300);
            }, 300);
        } else {
            linesAmountElement.textContent = newValue;
        }
    }
    
    // Звуковые эффекты (заглушки, так как звуки не подключены)
    function playButtonSound() {
        console.log('Playing button sound');
    }
    
    function playSpinStartSound() {
        console.log('Playing spin start sound');
    }
    
    function playReelStopSound() {
        console.log('Playing reel stop sound');
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
    
    function playLineWinSound() {
        console.log('Playing line win sound');
    }
    
    function playBonusSound() {
        console.log('Playing bonus sound');
    }
    
    function playThemeChangeSound() {
        console.log('Playing theme change sound');
    }
    
    // Добавление стилей для новых анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake-animation {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes win-animation {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        @keyframes update-animation {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes max-value-animation {
            0%, 100% { color: var(--primary-color); }
            50% { color: var(--win-color); }
        }
        
        @keyframes min-value-animation {
            0%, 100% { color: var(--primary-color); }
            50% { color: var(--error-color); }
        }
        
        @keyframes bounce-effect {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .shake-animation {
            animation: shake-animation 0.5s;
        }
        
        .win-animation {
            animation: win-animation 0.5s 3;
        }
        
        .update-animation {
            animation: update-animation 0.6s;
        }
        
        .max-value-animation {
            animation: max-value-animation 0.5s;
        }
        
        .min-value-animation {
            animation: min-value-animation 0.5s;
        }
        
        .bounce-effect {
            animation: bounce-effect 0.5s;
        }
        
        .wild-symbol {
            color: gold;
            text-shadow: 0 0 10px gold;
            animation: glow 1.5s infinite;
        }
        
        .scatter-symbol {
            color: #ff00ff;
            text-shadow: 0 0 10px #ff00ff;
            animation: glow 1.5s infinite;
        }
        
        .scatter-win {
            animation: jackpot 0.5s infinite;
        }
        
        .win-amount {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 0);
            color: var(--win-color);
            font-weight: bold;
            font-size: 1.2rem;
            opacity: 0;
            transition: all 1s ease;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
            pointer-events: none;
            z-index: 100;
        }
        
        .bonus-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(0, 0, 0, 0.8);
            color: var(--win-color);
            font-weight: bold;
            font-size: 1.5rem;
            padding: 20px 30px;
            border-radius: 10px;
            border: 2px solid var(--primary-color);
            box-shadow: 0 0 20px var(--primary-color);
            text-align: center;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 100;
        }
        
        .bonus-message.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        
        .payline.preview {
            opacity: 0.5;
            animation: glow 1s;
        }
    `;
    document.head.appendChild(style);
});