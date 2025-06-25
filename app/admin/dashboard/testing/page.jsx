"use client";
import "@/public/assets/css/tailwind-cdn.css"

import { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import { Button, Box, TextField, Typography, Grid, Paper, Chip, CircularProgress } from '@mui/material';

const ProductUploadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    long_description: '',
    product_condition: 'new',
    categories: [],
    price: '',
    discounted_price: '',
    offer_name: '',
    problem: '',
    additional_information: '',
    tags: [],
  });

  // Image handling state
  const [files, setFiles] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        cropComplete: false,
        croppedImage: null
      }));
      setFiles([...files, ...newFiles]);
    },
    maxFiles: 10
  });

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800; // Fixed width for all cropped images
    canvas.height = 800; // Fixed height for all cropped images

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const saveCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        files[currentImageIndex].preview,
        croppedAreaPixels
      );

      const updatedFiles = [...files];
      updatedFiles[currentImageIndex] = {
        ...updatedFiles[currentImageIndex],
        cropComplete: true,
        croppedImage
      };
      setFiles(updatedFiles);

      if (currentImageIndex < files.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      }
    } catch (e) {
      console.error('Error cropping image', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('short_description', formData.short_description);
      formDataToSend.append('long_description', formData.long_description);
      formDataToSend.append('product_condition', formData.product_condition);
      formDataToSend.append('categories', JSON.stringify(formData.categories));
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discounted_price', formData.discounted_price);
      formDataToSend.append('offer_name', formData.offer_name);
      formDataToSend.append('problem', formData.problem);
      formDataToSend.append('additional_information', JSON.stringify(formData.additional_information));
      formDataToSend.append('tags', JSON.stringify(formData.tags));

      // Add cropped images
      files.forEach(file => {
        if (file.croppedImage) {
          formDataToSend.append('images', file.croppedImage, file.file.name);
        }
      });

      const response = await fetch('/api/product/add', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          short_description: '',
          long_description: '',
          product_condition: 'new',
          categories: [],
          price: '',
          discounted_price: '',
          offer_name: '',
          problem: '',
          additional_information: '',
          tags: [],
        });
        setFiles([]);
      } else {
        alert(`Error: ${data.error || 'Failed to add product'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (currentImageIndex >= newFiles.length) {
      setCurrentImageIndex(Math.max(0, newFiles.length - 1));
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Add New Product</Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 3, marginBottom: 3 }}>
              <Typography variant="h6" gutterBottom>Product Images</Typography>
              
              {files.length > 0 ? (
                <>
                  <Box sx={{ height: 400, position: 'relative', mb: 2 }}>
                    <Cropper
                      image={files[currentImageIndex]?.preview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1} // Square aspect ratio
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setZoom(Math.max(1, zoom - 0.1));
                      }}
                    >
                      Zoom Out
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setZoom(Math.min(3, zoom + 0.1));
                      }}
                    >
                      Zoom In
                    </Button>
                    <Button
                      variant="contained"
                      onClick={saveCrop}
                      disabled={!files[currentImageIndex] || files[currentImageIndex].cropComplete}
                    >
                      {files[currentImageIndex]?.cropComplete ? 'Cropped' : 'Crop Image'}
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {files.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          border: currentImageIndex === index ? '2px solid blue' : '1px solid gray',
                          borderRadius: 1,
                          overflow: 'hidden',
                          width: 60,
                          height: 60,
                          cursor: 'pointer'
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={file.preview}
                          alt={`preview ${index}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {file.cropComplete && (
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'green',
                            color: 'white',
                            fontSize: 10,
                            padding: '2px 4px'
                          }}>
                            ✓
                          </Box>
                        )}
                        <Button
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            minWidth: 20,
                            height: 20,
                            backgroundColor: 'red',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'darkred'
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                        >
                          ×
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed gray',
                    borderRadius: 1,
                    padding: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography>Drag & drop product images here, or click to select</Typography>
                  <Typography variant="caption">(Max 10 images, 800x800 recommended)</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>Product Details</Typography>
              
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Short Description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                required
                margin="normal"
                multiline
                rows={2}
              />
              
              <TextField
                fullWidth
                label="Long Description"
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                required
                margin="normal"
                multiline
                rows={4}
              />
              
              <TextField
                fullWidth
                select
                label="Product Condition"
                name="product_condition"
                value={formData.product_condition}
                onChange={handleChange}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </TextField>
              
              <TextField
                fullWidth
                label="Categories (comma separated)"
                name="categories"
                value={formData.categories.join(', ')}
                onChange={(e) => {
                  const categories = e.target.value.split(',').map(cat => cat.trim());
                  setFormData(prev => ({ ...prev, categories }));
                }}
                required
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: '$',
                }}
              />
              
              <TextField
                fullWidth
                label="Discounted Price (optional)"
                name="discounted_price"
                type="number"
                value={formData.discounted_price}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: '$',
                }}
              />
              
              <TextField
                fullWidth
                label="Offer Name (optional)"
                name="offer_name"
                value={formData.offer_name}
                onChange={handleChange}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Problem (if any)"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Additional Information (JSON format)"
                name="additional_information"
                value={formData.additional_information}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
              />
              
              <TextField
                fullWidth
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim());
                  setFormData(prev => ({ ...prev, tags }));
                }}
                margin="normal"
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isUploading || files.length === 0 || files.some(f => !f.cropComplete)}
                >
                  {isUploading ? (
                    <>
                      <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                      Uploading...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProductUploadForm;