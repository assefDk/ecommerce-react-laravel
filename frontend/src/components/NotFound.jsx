import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import '../assets/css/NotFound.css'



function NotFound() {
  const [sunPos, setSunPos] = useState({ top: "10%", left: "80%" });
  const [earthPos, setEarthPos] = useState({ top: "70%", left: "12%" });
  const [planetPos, setPlanetPos] = useState({ top: "10%", left: "8%" });

  const [jumpSun, setJumpSun] = useState(false);
  const [jumpEarth, setJumpEarth] = useState(false);
  const [jumpPlanet, setJumpPlanet] = useState(false);

  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const randomPercent = () => `${Math.floor(Math.random() * 70 + 10)}%`;

    setSunPos({ top: randomPercent(), left: randomPercent() });
    setEarthPos({ top: randomPercent(), left: randomPercent() });
    setPlanetPos({ top: randomPercent(), left: randomPercent() });
  }, []);

  const handleJump = (type) => {
    if (type === "sun") {
      setJumpSun(true);
      setTimeout(() => setJumpSun(false), 700);
    } else if (type === "earth") {
      setJumpEarth(true);
      setTimeout(() => setJumpEarth(false), 700);
    } else {
      setJumpPlanet(true);
      setTimeout(() => setJumpPlanet(false), 700);
    }
  };

  const handleMouseDown = (e, type) => {
    setDragging(type);
    const rect = e.target.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const x = e.clientX - offset.x;
    const y = e.clientY - offset.y;

    const newPos = { top: `${y}px`, left: `${x}px` };

    if (dragging === "sun") setSunPos(newPos);
    else if (dragging === "earth") setEarthPos(newPos);
    else if (dragging === "planet") setPlanetPos(newPos);
  };

  const handleMouseUp = () => setDragging(null);

  return (
    <div
      className="space"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star second"></div>

      <div
        className={`sun ${jumpSun ? "bounce" : ""}`}
        style={{ top: sunPos.top, left: sunPos.left }}
        onClick={() => handleJump("sun")}
        onMouseDown={(e) => handleMouseDown(e, "sun")}
      ></div>

      <div
        className={`earth ${jumpEarth ? "bounce" : ""}`}
        style={{ top: earthPos.top, left: earthPos.left }}
        onClick={() => handleJump("earth")}
        onMouseDown={(e) => handleMouseDown(e, "earth")}
      ></div>

      <div
        className={`planet ${jumpPlanet ? "bounce" : ""}`}
        style={{ top: planetPos.top, left: planetPos.left }}
        onClick={() => handleJump("planet")}
        onMouseDown={(e) => handleMouseDown(e, "planet")}
      ></div>

      <div className="astronaut"></div>

      <div className="content">
        <h1>404</h1>
        <h2>Lost in Space</h2>
        <p>The page you are looking for vanished into the universe.</p>

        <Link to="/" className="btn-home">
          🚀 Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;