document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const amountInput = document.getElementById('amount');
    const increaseAmountBtn = document.getElementById('increaseAmount');
    const decreaseAmountBtn = document.getElementById('decreaseAmount');
    const quickAmountBtns = document.querySelectorAll('.quick-amount');
    const addBalanceBtn = document.getElementById('addBalanceBtn');
    const balanceHistoryElement = document.getElementById('balanceHistory');
    
    // Загрузка истории операций
    loadBalanceHistory();
    
    // Обработчики событий
    increaseAmountBtn.addEventListener('click', function() {
        let currentAmount = parseInt(amountInput.value);
        if (isNaN(currentAmount)) currentAmount = 1000;
        amountInput.value = Math.min(currentAmount + 1000, 100000);
    });
    
    decreaseAmountBtn.addEventListener('click', function() {
        let currentAmount = parseInt(amountInput.value);
        if (isNaN(currentAmount)) currentAmount = 1000;
        amountInput.value = Math.max(currentAmount - 1000, 100);
    });
    
    quickAmountBtns.forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            amountInput.value = amount;
            
            // Анимация выбора суммы
            quickAmountBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    addBalanceBtn.addEventListener('click', function() {
        let amount = parseInt(amountInput.value);
        if (isNaN(amount) || amount < 100) {
            showNotification('Пожалуйста, введите корректную сумму (минимум 100)', 'error');
            return;
        }
        
        // Добавление баланса
        window.updateBalance(amount);
        
        // Добавление записи в историю
        addHistoryEntry(amount);
        
        // Анимация кнопки и уведомление
        this.classList.add('success-animation');
        showNotification(`Баланс успешно пополнен на ${amount} кредитов!`, 'success');
        
        setTimeout(() => {
            this.classList.remove('success-animation');
        }, 1000);
    });
    
    // Функция загрузки истории операций
    function loadBalanceHistory() {
        // Получение истории из localStorage
        let history = localStorage.getItem('balanceHistory');
        
        if (history) {
            history = JSON.parse(history);
            
            // Отображение последних 5 операций
            history.slice(0, 5).forEach(entry => {
                const historyItem = createHistoryItem(entry.amount, entry.date);
                balanceHistoryElement.appendChild(historyItem);
            });
        } else {
            // Если истории нет, показываем сообщение
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'history-empty';
            emptyMessage.textContent = 'История операций пуста';
            balanceHistoryElement.appendChild(emptyMessage);
        }
    }
    
    // Функция добавления записи в историю
    function addHistoryEntry(amount) {
        // Получение текущей истории
        let history = localStorage.getItem('balanceHistory');
        history = history ? JSON.parse(history) : [];
        
        // Добавление новой записи
        const entry = {
            amount: amount,
            date: new Date().toISOString()
        };
        
        history.unshift(entry);
        
        // Ограничение истории до 20 записей
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        // Сохранение истории
        localStorage.setItem('balanceHistory', JSON.stringify(history));
        
        // Обновление отображения
        balanceHistoryElement.innerHTML = '';
        history.slice(0, 5).forEach(entry => {
            const historyItem = createHistoryItem(entry.amount, entry.date);
            balanceHistoryElement.appendChild(historyItem);
        });
    }
    
    // Функция создания элемента истории
    function createHistoryItem(amount, dateString) {
        const date = new Date(dateString);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const amountElement = document.createElement('span');
        amountElement.className = 'history-amount';
        amountElement.textContent = `+${amount}`;
        
        const dateElement = document.createElement('span');
        dateElement.className = 'history-date';
        dateElement.textContent = formattedDate;
        
        historyItem.appendChild(amountElement);
        historyItem.appendChild(dateElement);
        
        return historyItem;
    }
    
    // Функция отображения уведомления
    function showNotification(message, type) {
        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Добавление на страницу
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Удаление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});