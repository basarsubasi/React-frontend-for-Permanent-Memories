import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/ProductPage.css'; // Ensure this file is updated with new styles

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(''); // This will be used to hold the currently selected image
  const { guid } = useParams();
  const [quantityToPurchase, setQuantityToPurchase] = useState(1); // State to track the quantity to purchase

  const user = JSON.parse(sessionStorage.getItem('user'));
  const userRoles = user?.Roles || []; // Default to an empty array if Roles is not present
  const isCustomer = userRoles.includes('Customer');


  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5232/api/Item/getItem/${guid}`);
        setProduct(response.data);
        setSelectedImage(response.data.TitleImageUrl);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (guid) {
      fetchProduct();
    }
  }, [guid]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.TitleImageUrl || product.AdditionalImageUrls?.[0]);
    }
  }, [product]);

  if (!product) {
    return <div className="loading">Loading...</div>; // Style this for better UX
  }

 
  // Function to add an item to the cart
  const addToCart = () => {
    if (!product || !product.IsAvailable || product.Quantity < quantityToPurchase) {
      alert('This item is not available in the desired quantity.');
      return;
    }

    let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(cartItem => cartItem.GUID === product.GUID);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantityToPurchase += quantityToPurchase;
    } else {
      cart.push({ ...product, quantityToPurchase });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart!');
  };


  // Extracted function for rendering additional details
  const renderAdditionalDetails = () => {
    switch (product.ItemType) {
      case 1: // Camera specs
        return (
          <div className="product-camera-specs">
            <p>Focal Length: {product.CameraFocalLength} mm</p>
            <p>Max Shutter Speed: 1/{product.CameraMaxShutterSpeed} sec</p>
            <p>Film Format: {product.CameraFilmFormat}</p>
          </div>
        );
  
      case 0: // Film specs
        return (
          <div className="product-film-specs">
            <p>Color State: {product.FilmColorState === 0 ? 'Black and White' : 'Color Film'}</p>
            <p>Format: {product.FilmFormat} mm</p>
            <p>ISO: {product.FilmISO}</p>
            <p>Exposure: {product.FilmExposure} shots</p>
          </div>
        );
  
      default:
        return null;
    }
  };

  


 

  

  return (
    <div className="product-page">
      <h1 className="product-title">{product.Title}</h1>
      <p className="product-description-title">Product Description:</p>
      <div className="product-description-section">
  <p className="product-description">{product.Description}</p>
      </div>


      <div className="product-image-gallery">
    <img src={selectedImage || 'default-placeholder-image.jpg'} alt={product.Title} className="product-main-image" />
    <div className="product-thumbnail-container">
      {product.TitleImageUrl && (
        <img
          src={product.TitleImageUrl}
          alt={`${product.Title} main`}
          onClick={() => setSelectedImage(product.TitleImageUrl)}
          className={`product-thumbnail ${selectedImage === product.TitleImageUrl ? 'active' : ''}`}
        />
      )}
      {product.AdditionalImageUrls && product.AdditionalImageUrls.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`${product.Title} additional ${index + 1}`}
          onClick={() => setSelectedImage(imageUrl)}
          className={`product-thumbnail ${selectedImage === imageUrl ? 'active' : ''}`}
        />
      ))}
    </div>
  </div>

  
      <div className="product-details">
      <p className={`product-availability ${product.IsAvailable ? 'in-stock' : 'out-of-stock'}`}>
       {product.IsAvailable ? 'In Stock' : 'Out of Stock'} </p>

      
        <p className="product-quantity">Quantity Available: {product.Quantity}</p>
        <p className="product-price">Price: ₺{product.Price}</p>
        <p className="product-brand">Brand: {product.Brand}</p>
        {renderAdditionalDetails()}
      </div>

      

      {product.IsAvailable && isCustomer && (
          <>
            <div className="product-quantity-selection">
              <label htmlFor="quantity">Quantity: </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.Quantity}
                value={quantityToPurchase}
                onChange={(e) => setQuantityToPurchase(Math.max(1, parseInt(e.target.value, 10)))}
                className="quantity-input"
              />
            </div>
            <button onClick={addToCart} className="add-to-cart-btn">
              Add to Cart - ₺{product.Price}
            </button>
          </>
        )}
    </div>
  );
};

export default ProductPage;
