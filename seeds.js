const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Grocery = require('./models/grocery')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/portfolio');
    console.log('Mongodb接続OK')
}

const seedGroceries = [
    { name: 'りんご', quantity: 10, userId: '67a9f85896a922ecabf92098' },
    { name: 'バナナ', quantity: 5, userId: '67a9f85896a922ecabf92098' },
    { name: 'にんじん', quantity: 8, userId: '67a9f85896a922ecabf92098' },
    { name: 'じゃがいも', quantity: 12, userId: '67a9f85896a922ecabf92098' },
    { name: 'トマト', quantity: 7, userId: '67a9f85896a922ecabf92098' }
];

const seedDB = async () => {
    try {
        await Grocery.deleteMany({});
        console.log('Existing data cleared');
        await Grocery.insertMany(seedGroceries);
        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();