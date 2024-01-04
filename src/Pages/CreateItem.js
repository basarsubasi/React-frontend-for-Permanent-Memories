import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/CreateItem.css'; // Create the stylesheet as needed

const CreateItem = () => {
  const [itemType, setItemType] = useState('Film'); // Default to Film type
  const [itemDetails, setItemDetails] = useState({
    Title: '',
    Description: '',
    Brand: '', // Added Brand property
    Price: '', // Added Price property
    IsAvailable: true, // Added IsAvailable property (default to true or false based on your preference)
    TitleImageUrl: '', // Added TitleImageUrl property
    AdditionalImageUrls: [], // Added AdditionalImageUrls property as an array
    // Add common item details here
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
    CameraFilmFormat: 35,
  });

  const handleItemTypeChange = (e) => {
    setItemType(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemDetails({
      ...itemDetails,
      [name]: value,
    });
  };

  const handleTitleImageUrlChange = (e) => {
    const { value } = e.target;
    setItemDetails({
      ...itemDetails,
      TitleImageUrl: value,
    });
  };

  const handleAdditionalImageUrlsChange = (e) => {
    const { value } = e.target;
    // Split the comma-separated string into an array
    const urlsArray = value.split(',').map(url => url.trim());
    
    setItemDetails({
      ...itemDetails,
      AdditionalImageUrls: urlsArray,
    });
  };

  

  const handleFilmInputChange = (e) => {
    const { name, value } = e.target;
    setFilmDetails({
      ...filmDetails,
      [name]: parseInt(value, 10) || 0, // Parse as integer, default to 0 if NaN
    });
  };
  
  const handleCameraInputChange = (e) => {
    const { name, value } = e.target;
    setCameraDetails({
      ...cameraDetails,
      [name]: parseInt(value, 10) || 0, // Parse as integer, default to 0 if NaN
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the data based on item type
      let itemData = {};
      if (itemType === 'Film') {
        itemData = { ItemDetails: itemDetails, FilmDetails: filmDetails };
      } else if (itemType === 'Camera') {
        itemData = { ItemDetails: itemDetails, CameraDetails: cameraDetails };
      }

      // Send a POST request to the createItem endpoint
      const response = await axios.post(`http://localhost:5232/api/Item/createItem/${itemType}`, itemData, {
        withCredentials: true
      });

      console.log(response.data);
    } catch (error) {
      console.error('Item creation failed:', error);
    }
  };


  return (
    <div className="create-item-container">
      <h2>Create New Item</h2>
      <form onSubmit={handleSubmit} className="create-item-form">
        <div className="form-group">
          <label>Item Type:</label>
          <select name="itemType" value={itemType} onChange={handleItemTypeChange}>
            <option value="Film">Film</option>
            <option value="Camera">Camera</option>
            {/* Add other item types here */}
          </select>
        </div>
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
            required
          />
        </div>

        <div className="form-group">
          <label>Brand:</label>
          <input
            type="text"
            name="Brand"
            value={itemDetails.Brand}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="Quantity"
            value={itemDetails.Quantity}
            onChange={handleInputChange}
            step="1"
            required
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
          <label>IsAvailable:</label>
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
          <label>Title Image Url:</label>
          <input
            type="text"
            name="TitleImageUrl"
            value={itemDetails.TitleImageUrl}
            onChange={handleTitleImageUrlChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Additional Image URLs (comma-separated):</label>
          <input
            type="text"
            name="AdditionalImageUrls"
            value={itemDetails.AdditionalImageUrls.join(', ')}
            onChange={handleAdditionalImageUrlsChange}
            required
          />
        </div>

        {itemType === 'Film' && (
          <>
            <div className="form-group">
              <label>Film Color State:</label>
              <input
                type="number"
                name="FilmColorState"
                value={filmDetails.FilmColorState}
                onChange={handleFilmInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Format:</label>
              <input
                type="number"
                name="FilmFormat"
                value={filmDetails.FilmFormat}
                onChange={handleFilmInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>ISO:</label>
              <input
                type="number"
                name="FilmISO"
                value={filmDetails.FilmISO}
                onChange={handleFilmInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Exposure:</label>
              <input
                type="number"
                name="FilmExposure"
                value={filmDetails.FilmExposure}
                onChange={handleFilmInputChange}
                required
              />
            </div>
          </>
        )}
        {itemType === 'Camera' && (
          <>
            <div className="form-group">
              <label>Focal Length:</label>
              <input
                type="number"
                name="CameraFocalLength"
                value={cameraDetails.CameraFocalLength}
                onChange={handleCameraInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Max Shutter Speed:</label>
              <input
                type="number"
                name="CameraMaxShutterSpeed"
                value={cameraDetails.CameraMaxShutterSpeed}
                onChange={handleCameraInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Accepted Film Format:</label>
              <input
                type="number"
                name="CameraFilmFormat"
                value={cameraDetails.CameraFilmFormat}
                onChange={handleCameraInputChange}
                required
              />
            </div>
          </>
        )}
        <button type="submit">Create Item</button>
      </form>
    </div>
  );
};

export default CreateItem;
