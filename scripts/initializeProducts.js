const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const testProducts = [
  {
    title: 'Смартфон iPhone 13',
    price: 1999.99,
    description: 'Мощен смартфон с отлична камера и дълготрайна батерия',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=60',
    category: 'electronics',
    stock: 10
  },
  {
    title: 'Лаптоп Dell XPS 13',
    price: 2499.99,
    description: 'Високопроизводителен лаптоп с отличен дисплей',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    category: 'electronics',
    stock: 5
  },
  {
    title: 'Смарт часовник Apple Watch Series 7',
    price: 999.99,
    description: 'Модерен смарт часовник с множество функции',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60',
    category: 'electronics',
    stock: 15
  },
  {
    title: 'Безжични слушалки Sony WH-1000XM4',
    price: 799.99,
    description: 'Висококачествени безжични слушалки с шумопоглъщане',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60',
    category: 'electronics',
    stock: 8
  },
  {
    title: 'Таблет iPad Pro 12.9',
    price: 2999.99,
    description: 'Мощен таблет с M2 процесор и Liquid Retina XDR дисплей',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    category: 'electronics',
    stock: 3
  }
];

async function initializeProducts() {
  try {
    const productsRef = db.collection('products');
    
    // Delete existing products
    const snapshot = await productsRef.get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Existing products deleted');

    // Add new products
    for (const product of testProducts) {
      await productsRef.add(product);
    }
    console.log('Test products added successfully');
  } catch (error) {
    console.error('Error initializing products:', error);
  } finally {
    process.exit();
  }
}

initializeProducts(); 