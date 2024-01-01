import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/ProductPage.css'; // Make sure this CSS file includes the new styles

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const { guid } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5232/api/Item/getItem/${guid}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (guid) {
      fetchProduct();
    }
  }, [guid]);

  if (!product) {
    return <div>Loading...</div>;
  }


   // Determine which additional details to display based on the item type
   const additionalDetails = product.ItemType === 1
   ? (
     <p className="product-camera-specs">
       Focal Length: {product.CameraFocalLength} | 
       Max Shutter Speed: 1/{product.CameraMaxShutterSpeed} | 
       Megapixel: {product.CameraMegapixel} | 
       Film Format: {product.CameraFilmFormat}
     </p>
   ) : product.ItemType === 0
   ? (
     <p className="product-film-specs">
       Color State: {product.FilmColorState === 0 ? 'Black and White' : 'Color Film'} | 
       Format: {product.FilmFormat} | 
       ISO: {product.FilmISO} | 
       Exposure: {product.FilmExposure}
     </p>
   ) : null;

  // The title image might be null, so use optional chaining and provide a fallback image if necessary
  const titleImageUrl = product.TitleImageUrl || 'path_to_fallback_image';
  // Ensure additional images is always an array, even if it's null or undefined
  const additionalImageUrls = product.AdditionalImageUrls || [];

  return (
    <div className="product-page">
      <h1 className="product-title">{product.Title}</h1>

      <div className="product-images">
      <img src={titleImageUrl} alt={product.Title} className="product-main-image" />
        {additionalImageUrls.map((additionalImageUrls, index) => (
          <img key={index} src={additionalImageUrls} alt={`${product.Title} additional ${index + 1}`} className="product-additional-image" />
        ))}
      </div>


      <div className="product-details">
        <p className="product-description">{product.Description}</p>
        <p className="product-quantity">Quantity Available: {product.Quantity}</p>
        <p className="product-price">Price: £{product.Price}</p>
        <p className="product-brand">Brand: {product.Brand}</p>
        <p className="product-availability">{product.IsAvailable ? 'In Stock' : 'Out of Stock'}</p>
        {additionalDetails}
      </div>

      <button className="add-to-cart-btn">Add to Cart - £{product.Price}</button>
    </div>
  );
};

export default ProductPage;
