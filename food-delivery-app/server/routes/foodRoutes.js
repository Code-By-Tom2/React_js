router.post('/seed', async (req, res) => {
    await Food.insertMany([
      { name: 'Pizza', price: 9.99, image: 'https://via.placeholder.com/150' },
      { name: 'Burger', price: 7.99, image: 'https://via.placeholder.com/150' },
      { name: 'Sushi', price: 12.99, image: 'https://via.placeholder.com/150' },
    ]);
    res.send('Foods seeded');
  });
  //routes