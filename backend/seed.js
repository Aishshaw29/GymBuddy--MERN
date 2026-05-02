import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Workout from './models/Workout.js';
import Order from './models/Order.js';

dotenv.config();

const DEMO_PASSWORD = 'password123';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Clear existing data
const clearDatabase = async () => {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Workout.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Database cleared');
};

// Seed Users
const seedUsers = async () => {
    console.log('👥 Seeding users...');

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    const users = [
        {
            name: 'Admin User',
            email: 'admin@demo.com',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
            isApproved: true
        },
        {
            name: 'John Seller',
            email: 'seller@demo.com',
            password: hashedPassword,
            role: 'SELLER',
            isActive: true,
            isApproved: true
        },
        {
            name: 'Mike Johnson',
            email: 'user@demo.com',
            password: hashedPassword,
            role: 'USER',
            isActive: true,
            isApproved: true
        },
        {
            name: 'Sarah Williams',
            email: 'sarah@demo.com',
            password: hashedPassword,
            role: 'USER',
            isActive: true,
            isApproved: true
        },
        {
            name: 'Pending Seller',
            email: 'pending@demo.com',
            password: hashedPassword,
            role: 'SELLER',
            isActive: true,
            isApproved: false
        },
        {
            name: 'Protein King Supplements',
            email: 'seller2@demo.com',
            password: hashedPassword,
            role: 'SELLER',
            isActive: true,
            isApproved: true
        }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
};

// Seed Products
const seedProducts = async (sellers) => {
    console.log('📦 Seeding products...');

    const seller1 = sellers.find(u => u.email === 'seller@demo.com');
    const seller2 = sellers.find(u => u.email === 'seller2@demo.com');

    const products = [
        // Seller 1 Products
        {
            sellerId: seller1._id,
            name: 'Whey Protein Isolate 2kg',
            category: 'Protein',
            price: 2499,
            description: 'Premium quality whey protein isolate with 90% protein content. Perfect for muscle building and recovery. Available in chocolate and vanilla flavors.',
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller1._id,
            name: 'Micronized Creatine Monohydrate',
            category: 'Creatine',
            price: 899,
            description: 'Pure micronized creatine monohydrate for enhanced strength and performance. 5g per serving, unflavored powder.',
            stock: 75,
            imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller1._id,
            name: 'Pre-Workout Extreme Energy',
            category: 'Pre-workout',
            price: 1299,
            description: 'Explosive pre-workout formula with caffeine, beta-alanine, and citrulline. Fruit punch flavor for maximum energy.',
            stock: 40,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller1._id,
            name: 'Daily Multivitamin Complex',
            category: 'Multivitamins',
            price: 599,
            description: 'Complete daily multivitamin with essential vitamins and minerals. Supports overall health and immunity.',
            stock: 100,
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
            isActive: true
        },

        // Seller 2 Products
        {
            sellerId: seller2._id,
            name: 'Plant-Based Protein Powder',
            category: 'Protein',
            price: 1899,
            description: 'Vegan protein blend from pea, rice, and hemp. 25g protein per serving. Natural vanilla flavor.',
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1597318120214-cc1e8e6d4b8b?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller2._id,
            name: 'Casein Protein Night Formula',
            category: 'Protein',
            price: 2199,
            description: 'Slow-digesting casein protein, perfect for nighttime recovery. Rich chocolate flavor.',
            stock: 25,
            imageUrl: 'https://images.unsplash.com/photo-1526571726728-e6951f2d7c2e?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller2._id,
            name: 'Creatine HCL Capsules',
            category: 'Creatine',
            price: 1099,
            description: 'Advanced creatine hydrochloride in easy-to-take capsules. Better absorption than regular creatine.',
            stock: 60,
            imageUrl: 'https://images.unsplash.com/photo-1550534791-2677533605ab?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller2._id,
            name: 'Pump Pre-Workout (Stimulant-Free)',
            category: 'Pre-workout',
            price: 1499,
            description: 'Stimulant-free pre-workout with citrulline and nitric oxide boosters. Perfect for evening workouts.',
            stock: 35,
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller2._id,
            name: 'Omega-3 Fish Oil',
            category: 'Multivitamins',
            price: 799,
            description: 'High-quality omega-3 fatty acids from deep-sea fish. Supports heart and brain health.',
            stock: 80,
            imageUrl: 'https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=300&h=300&fit=crop',
            isActive: true
        },
        {
            sellerId: seller2._id,
            name: 'Vitamin D3 + K2',
            category: 'Multivitamins',
            price: 499,
            description: 'Essential vitamin D3 combined with K2 for bone health and immune support.',
            stock: 90,
            imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop',
            isActive: true
        }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    return createdProducts;
};

// Seed Workouts
const seedWorkouts = async (users) => {
    console.log('🏋️ Seeding workouts...');

    const user1 = users.find(u => u.email === 'user@demo.com');
    const user2 = users.find(u => u.email === 'sarah@demo.com');

    const today = new Date();
    const workouts = [];

    // User 1 workouts (last 7 days)
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        if (i % 2 === 0) {
            // Strength training
            workouts.push({
                userId: user1._id,
                date,
                exerciseName: ['Bench Press', 'Squats', 'Deadlift', 'Shoulder Press'][Math.floor(Math.random() * 4)],
                workoutType: 'strength',
                sets: 4,
                reps: 10,
                weight: 60 + Math.random() * 20,
                duration: 45,
                caloriesBurned: 300 + Math.random() * 100
            });
        } else {
            // Cardio
            workouts.push({
                userId: user1._id,
                date,
                exerciseName: ['Running', 'Cycling', 'Swimming'][Math.floor(Math.random() * 3)],
                workoutType: 'cardio',
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 30,
                caloriesBurned: 250 + Math.random() * 150
            });
        }
    }

    // User 2 workouts (last 5 days with gaps)
    [0, 1, 3, 5, 6].forEach(i => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        workouts.push({
            userId: user2._id,
            date,
            exerciseName: ['Yoga', 'Pilates', 'HIIT', 'Cycling'][Math.floor(Math.random() * 4)],
            workoutType: i % 2 === 0 ? 'strength' : 'cardio',
            sets: i % 2 === 0 ? 3 : 0,
            reps: i % 2 === 0 ? 15 : 0,
            weight: i % 2 === 0 ? 20 : 0,
            duration: 40,
            caloriesBurned: 200 + Math.random() * 100
        });
    });

    const createdWorkouts = await Workout.insertMany(workouts);
    console.log(`✅ Created ${createdWorkouts.length} workouts`);
    return createdWorkouts;
};

// Seed Orders
const seedOrders = async (users, products) => {
    console.log('🛍️ Seeding orders...');

    const user1 = users.find(u => u.email === 'user@demo.com');
    const user2 = users.find(u => u.email === 'sarah@demo.com');

    const orders = [
        // User 1 orders
        {
            userId: user1._id,
            products: [
                {
                    productId: products[0]._id,
                    sellerId: products[0].sellerId,
                    name: products[0].name,
                    price: products[0].price,
                    quantity: 2
                },
                {
                    productId: products[2]._id,
                    sellerId: products[2].sellerId,
                    name: products[2].name,
                    price: products[2].price,
                    quantity: 1
                }
            ],
            totalAmount: products[0].price * 2 + products[2].price,
            status: 'Delivered',
            deliveryAddress: {
                street: '123 Fitness Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400001',
                country: 'India'
            },
            orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
            userId: user1._id,
            products: [
                {
                    productId: products[1]._id,
                    sellerId: products[1].sellerId,
                    name: products[1].name,
                    price: products[1].price,
                    quantity: 1
                }
            ],
            totalAmount: products[1].price,
            status: 'Shipped',
            deliveryAddress: {
                street: '123 Fitness Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400001',
                country: 'India'
            },
            orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },

        // User 2 orders
        {
            userId: user2._id,
            products: [
                {
                    productId: products[4]._id,
                    sellerId: products[4].sellerId,
                    name: products[4].name,
                    price: products[4].price,
                    quantity: 1
                },
                {
                    productId: products[8]._id,
                    sellerId: products[8].sellerId,
                    name: products[8].name,
                    price: products[8].price,
                    quantity: 2
                }
            ],
            totalAmount: products[4].price + products[8].price * 2,
            status: 'Processing',
            deliveryAddress: {
                street: '456 Health Avenue',
                city: 'Bangalore',
                state: 'Karnataka',
                zipCode: '560001',
                country: 'India'
            },
            orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
            userId: user2._id,
            products: [
                {
                    productId: products[3]._id,
                    sellerId: products[3].sellerId,
                    name: products[3].name,
                    price: products[3].price,
                    quantity: 3
                }
            ],
            totalAmount: products[3].price * 3,
            status: 'Pending',
            deliveryAddress: {
                street: '456 Health Avenue',
                city: 'Bangalore',
                state: 'Karnataka',
                zipCode: '560001',
                country: 'India'
            },
            orderDate: new Date() // Today
        }
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ Created ${createdOrders.length} orders`);
    return createdOrders;
};

// Main seed function
const seedDatabase = async () => {
    console.log('🌱 Starting database seeding...\n');

    try {
        await connectDB();
        await clearDatabase();

        const users = await seedUsers();
        const products = await seedProducts(users);
        const workouts = await seedWorkouts(users);
        const orders = await seedOrders(users, products);

        console.log('\n✅ Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${users.length} users created`);
        console.log(`   - ${products.length} products created`);
        console.log(`   - ${workouts.length} workouts created`);
        console.log(`   - ${orders.length} orders created\n`);

        console.log('🔑 Demo Login Credentials:');
        console.log('   Admin:  admin@demo.com / password123');
        console.log('   Seller: seller@demo.com / password123');
        console.log('   User:   user@demo.com / password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed
seedDatabase();
