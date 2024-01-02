import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams
import '../Styles/EditItem.css';

const EditItem = ({ match }) => {
 const { guid } = useParams(); // Use useParams to get the guid
  const [itemType, setItemType] = useState('Film'); // Initialize this based on your logic
  const [itemDetails, setItemDetails] = useState({
    Title: '',
    Description: '',
    Brand: '',
    Price: 0,
    Quantity: 0,
    IsAvailable: false,
    TitleImageUrl: '',
    AdditionalImageUrls: [],
    ItemBrandId: 0,
  });

  const [filmDetails, setFilmDetails] = useState({
    FilmColorState: 0,
    FilmFormat: 35,
    FilmISO: 200,
    FilmExposure: 36,
  });

  const [cameraDetails, setCameraDetails] = useState({
    CameraFocalLength: 35,
    CameraMaxShutterSpeed: 100,
    CameraMegapixel: 24,
    CameraFilmFormat: 35,
  });

  useEffect(() => {
    const fetchItem = async () => {
        try {
          const response = await axios.get(`http://localhost:5232/api/Item/getItem/${guid}`);
          const data = response.data;
      
          // Set common item details
          setItemDetails({
            Title: data.Title,
            Description: data.Description,
            Quantity: data.Quantity,
            Price: data.Price,
            Brand: data.Brand,
            ItemBrandId: data.ItemBrandId,
            IsAvailable: data.IsAvailable,
            TitleImageUrl: data.TitleImageUrl,
            AdditionalImageUrls: data.AdditionalImageUrls,
          });
      
          // Check the ItemType and set details accordingly
          if (data.ItemType === 0) { // Assuming 0 is for Film
            setItemType('Film');
            setFilmDetails({
              FilmColorState: data.FilmColorState,
              FilmFormat: data.FilmFormat,
              FilmISO: data.FilmISO,
              FilmExposure: data.FilmExposure,
            });
          } else if (data.ItemType === 1) { // Assuming 1 is for Camera
            setItemType('Camera');
            // Set cameraDetails here similarly if you have camera-specific properties
          }
      
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };
      
    fetchItem();
  }, [guid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemDetails({ ...itemDetails, [name]: value });
  };

  const handleTitleImageUrlChange = (e) => {
    setItemDetails({ ...itemDetails, TitleImageUrl: e.target.value });
  };

  const handleAdditionalImageUrlsChange = (e) => {
    const urls = e.target.value.split(',').map(url => url.trim());
    setItemDetails({ ...itemDetails, AdditionalImageUrls: urls });
  };

  const handleFilmInputChange = (e) => {
    const { name, value } = e.target;
    setFilmDetails({
      ...filmDetails,
      [name]: parseInt(value, 10) // Parse as integer
    });
  };
  

  const handleCameraInputChange = (e) => {
    const { name, value } = e.target;
    setCameraDetails({
      ...cameraDetails,
      [name]: parseInt(value, 10) // Parse as integer
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const editItemDTO = {
        ItemDetails: itemDetails,
        FilmDetails: filmDetails,
        CameraDetails: cameraDetails,
      };

      await axios.put(`http://localhost:5232/api/Item/editItem/${guid}`, editItemDTO, {
        withCredentials: true // Include this to send cookies with the request
      });
  
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className="edit-item-container">
      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit} className="edit-item-form">
        {/* General Item Details */}
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="Title"
            value={itemDetails.Title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="Description"
            value={itemDetails.Description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Brand:</label>
          <input
            type="text"
            name="Brand"
            value={itemDetails.Brand}
            onChange={handleInputChange}
          />
          </div>

          <div className="form-group">
          <label>Brand Id:</label>
          <input
            type="number"
            name="ItemBrandId"
            value={itemDetails.ItemBrandId}
            onChange={handleInputChange}
          />
          
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="Price"
            value={itemDetails.Price}
            onChange={handleInputChange}
            step="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Is Available:</label>
          <input
            type="checkbox"
            name="IsAvailable"
            checked={itemDetails.IsAvailable}
            onChange={(e) => {
              setItemDetails({ ...itemDetails, IsAvailable: e.target.checked });
            }}
          />
        </div>
        <div className="form-group">
          <label>Title Image URL:</label>
          <input
            type="text"
            name="TitleImageUrl"
            value={itemDetails.TitleImageUrl}
            onChange={handleTitleImageUrlChange}
          />
        </div>
        <div className="form-group">
          <label>Additional Image URLs (comma-separated):</label>
          <input
            type="text"
            name="AdditionalImageUrls"
            value={itemDetails.AdditionalImageUrls.join(', ')}
            onChange={handleAdditionalImageUrlsChange}
          />
        </div>
  
        {/* Film Specific Details */}
        {itemType === 'Film' && (
          <>
            <div className="form-group">
              <label>Film Color State:</label>
              <input
                type="number"
                name="FilmColorState"
                value={filmDetails.FilmColorState}
                onChange={handleFilmInputChange}
              />
            </div>
            <div className="form-group">
              <label>Format:</label>
              <input
                type="number"
                name="FilmFormat"
                value={filmDetails.FilmFormat}
                onChange={handleFilmInputChange}
              />
            </div>
            <div className="form-group">
              <label>ISO:</label>
              <input
                type="number"
                name="FilmISO"
                value={filmDetails.FilmISO}
                onChange={handleFilmInputChange}
              />
            </div>
            <div className="form-group">
              <label>Exposure:</label>
              <input
                type="number"
                name="FilmExposure"
                value={filmDetails.FilmExposure}
                onChange={handleFilmInputChange}
              />
            </div>
          </>
        )}
  
        {/* Camera Specific Details */}
        {itemType === 'Camera' && (
          <>
            <div className="form-group">
              <label>Focal Length:</label>
              <input
                type="number"
                name="CameraFocalLength"
                value={cameraDetails.CameraFocalLength}
                onChange={handleCameraInputChange}
              />
            </div>
            <div className="form-group">
              <label>Max Shutter Speed:</label>
              <input
                type="number"
                name="CameraMaxShutterSpeed"
                value={cameraDetails.CameraMaxShutterSpeed}
                onChange={handleCameraInputChange}
              />
            </div>
            <div className="form-group">
              <label>Megapixel:</label>
              <input
                type="number"
                name="CameraMegapixel"
                value={cameraDetails.CameraMegapixel}
                onChange={handleCameraInputChange}
              />
            </div>
            <div className="form-group">
              <label>Accepted Film Format:</label>
              <input
                type="number"
                name="CameraFilmFormat"
                value={cameraDetails.CameraFilmFormat}
                onChange={handleCameraInputChange}
              />
            </div>
          </>
        )}
  
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
export default EditItem;

