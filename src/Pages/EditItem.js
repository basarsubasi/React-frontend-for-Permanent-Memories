import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/EditItem.css';

const EditItem = ({ match }) => {
  const { guid } = useParams();
  const [itemType, setItemType] = useState('Film');
  const [itemDetails, setItemDetails] = useState({
    Title: '',
    Description: '',
    Brand: '',
    Price: 0,
    Quantity: 0,
    IsAvailable: false,
    TitleImageUrl: '',
    AdditionalImageUrls: [],
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

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5232/api/Item/getItem/${guid}`);
        const data = response.data;

        setItemDetails({
          Title: data.Title,
          Description: data.Description,
          Quantity: data.Quantity,
          Price: data.Price,
          Brand: data.Brand,
          IsAvailable: data.IsAvailable,
          TitleImageUrl: data.TitleImageUrl,
          AdditionalImageUrls: data.AdditionalImageUrls,
        });

        if (data.ItemType === 0) {
          setItemType('Film');
          setFilmDetails({
            FilmColorState: data.FilmColorState,
            FilmFormat: data.FilmFormat,
            FilmISO: data.FilmISO,
            FilmExposure: data.FilmExposure,
          });
        } else if (data.ItemType === 1) {
          setItemType('Camera');
          setCameraDetails({
            CameraFocalLength: data.CameraFocalLength,
            CameraMaxShutterSpeed: data.CameraMaxShutterSpeed,
            CameraFilmFormat: data.CameraFilmFormat,
          });
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
      [name]: parseInt(value, 10),
    });
  };

  const handleCameraInputChange = (e) => {
    const { name, value } = e.target;
    setCameraDetails({
      ...cameraDetails,
      [name]: parseInt(value, 10),
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
        withCredentials: true,
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
          <select
            name="Brand"
            value={itemDetails.Brand}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Brand</option>
            <option value="Kodak">Kodak</option>
            <option value="Ilford">Ilford</option>
            <option value="Fujifilm">Fujifilm</option>
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

        {/* Camera Specific Details */}
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
                <option value="90">90mm</option>
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
                <option value="120">1/120</option>
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditItem;
