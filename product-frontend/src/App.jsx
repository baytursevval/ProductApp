import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        const initialColors = {};
        data.forEach((_, i) => {
          initialColors[i] = "yellow";
        });
        setSelectedColors(initialColors);
      })
      .catch((err) => console.error("API hatası:", err));
  }, []);

  const nextSlide = () => {
    if (startIndex + 4 < products.length) setStartIndex(startIndex + 4);
  };

  const prevSlide = () => {
    if (startIndex - 4 >= 0) setStartIndex(startIndex - 4);
  };

  const visibleProducts = products.slice(startIndex, startIndex + 4);

  const handleColorChange = (productIndex, color) => {
    setSelectedColors({ ...selectedColors, [productIndex]: color });
  };

  return (
    <div className="app-container">
      <h1>Product List</h1>

      <div className="slider">
        <button onClick={prevSlide} disabled={startIndex === 0}>◀</button>

        <div className="products-container">
          {visibleProducts.map((p, index) => {
            const globalIndex = startIndex + index;
            const selectedColor = selectedColors[globalIndex] || "yellow";

            return (
              <div key={globalIndex} className="product-card">
                <img src={p.images[selectedColor]} alt={p.name} />
                <h2>{p.name}</h2>

                <p>${p.priceUsd} USD</p>

                {/* Popülerlik yıldız ve puan */}
                <div className="star-rating-wrapper">
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`star ${p.popularityOutOf5 >= i ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="star-score">{p.popularityOutOf5.toFixed(1)}/5</span>
                </div>

                {/* Renk seçenekleri */}
                <div className="color-picker">
                  <div className="color-buttons">
                    {Object.keys(p.images).map((color) => {
                      const colorMap = {
                        yellow: "#FFD966",
                        rose: "#F4B6C2",
                        gray: "#C0C0C0",
                        blue: "#6BAED6",
                        green: "#A3D9A5"
                      };
                      const bgColor = colorMap[color] || color;

                      return (
                        <button
                          key={color}
                          onClick={() => handleColorChange(globalIndex, color)}
                          className={selectedColor === color ? "selected" : ""}
                          style={{ backgroundColor: bgColor }}
                        />
                      );
                    })}
                  </div>

                  <div className="color-name">{selectedColor}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={nextSlide} disabled={startIndex + 4 >= products.length}>▶</button>
      </div>
    </div>
  );
}

export default App;
