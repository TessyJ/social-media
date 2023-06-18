const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');

const users = [
    {
        username: 'Adam',
        email: 'adam@gmail.com',
    },
    {
        username: 'Bean',
        email: 'bean@gmail.com'
    },
    {
        username: 'Carol',
        email: 'carol@gmail.com'
    },
    {
        username: 'Dennis',
        email: 'dennis@gmail.com'
    },
    {
        username: 'Eric',
        email: 'eric@gmail.com'
    },
    {
        username: 'Frank',
        email: 'frank@gmail.com'
    },
    {
        username: 'Gabe',
        email: 'gabe@gmail.com'
    },
    {
        username: 'Hillary',
        email: 'hillary@gmail.com'
    },
    {
        username: 'Issac',
        email: 'issac@gmail.com'
    },
    {
        username: 'Jonas',
        email: 'jonas@gmail.com'
    },
    {
        username: 'Kelvin',
        email: 'kelvin@gmail.com'
    },
  ]

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    await Thought.deleteMany({});
    await User.deleteMany({});
  
    await User.collection.insertMany(users);

    console.info('Seeding complete! 🌱');
    process.exit(0);
  });
  