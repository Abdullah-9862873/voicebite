require("dotenv").config();
const connectDB = require("./config/db");
const MenuItem = require("./models/MenuItem");

const menuData = [
  {
    name: "Cheeseburger",
    price: 7.99,
    category: "burgers",
    description: "Juicy cheeseburger with lettuce and tomato",
    image: "https://example.com/cheeseburger.jpg",
    discount: 10
  },
  {
    name: "Margherita Pizza",
    price: 9.99,
    category: "pizza",
    description: "Classic margherita with fresh basil",
    image: "https://example.com/margherita.jpg",
    discount: 0
  },
  {
    name: "Coca Cola",
    price: 1.99,
    category: "beverages",
    description: "Chilled soft drink",
    image: "https://example.com/coke.jpg",
    discount: 0
  },
  // Pizza
  { name: 'Margherita Pizza', price: 14.99, category: 'pizza', description: 'Fresh basil, tomato sauce, and buffalo mozzarella.' },
  { name: 'Pepperoni Blast', price: 16.99, category: 'pizza', description: 'Double pepperoni with extra mozzarella cheese.' },
  { name: 'Veggie Supreme', price: 15.99, category: 'pizza', description: 'Bell peppers, onions, olives, and mushrooms.' },

  // Pasta
  { name: 'Fettuccine Alfredo', price: 13.99, category: 'pasta', description: 'Creamy white sauce with parmesan and garlic.' },
  { name: 'Spaghetti Bolognese', price: 12.99, category: 'pasta', description: 'Rich meat sauce with herbs and fresh tomatoes.' },
  { name: 'Pesto Penne', price: 13.49, category: 'pasta', description: 'Fresh basil pesto with pine nuts and olive oil.' },

  // Traditionals
  { name: 'Chicken Fajita Pizza', price: 18.99, category: 'traditionals', description: 'Spicy fajita chicken, onions, and jalapeños.', discount: 10 },
  { name: 'Behari Kabab Pizza', price: 19.99, category: 'traditionals', description: 'Tender kabab chunks with special spicy sauce.' },
  { name: 'Chicken Tikka Pizza', price: 17.99, category: 'traditionals', description: 'Traditional tikka chunks with onions and green chilies.', discount: 15 },

  // Desserts & Beverages
  { name: 'Chocolate Lava Cake', price: 7.99, category: 'desserts', description: 'Warm chocolate cake with a gooey center.', discount: 5 },
  { name: 'New York Cheesecake', price: 8.49, category: 'desserts', description: 'Classic creamy cheesecake with strawberry topping.' },
  { name: 'Classic Coke', price: 2.49, category: 'beverages', description: 'Refreshing 500ml chilled soda drink beverage.' },
];


const seedDB = async () => {
  try {
    await connectDB();
    await MenuItem.deleteMany(); // optional: clear existing data
    const inserted = await MenuItem.insertMany(menuData);
    console.log(`Inserted ${inserted.length} menu items!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
