const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
  
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total })
    })
      .then(res => res.json())
      .then(data => {
        alert('Order placed successfully!');
        window.location.href = '/';
      })
      .catch(err => console.error(err));
  };
<button
  onClick={handleCheckout}
  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
>
  Place Order
</button>
  