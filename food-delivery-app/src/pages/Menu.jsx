import React, { useEffect, useState } from 'react';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/foods')
      .then(res => res.json())
      .then(data => setFoodItems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {foodItems.map(food => (
        <FoodCard key={food._id} food={food} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default Menu;
