const ImageUpload = ({ image, setImage }) => {
    const defaultImage = '/images/add_image_icon.jpg';
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result); // Store the base64 string of the image
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <label htmlFor="file-upload" className="block cursor-pointer">
        <div className="relative">
          <img
            src={image || defaultImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-300"
          />
          <input
            id="file-upload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
        </div>
      </label>
    );
  };
export default ImageUpload;  