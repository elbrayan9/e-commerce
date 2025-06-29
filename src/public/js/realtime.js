// Iniciamos la conexión del socket del lado del cliente.
const socket = io();

const productsList = document.getElementById('products-list');
const createForm = document.getElementById('create-product-form');
const deleteForm = document.getElementById('delete-product-form');

// Función para renderizar la lista de productos
const renderProducts = (products) => {
    productsList.innerHTML = ''; // Limpiamos la lista
    if (products.length > 0) {
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>ID: ${product.id}</strong> - ${product.title}
                <p>Precio: $${product.price}</p>
            `;
            productsList.appendChild(listItem);
        });
    } else {
        productsList.innerHTML = '<p>No hay productos para mostrar.</p>';
    }
};

// Escuchamos el evento 'updateProducts' que envía el servidor
socket.on('updateProducts', (products) => {
    renderProducts(products);
});

// Manejador para el formulario de creación
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(createForm);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
    };
    // Emitimos el evento 'createProduct' al servidor
    socket.emit('createProduct', productData);
    createForm.reset();
});

// Manejador para el formulario de eliminación
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = parseInt(document.querySelector('#delete-product-form input[name="id"]').value);
    // Emitimos el evento 'deleteProduct' al servidor
    socket.emit('deleteProduct', productId);
    deleteForm.reset();
});