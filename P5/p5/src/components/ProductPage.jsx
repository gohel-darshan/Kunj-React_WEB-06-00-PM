import React, { useState } from "react";
import "./ProductPage.css";

// Add missing Star component
const Star = ({ size = 20, fill = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline" }}
  >
    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
  </svg>
);

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Product Images Carousel */}
          <img
            src="https://img3.junaroad.com/uiproducts/10605309/zoom_0-1462803997.jpg"
            alt="Main Product"
            className="rounded-2xl w-full"
          />
          {/* Color Variant Thumbnails */}
          <div className="flex gap-2 mt-4">
            {[
              { color: "black", url: "https://m.media-amazon.com/images/I/71I-cik1CyL._AC_UL1500_.jpg" },
              { color: "grey", url: "https://www.dhresource.com/0x0/f2/albu/g8/M01/95/19/rBVaVF6DvX6AbgfZAAGBDIT4Dcc699.jpg/sleeve-boy-tops-autumn-luxury-men-shirts.jpg" },
              { color: "white", url: "https://www.simonjersey.com/images/mens-long-sleeve-mandarin-collar-shirt-black-p167-3047_zoom.jpg" }
            ].map((item, i) => (
              <img
                key={item.color}
                src={item.url}
                alt={`Color ${item.color}`}
                className="w-20 h-20 object-cover rounded-xl border cursor-pointer"
                style={{ border: selectedColor === item.color ? '2px solid rgb(147, 51, 234)' : '1px solid #ccc' }}
                onClick={() => setSelectedColor(item.color)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Long Sleeve Overshirt Hoodie</h1>
          <p className="text-xl text-gray-800 mb-2">£489.00</p>
          <div className="flex items-center text-yellow-500 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
            <span className="ml-2 text-gray-600">4.8 (320)</span>
          </div>

          <p className="mb-4 text-gray-600">
            Comfortable and stylish long sleeve hoodie made with premium fabric.
          </p>

          {/* Color Options */}
          <div className="mb-4">
            <p className="font-medium mb-2">Colour</p>
            <div className="flex gap-2">
              {["black", "grey", "white"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: "32px", 
                    height: "32px", 
                    borderRadius: "50%", 
                    backgroundColor: color,
                    border: `2px solid ${selectedColor === color ? "rgb(147, 51, 234)" : "#ccc"}`
                  }}
                ></button>
              ))}
            </div>
          </div>

          {/* Size Options */}
          <div className="mb-4">
            <p className="font-medium mb-2">Size</p>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  style={{
                    backgroundColor: selectedSize === size ? "rgb(147, 51, 234)" : "transparent",
                    color: selectedSize === size ? "white" : "rgb(147, 51, 234)",
                    border: "1px solid rgb(147, 51, 234)",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 1rem"
                  }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <p className="font-medium mb-2">Quantity</p>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded-md"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <button style={{
              backgroundColor: "rgb(147, 51, 234)",
              color: "white",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem"
            }}>Add to Cart</button>
            <button style={{
              backgroundColor: "transparent",
              color: "rgb(147, 51, 234)",
              border: "1px solid rgb(147, 51, 234)",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem"
            }}>Buy Now</button>
          </div>

          <p className="text-sm text-gray-500">
            Secure payment guarantee.
          </p>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 recommended-grid">
          {[
            "https://i.pinimg.com/736x/12/2e/34/122e34cbfc9db204583acf3886802127.jpg",
            "https://tse3.mm.bing.net/th?id=OIP.YWqlyq1-rJ53RvvYc4JrnAHaNK&pid=Api&P=0&h=180",
            "https://tse3.mm.bing.net/th?id=OIP.49jzYWwP9o4pFGxGDI_q6wHaNK&pid=Api&P=0&h=180",
            "https://tse4.mm.bing.net/th?id=OIP.HmDVUiFTJvLKUcGZdtehvAHaJQ&pid=Api&P=0&h=180"
          ].map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border p-4">
              <img
                src={img}
                alt={`Recommended product ${i + 1}`}
                className="recommended-img"
              />
              <p className="text-sm font-medium">Product Name {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
