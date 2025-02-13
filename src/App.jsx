import './App.css';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './components/Button';
import ItemData from './components/ItemsListData';
import PageTitle from './components/PageTitle';

export default function App() {
  const [itemsCart, setItemsCart] = useState(ItemData);

  function handleEmptyCart() {
    const confirmed = window.confirm('Are you sure you want to empty cart?');

    if (confirmed) {
      setItemsCart([]);
    }
  }

  return (
    <div className='page-wrapper'>
      <Header className={'header'} />
      <main className='column main'>
        <PageTitle>Shopping Cart</PageTitle>
        {itemsCart.length > 0 ? (
          <div className='cart-container'>
            <Cart
              itemsCart={itemsCart}
              setItemsCart={setItemsCart}
              handleEmptyCart={handleEmptyCart}
            />
            <CartDiscount>Apply Discount Code</CartDiscount>
            <Sidebar itemsCart={itemsCart} />
          </div>
        ) : (
          <>
            <h2>
              Your cart is empty. Click on the buton below to continue shopping.
            </h2>
            <Button
              className={'primary'}
              onClick={() => setItemsCart(ItemData)}
            >
              Continue Shopping
            </Button>
          </>
        )}
      </main>
      <Footer className={'footer'} />
    </div>
  );
}

function Cart({ itemsCart, setItemsCart, handleEmptyCart }) {
  return (
    <div className='cart'>
      <div className='cart-items'>
        {itemsCart.map((item) => (
          <CartItem item={item} key={item.id} setItemsCart={setItemsCart} />
        ))}
      </div>
      <div className='actions'>
        <Button className={'secondary'} onClick={handleEmptyCart}>
          Empty Cart
        </Button>
      </div>
    </div>
  );
}

function CartItem({ item, setItemsCart }) {
  const [qty, setQty] = useState(item.qty || 1);
  const { title, image, id, price } = item;

  // Update subtotal only when itemQty changes
  useEffect(() => {
    setItemsCart((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  }, [qty, setItemsCart, id]);

  function handleDeleteItem(id) {
    const confirmed = window.confirm('Are you sure you want to remove item?');

    if (confirmed)
      setItemsCart((itemsCart) => itemsCart.filter((item) => item.id !== id));
  }

  const handleIncreaseQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const handleDecreaseQty = () => {
    setQty((prevQty) => (prevQty > 1 ? prevQty - 1 : 1)); // Prevents quantity from going below 1
  };

  return (
    <div className='cart-item'>
      <div className='item-info'>
        <div className='image'>
          <img src={image} width={150} height={150} alt={title} />
        </div>
        <div className='info'>
          <div className='product-item-name'>
            <a href={' '}>{title}</a>
            <div className='item-actions'>
              <Button className={'delete'} onClick={() => handleDeleteItem(id)}>
                ✖️
              </Button>
            </div>
          </div>
          <div className='options'>
            {Object.entries(item).map(([key, value]) =>
              value &&
              typeof value === 'string' &&
              value.trim() &&
              key !== 'id' &&
              key !== 'title' &&
              key !== 'popular' &&
              key !== 'description' &&
              key !== 'image' ? (
                <div key={key}>
                  <span className='label'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                  </span>
                  <span className='value'>{value}</span>
                </div>
              ) : null
            )}
          </div>
          <div className='price-summary'>
            <div className='qty'>
              <span className='label'>Qty: </span>
              <button onClick={handleDecreaseQty} className='qty-btn'>
                -
              </button>
              <input
                type='text'
                value={qty}
                onChange={(e) =>
                  setQty(Number(e.target.value.replace(/[^0-9]/gi, '')) || 1)
                }
              />
              <button onClick={handleIncreaseQty} className='qty-btn'>
                +
              </button>
            </div>
            <div className='price-info'>
              <div className='price'>
                <span className='label'>Price: </span>
                <span className='value'>$ {price.toFixed(2)}</span>
              </div>
              <div className='subtotal'>
                <span className='label'>Subtotal: </span>
                <span className='value'>$ {(price * qty).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ itemsCart }) {
  return (
    <div className='sidebar'>
      <CartSummary itemsCart={itemsCart} />
    </div>
  );
}

function CartSummary({ itemsCart = [] }) {
  const subtotal = itemsCart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const shipping = 5.0; // Example fixed shipping value
  const taxRate = 0.1; // Example tax rate of 10%

  const tax = subtotal * taxRate; // Calculate tax
  const total = subtotal + shipping + tax; // Calculate total

  return (
    <div className='cart-summary'>
      <h2 className='title'>Summary</h2>
      <div className='item subtotal'>
        <span className='label'>Subtotal: </span>
        <span className='value'>${subtotal.toFixed(2)}</span>
      </div>
      <div className='item shipping'>
        <span className='label'>Shipping: </span>
        <span className='value'>${shipping.toFixed(2)}</span>
      </div>
      <div className='item tax'>
        <span className='label'>Tax: </span>
        <span className='value'>$ {tax.toFixed(2)}</span>
      </div>
      <div className='item total'>
        <span className='label'>Total: </span>
        <span className='value'>${total.toFixed(2)}</span>
      </div>
      <Button className={'primary checkout'}>Checkout</Button>
    </div>
  );
}

function CartDiscount({ children }) {
  return <div className='cart-discount'>{children}</div>;
}
