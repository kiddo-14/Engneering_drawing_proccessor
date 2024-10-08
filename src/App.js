// import React, { useState, useRef } from "react";

// function App() {
//   const [image, setImage] = useState(null); 
//   const [boxes, setBoxes] = useState([]); 
//   const [isDrawing, setIsDrawing] = useState(false); 
//   const [startPoint, setStartPoint] = useState({ x: 0, y: 0 }); 
//   const [currentBox, setCurrentBox] = useState(null); 
//   const [description, setDescription] = useState(""); 
//   const [showInput, setShowInput] = useState(false); 
//   const imageRef = useRef(null); 

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       setBoxes([]); 
//       setShowInput(false);
//     }
//   };

//   const handleMouseDown = (e) => {
//     const rect = imageRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setStartPoint({ x, y });
//     setCurrentBox({ x, y, width: 0, height: 0 });
//     setIsDrawing(true);
//     setShowInput(false);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing) return;
//     const rect = imageRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setCurrentBox({
//       x: startPoint.x,
//       y: startPoint.y,
//       width: x - startPoint.x,
//       height: y - startPoint.y,
//     });
//   };

//   const handleMouseUp = () => {
//     if (isDrawing) {
//       setIsDrawing(false);
//       setShowInput(true); 
//     }
//   };

//   const handleDescriptionChange = (e) => {
//     setDescription(e.target.value);
//   };

//   const saveBox = () => {
//     setBoxes((prevBoxes) => [
//       ...prevBoxes,
//       { ...currentBox, description: description || "No description" },
//     ]);
//     setDescription("");
//     setShowInput(false);
//     setCurrentBox(null);
//   };
//   const handleInputKeyDown=(e)=>{
//     if(e.key==='Enter'){
//       saveBox(); 
//     }
//   }
             
//   return (
//     <div className="flex flex-col items-center py-8">
//       <h1 className="text-3xl font-bold mb-4">Image Box Selector with Description</h1>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageUpload}
//         className="mb-4 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
//       />

//       <div className="relative">
//         {image && (
//           <img
//             src={image}
//             alt="Upload"
//             ref={imageRef}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             className="w-full min-h-screen object-cover shadow-lg"
//           />
//         )}

//         {boxes.map((box, index) => (
//           <div
//             key={index}
//             className="absolute border-2 border-red-500 bg-red-300 bg-opacity-20 group"
//             style={{
//               left: `${box.x}px`,
//               top: `${box.y}px`,
//               width: `${box.width}px`,
//               height: `${box.height}px`,
//             }}
//           >
//             <div className="hidden group-hover:flex absolute z-10 left-0 w-24   top-full mt-1 bg-gray-800 text-white text-sm p-2 rounded-lg">
//               {box.description}
//             </div>
//           </div>
//         ))}

//         {isDrawing && currentBox && (
//           <div
//             className="absolute border-2 border-blue-500 border-dashed"
//             style={{
//               left: `${currentBox.x}px`,
//               top: `${currentBox.y}px`,
//               width: `${currentBox.width}px`,
//               height: `${currentBox.height}px`,
//             }}
//           />
//         )}
//       </div>
             
//       {showInput && (
//         <div className="mt-4 w-5/12 flex flex-col items-center">
//           <input
//             type="text"
//             value={description}
//             onChange={handleDescriptionChange}
//             placeholder="Enter description"
//             onKeyDown={handleInputKeyDown}
//             className="px-4 py-2 border w-11/12  border-gray-400 rounded-lg mb-2"
//           />
//           <button
//             onClick={saveBox}
        
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             Save Box with Description
//           </button>
//         </div>
//       )}

   
//       {/* <div className="mt-8">
//         <h2 className="text-2xl font-semibold mb-4 ">Box Coordinates & Descriptions</h2>
//         {boxes.map((box, index) => (
//           <p key={index} className="text-lg border rounded-full   mb-4 p-2">
//             Box {index + 1}: x: {box.x}, y: {box.y}, width: {box.width}, height:{" "}
//             {box.height}, description: {box.description}
//           </p>
//         ))}
//       </div> */}
//     </div>
//   );
// }

// export default App;


import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BoundingBox from './components/BoundingBox-img'
import Header from './components/Header'
import Label from './components/label';
import MapTable from './components/Table';

const App = () => {
  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BoundingBox />} />
        <Route path="/label" element={<Label />} />
        <Route path="/table" element={<MapTable />} />
      </Routes>
    </Router>
    </>
  )
}

export default App