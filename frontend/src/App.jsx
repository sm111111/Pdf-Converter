import React, { useState } from "react";
import "./App.css";
import { jsPDF } from "jspdf";
import imageCompression from "browser-image-compression";

const App = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const compressedImages = [];

    for (const file of files) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.onloadend = () => {
          compressedImages.push(reader.result);

          if (compressedImages.length === files.length) {
            localStorage.setItem("imageData", JSON.stringify(compressedImages));
            setImages(compressedImages);
          }
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }
  };


  const generatePdf = () => {
    const storedImages = JSON.parse(localStorage.getItem("imageData"));

    if (!storedImages || storedImages.length === 0) {
      alert("No images found in localStorage!");
      return;
    }

    const pdf = new jsPDF();

    storedImages.forEach((img, index) => {
      if (index > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 10, 10, 180, 160);
    });

    pdf.save("converted.pdf");
  };

  return (
    <div className="App-container">
      <div className="inside-app">
        <div className="inputField">
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </div>

        {images.length > 0 && (
          <div className="previewInput">
            {images.map((img, index) => (
              <img key={index} src={img} alt={`Preview ${index}`} width="100" />
            ))}
          </div>
        )}

        <div className="submitAndConvert">
          <button onClick={generatePdf}>Convert img To Pdf</button>
        </div>
      </div>
    </div>
  );
};

export default App;
