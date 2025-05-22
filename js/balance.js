// Управление балансом пользователя
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация баланса при первом посещении
    if (localStorage.getItem('casinoBalance') === null) {
        localStorage.setItem('casinoBalance', '5000');
    }
    
    // Обновление отображения баланса на всех страницах
    updateBalanceDisplay();
    
    // Добавление обработчика клика на баланс для перехода на страницу пополнения
    const userBalance = document.querySelector('.user-balance');
    if (userBalance) {
        userBalance.addEventListener('click', function() {
            window.location.href = 'balance.html';
        });
    }
    
    // Функция для обновления отображения баланса
    function updateBalanceDisplay() {
        const balance = localStorage.getItem('casinoBalance');
        const balanceDisplays = document.querySelectorAll('.balance-amount, .balance-display');
        
        balanceDisplays.forEach(display => {
            display.textContent = balance;
            
            // Анимация изменения баланса
            display.classList.add('fade-in');
            setTimeout(() => {
                display.classList.remove('fade-in');
            }, 500);
        });
    }
    
    // Глобальные функции для работы с балансом
    window.updateBalance = function(amount) {
        let currentBalance = parseInt(localStorage.getItem('casinoBalance'));
        currentBalance += amount;
        
        // Предотвращение отрицательного баланса
        if (currentBalance < 0) {
            currentBalance = 0;
        }
        
        localStorage.setItem('casinoBalance', currentBalance.toString());
        updateBalanceDisplay();
        
        // Анимация при выигрыше или проигрыше
        const userBalance = document.querySelector('.user-balance');
        if (userBalance) {
            if (amount > 0) {
                userBalance.classList.add('glow-animation');
                
                // Анимация падающих монет при крупном выигрыше
                if (amount >= 100) {
                    createCoinAnimation();
                }
                
                setTimeout(() => {
                    userBalance.classList.remove('glow-animation');
                }, 2000);
            } else if (amount < 0) {
                userBalance.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    userBalance.style.animation = '';
                }, 500);
            }
        }
        
        return currentBalance;
    };
    
    window.getBalance = function() {
        return parseInt(localStorage.getItem('casinoBalance'));
    };
    
    // Функция создания анимации падающих монет
    function createCoinAnimation() {
        const container = document.body;
        const coinCount = 20;
        
        for (let i = 0; i < coinCount; i++) {
            const coin = document.createElement('div');
            coin.className = 'falling-coin';
            coin.innerHTML = '🪙';
            coin.style.left = `${Math.random() * 100}%`;
            coin.style.animationDuration = `${1 + Math.random() * 2}s`;
            coin.style.animationDelay = `${Math.random() * 0.5}s`;
            
            container.appendChild(coin);
            
            // Удаление монеты после завершения анимации
            setTimeout(() => {
                coin.remove();
            }, 3000);
        }
    }
    
    // Добавление стилей для анимации монет
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fallCoin {
            0% {
                transform: translateY(-50px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 50px)) rotate(360deg);
                opacity: 0;
            }
        }
        
        .falling-coin {
            position: fixed;
            top: 0;
            font-size: 2rem;
            z-index: 9999;
            animation: fallCoin 3s linear forwards;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
});