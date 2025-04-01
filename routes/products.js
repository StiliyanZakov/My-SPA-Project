const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Sample products data for seeding if needed
const sampleProducts = [
  // Electronics (existing category)
  {
    title: "Смартфон Galaxy S21",
    price: 1299.99,
    description: "Висококачествен смартфон с 5G възможности",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Electronics"
  },
  {
    title: "Лаптоп Ultrabook Pro",
    price: 2499.99,
    description: "Мощен и лек лаптоп за професионалисти",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    category: "Electronics"
  },
  {
    title: "Безжични слушалки SoundFree",
    price: 199.99,
    description: "Висококачествени безжични слушалки с шумопотискане",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1165&q=80",
    category: "Electronics"
  },
  {
    title: "Смарт часовник HealthTrack",
    price: 349.99,
    description: "Модерен смарт часовник с множество функции за следене на здравето",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1228&q=80",
    category: "Electronics"
  },
  
  // Clothing
  {
    title: "Мъжка риза Classic Fit",
    price: 79.99,
    description: "Елегантна памучна риза с класическа кройка",
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Clothing"
  },
  {
    title: "Дамска рокля Summer",
    price: 89.99,
    description: "Лятна рокля с флорален десен",
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Clothing"
  },
  {
    title: "Унисекс дънки Slim",
    price: 119.99,
    description: "Модерни дънки със slim кройка",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVhbnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Clothing"
  },
  {
    title: "Спортни обувки Runner",
    price: 149.99,
    description: "Удобни спортни обувки за бягане",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNuZWFrZXJzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Clothing"
  },
  
  // Home Decor
  {
    title: "Декоративна възглавница Nordic",
    price: 39.99,
    description: "Стилна декоративна възглавница в скандинавски стил",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGlsbG93fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Home Decor"
  },
  {
    title: "Диван Scandic",
    price: 899.99,
    description: "Елегантен и удобен диван в скандинавски стил",
    image: "https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg",
    category: "Home Decor"
  },
  {
    title: "Плетено одеяло Comfort",
    price: 69.99,
    description: "Топло и меко плетено одеяло за вашия дом",
    image: "https://images.pexels.com/photos/6957084/pexels-photo-6957084.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Home Decor"
  },
  {
    title: "Керамичен съд за растения",
    price: 35.99,
    description: "Стилен керамичен съд за стайни растения",
    image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Home Decor"
  }
];

// Seed products function (call this if you need to add sample products)
const seedProducts = async () => {
  try {
    console.log('Start seeding products...');
    
    // Delete existing products to avoid duplicates
    const snapshot = await db.collection('products').get();
    
    if (snapshot.size > 0) {
      console.log(`Deleting ${snapshot.size} existing products`);
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log('Existing products deleted');
    }
    
    // Add batch operation for better performance
    const batch = db.batch();
    
    // Add sample products to Firestore
    sampleProducts.forEach(product => {
      const docRef = db.collection('products').doc();
      batch.set(docRef, {
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    // Commit the batch
    await batch.commit();
    console.log('New products seeded successfully');
    
    // Log all product categories
    const categoriesSnapshot = await db.collection('products').get();
    const categories = new Set();
    categoriesSnapshot.forEach(doc => {
      const category = doc.data().category;
      if (category) {
        categories.add(category);
      }
    });
    console.log('Available categories:', Array.from(categories));
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Run seed on server startup (uncomment if needed)
// seedProducts();

// Get all products
router.get('/', async (req, res) => {
  try {
    let query = db.collection('products');
    
    // Filter by category if provided
    if (req.query.category) {
      query = query.where('category', '==', req.query.category);
    }
    
    const productsSnapshot = await query.get();
    const products = [];
    
    productsSnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Грешка при зареждане на продуктите' });
  }
});

// Get product categories
router.get('/categories', async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const categories = new Set();
    
    productsSnapshot.forEach(doc => {
      const category = doc.data().category;
      if (category) {
        categories.add(category);
      }
    });
    
    res.json(Array.from(categories));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Грешка при зареждане на категориите' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const productDoc = await db.collection('products').doc(req.params.id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Продуктът не е намерен' });
    }

    res.json({
      id: productDoc.id,
      ...productDoc.data()
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Грешка при зареждане на продукта' });
  }
});

// Create product (requires authentication middleware in actual use)
router.post('/', async (req, res) => {
  try {
    const productData = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('products').add(productData);
    const newProduct = await docRef.get();
    
    res.status(201).json({
      id: docRef.id,
      ...newProduct.data()
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Грешка при създаване на продукта' });
  }
});

// Activate product seeding route (uncomment if needed)
router.post('/seed', async (req, res) => {
  try {
    await seedProducts();
    res.json({ message: 'Products seeded successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error seeding products', error: error.toString() });
  }
});

module.exports = router; 