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
          <select
            name="Brand"
            value={itemDetails.Brand}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Brand</option>
            <option value="Kodak">Kodak</option>
            <option value="Ilford">Ilford</option>
            <option value="AgfaPhoto">AgfaPhoto</option>
            <option value="Olympus">Olympus</option>
          </select>
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
              <label>Color State:</label>
              <select
                name="FilmColorState"
                value={filmDetails.FilmColorState}
                onChange={handleFilmInputChange}
                required
              >
                <option value="">Select Color State</option>
                <option value="0">Black and White</option>
                <option value="1">Color</option>
              </select>
            </div>

            <div className="form-group">
              <label>Format:</label>
              <select
                name="FilmFormat"
                value={filmDetails.FilmFormat}
                onChange={handleFilmInputChange}
                required
              >
                <option value="35">35mm</option>
                <option value="120">120mm</option>
                {/* Add more film format options as needed */}
              </select>
            </div>

            <div className="form-group">
              <label>ISO:</label>
              <select
                name="FilmISO"
                value={filmDetails.FilmISO}
                onChange={handleFilmInputChange}
                required
              >
                <option value="100">ISO 100</option>
                <option value="200">ISO 200</option>
                <option value="400">ISO 400</option>
                <option value="800">ISO 800</option>
                {/* Add more ISO options as needed */}
              </select>
            </div>

            <div className="form-group">
              <label>Exposure:</label>
              <select
                name="FilmExposure"
                value={filmDetails.FilmExposure}
                onChange={handleFilmInputChange}
                required
              >
                <option value="24">24</option>
                <option value="36">36</option>
                {/* Add more exposure options as needed */}
              </select>
            </div>
          </>
        )}

        {itemType === 'Camera' && (
          <>
            <div className="form-group">
              <label>Focal Length:</label>
              <select
                name="CameraFocalLength"
                value={cameraDetails.CameraFocalLength}
                onChange={handleCameraInputChange}
                required
              >
                <option value="0">0mm</option>
                <option value="35">35mm</option>
                <option value="50">50mm</option>
                {/* Add more focal length options as needed */}
              </select>
            </div>

            <div className="form-group">
              <label>Max Shutter Speed:</label>
              <select
                name="CameraMaxShutterSpeed"
                value={cameraDetails.CameraMaxShutterSpeed}
                onChange={handleCameraInputChange}
                required
              >
                <option value="100">1/100</option>
                <option value="250">1/250</option>
                <option value="500">1/500</option>
                <option value="1000">1/1000</option>
                <option value="2000">1/2000</option>
                {/* Add more max shutter speed options as needed */}
              </select>
            </div>

            <div className="form-group">
              <label>Accepted Film Format:</label>
              <select
                name="CameraFilmFormat"
                value={cameraDetails.CameraFilmFormat}
                onChange={handleCameraInputChange}
                required
              >
                <option value="35">35mm</option>
                <option value="120">120mm</option>
                {/* Add more film format options as needed */}
              </select>
            </div>
          </>
        )}

        <button type="submit">Create Item</button>
      </form>
    </div>
  );
};

export default CreateItem;
