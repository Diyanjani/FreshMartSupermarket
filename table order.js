document.addEventListener('DOMContentLoaded', () => {
    const order = [];
    let totalPrice = 0;

    const addToOrderTable = (itemName, itemQuantity, itemPrice) => {
        const orderTableBody = document.querySelector('#order-table tbody');
        const existingRow = Array.from(orderTableBody.rows).find(row => row.cells[0].textContent === itemName);

        if (existingRow) {
            const existingQuantity = parseFloat(existingRow.cells[1].textContent);
            const newQuantity = existingQuantity + itemQuantity;
            const totalItemPrice = (newQuantity * itemPrice).toFixed(2);

            existingRow.cells[1].textContent = newQuantity;
            existingRow.cells[2].textContent = totalItemPrice;
        } else {
            const newRow = document.createElement('tr');
            const totalItemPrice = (itemQuantity * itemPrice).toFixed(2);

            newRow.innerHTML = `
                <td>${itemName}</td>
                <td>${itemQuantity}</td>
                <td>${totalItemPrice}</td>
            `;

            orderTableBody.appendChild(newRow);
        }

        updateTotal();
    };

    const handleAddToCartClick = (event) => {
        event.preventDefault(); 
        const row = event.target.closest('tr');
        const itemName = row.querySelector('td:nth-child(2)').textContent;
        const itemQuantity = parseFloat(row.querySelector('input[type="number"]').value);
        const itemPriceText = row.querySelector('td:nth-child(4)').textContent;
        const itemPrice = parseFloat(itemPriceText.replace('kg', '').trim());

        if (itemQuantity > 0) {
            addToOrderTable(itemName, itemQuantity, itemPrice);
        } else {
            alert('Please enter a quantity greater than 0.');
        }
    };

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', handleAddToCartClick);
    });

    const addToFavorites = () => {
        const orderTableRows = document.querySelectorAll('#order-table tbody tr');
        const favorites = [];

        orderTableRows.forEach(row => {
            const itemName = row.querySelector('td:nth-child(1)').textContent;
            const itemQuantity = row.querySelector('td:nth-child(2)').textContent;
            const itemPrice = row.querySelector('td:nth-child(3)').textContent;

            favorites.push({ itemName, itemQuantity, itemPrice, totalPrice });
        });

        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Favorites saved successfully.');
    };

    const applyFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites'));

        if (favorites && favorites.length > 0) {
            const orderTableBody = document.querySelector('#order-table tbody');
            orderTableBody.innerHTML = ''; 
            totalPrice = 0; 

            favorites.forEach(favorite => {
                addToOrderTable(favorite.itemName, parseFloat(favorite.itemQuantity), parseFloat(favorite.itemPrice));
            });

            alert('Favorites applied successfully.');
        } else {
            alert('No favorites found.');
        }
    };

    document.getElementById('add-favorites').addEventListener('click', addToFavorites);
    document.getElementById('apply-favorites').addEventListener('click', applyFavorites);

    const saveOrderAndRedirect = () => {
        const orderTableRows = document.querySelectorAll('#order-table tbody tr');
        const orderData = [];

        orderTableRows.forEach(row => {
            const itemName = row.querySelector('td:nth-child(1)').textContent;
            const itemQuantity = row.querySelector('td:nth-child(2)').textContent;
            const itemPrice = row.querySelector('td:nth-child(3)').textContent;

            orderData.push({ itemName, itemQuantity, itemPrice, totalPrice });
        });

        localStorage.setItem('order', JSON.stringify(orderData));
        sessionStorage.setItem('order', JSON.stringify(orderData));
        window.location.href = 'order.html'; 
    };

    document.getElementById('buy-now').addEventListener('click', saveOrderAndRedirect);

    const updateTotal = () => {
        const orderTableRows = document.querySelectorAll('#order-table tbody tr');
        totalPrice = 0; 
        
        orderTableRows.forEach(row => {
            const itemPrice = parseFloat(row.querySelector('td:nth-child(3)').textContent);
            totalPrice += itemPrice;
        });

        document.getElementById('total-price').textContent = `Total Price: ${totalPrice.toFixed(2)}`;
        sessionStorage.setItem("storage", JSON.stringify(totalPrice) )
    };
});



window.addEventListener('DOMContentLoaded', () => {
    const displayOrder = (order) => {
        const orderTableBody = document.querySelector('#order-table tbody');
        let totalPrice = 0;

        order.forEach(item => {
            const newRow = document.createElement('tr');
            const itemQuantity = Number(item.itemQuantity);
            const itemPrice = Number(item.itemPrice);
            const itemTotalPrice = (itemQuantity * itemPrice).toFixed(2);

            console.log(`Item: ${item.itemName}, Quantity: ${itemQuantity}, Price: ${itemPrice}, Total: ${itemTotalPrice}`);


            newRow.innerHTML = `
                <td>${item.itemName}</td>
                <td>${itemQuantity}</td>
                <td>${itemPrice.toFixed(2)}</td>
            `;
            
            orderTableBody.appendChild(newRow);
            
        });
        totalPrice = JSON.parse(sessionStorage.getItem("storage"))
        document.querySelector('.total-price').innerHTML = `Total Price:${totalPrice.toFixed(2)}`;
        
    };

    const orderData = JSON.parse(localStorage.getItem('order'));

    if (orderData) {
        displayOrder(orderData);
        localStorage.removeItem('order'); 
    } else {
        console.error('No order data found in local storage');
    }
});
// Function to clear the order table
function clearOrderTable() {
    const orderTableBody = document.querySelector('#order-table tbody');
    if (orderTableBody) {
        orderTableBody.innerHTML = ''; 
    }

    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = 'Total Price: 0.00'; 
    }
}

// format the date as "Month Day, Year" (e.g., August 10, 2024)
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// formating the delivery date
function getDeliveryDate(daysToAdd) {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);
    
    return deliveryDate;
}

// clearing the form details
function clearFormDetails() {
    console.log('Clearing form details...');
    const form = document.querySelector('.page-container form');
    if (form) {
        form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"]').forEach(input => {
            input.value = ''; 
        });

        form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        form.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0; 
        });
    }
}

document.getElementById('buy-now-2').addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Place Order button clicked');
    
    clearOrderTable(); 
    clearFormDetails(); 
    
    // Number of days to delivery
    const deliveryDays = 5;
    
    // Get and format the current date (order date) and delivery date
    const orderDate = new Date();
    const deliveryDate = getDeliveryDate(deliveryDays);
    
    const formattedOrderDate = formatDate(orderDate);
    const formattedDeliveryDate = formatDate(deliveryDate);
    
    alert(`Your order has been placed successfully on ${formattedOrderDate}. It will be delivered on ${formattedDeliveryDate}.`);
});
