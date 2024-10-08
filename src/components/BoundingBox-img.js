import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
const BoundingBox = () => {
  const [imageSrc, setImageSrc] = useState(null); 
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [boxes, setBoxes] = useState([]); 
  const [isDrawing, setIsDrawing] = useState(false); 
  const [startPoint, setStartPoint] = useState(null); 
  const [currentBox, setCurrentBox] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null); 
  const [pointConfirmed, setPointConfirmed] = useState(false); 
  const canvasRef = useRef(null); 
  const navigate = useNavigate();

  // Handle PDF upload
  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedPdf(file);
      setPdfName(file.name);
      setErrorMessage("");
      resetPointSelection();  
    } else {
      setErrorMessage("Please upload a valid PDF file.");
    }
  };

  // Process the uploaded PDF and convert to an image
  const handleProcessPDF = async (file) => {  
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`http://127.0.0.1:5000/process_pdf`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        setErrorMessage("");
        resetPointSelection();  
      } else {
        const result = await response.json();
        setErrorMessage(result.message || "Error processing PDF.");
      }
    } catch (error) {
      setErrorMessage("Error: Unable to process PDF.");
      console.error("Error: Unable to process PDF.", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleusermodification =async()=>{
    let recentcreatedBox=boxes[boxes.length-1];
    console.log("boxes",boxes);
    try{
      console.log(selectedPoint,recentcreatedBox);
      const response =await fetch (`http://127.0.0.1:5000/user_modified_dimensions`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set correct content type
        },
        body:JSON.stringify({
          x:selectedPoint.x,
          y:selectedPoint.y,
          new_cord:[recentcreatedBox.x,recentcreatedBox.y,recentcreatedBox.x+recentcreatedBox?.width,recentcreatedBox.y+recentcreatedBox?.height]
        })
       
      })
      if(response.ok){
        alert("Change made succussfully");
        console.log("able to made the changes")
      }
      else{
        console.log("response of api is false");
      }
    }
    catch(err){
      console.log("Unable to invoke api")
    }
  
  }


  // Reset point selection and confirmation
  const resetPointSelection = () => {
    setSelectedPoint(null);
    setPointConfirmed(false);
  };

  // Handle clicking on the canvas to store the selected point
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If the point isn't confirmed yet, allow selection
    if (!pointConfirmed) {
      setSelectedPoint({ x, y });
    } 
    // If the point is confirmed, start drawing the rectangle freely
    else if (pointConfirmed && !isDrawing) {
      setIsDrawing(true);
      setStartPoint({ x, y }); // Start drawing at the current point
      setCurrentBox({ x, y, width: 0, height: 0 });
    }
  };
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    // Calculate width and height based on the start point and current mouse position
    const width = x - startPoint.x;
    const height = y - startPoint.y;
  
    // Only update currentBox dimensions if it's being drawn
    setCurrentBox({
      x: startPoint.x,
      y: startPoint.y,
      width: width,
      height: height,
    });
  
    console.log(`Current Box Dimensions: x: ${startPoint.x}, y: ${startPoint.y}, width: ${width}, height: ${height}`);
  };
  
  const handleMouseUp = () => {
    if (isDrawing) {
      // Ensure that the width and height are positive before adding
      if (currentBox && currentBox.width !== 0 && currentBox.height !== 0) {
        // Save the box only if it has non-zero dimensions
        setBoxes((prevBoxes) => [...prevBoxes, currentBox]);
        console.log("Final Box Added:", currentBox);
      } else {
        console.log("Attempted to add a zero-dimension box, skipping.");
      }
  
      // Stop drawing
      setIsDrawing(false);
      setCurrentBox(null);
    }
  };
  
  // Handle confirming the selected point
  const handleConfirmPoint = () => {
    if (selectedPoint) {
      setPointConfirmed(true); // User confirms they selected the correct point
    }
  };
  const moveTOlabel=()=>{
    navigate('/label');
  }

  // Draw the image and rectangles on the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      // Draw all rectangles
      boxes.forEach((box) => {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
      });

      // Draw the currently drawing rectangle
      if (isDrawing && currentBox) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      }

      // Highlight the selected point if it exists
      if (selectedPoint) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(selectedPoint.x, selectedPoint.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    };
  };

  useEffect(() => {
    if (imageSrc) {
      drawCanvas();
    }
  }, [imageSrc, boxes, currentBox, selectedPoint]);

  return (
    <div className="flex flex-col w-full p-4 mx-auto overflow-x-hidden">
      <h1 className="mb-4 mx-auto text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Processed Engineering
        </span>{' '}
        Machine Drawing
      </h1>

      <div className="relative h-5/6 ">
        {imageSrc && (
          <div
            className='relative p-4 m-auto w-11/12 h-5/6 overflow-auto'
          >
            {/* Scrollable container */}
            <div className='relative'>
              <img
                src={imageSrc}
                alt="Processed PDF"
                className='block w-full'
              />

              {/* Canvas overlay for drawing */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className='absolute top-0 left-0 cursor-crosshair pointer-events-auto'
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        {/* Confirmation button */}
        {!pointConfirmed && selectedPoint && (
                  <button className=" border text-gray-900 mx-auto w-full sm:w-2/12 md:w-10/12 lg:w-8/12 mt-3 mb-3 bg-green-400 focus:border-gray-300
                      hover:bg-green-500 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm 
                      px-3 py-1.5 sm:text-hidden"
                      onClick={handleConfirmPoint}
                      >
                     
                      <span className="sm:inline-block">Confirm Selected Point</span>
                      </button>
        )}
      </div>
 { pdfName &&(

   <button className=" border text-gray-900 mx-auto w-full sm:w-2/12 md:w-10/12 lg:w-8/12  bg-white focus:border-gray-300
   hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm 
   px-3 py-1.5 mb-4 "  
   onClick={() => handleProcessPDF(selectedPdf)}
   disabled={!selectedPdf || isProcessing}
   >
          
            <span className=" sm:inline-block"> {isProcessing ? "Processing..." : "Process PDF"}</span>
            </button>
        )  }

      {/* Updated Dropzone */}
          <div className="flex items-center justify-center mt-2 mx-auto w-full sm:w-2/12 md:w-10/12 lg:w-8/12  h-24 ">
         <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
           <div className="flex flex-col items-center justify-center pt-3 pb-3">
             <svg className="w-8 h-8  text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
//             </svg>
             <p className=" text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
             <p className="text-xs text-gray-500 dark:text-gray-400">PDF only (MAX. 5MB)</p>
           </div>
          <input id="dropzone-file" type="file" onChange={handlePdfUpload} className="hidden" />
        </label>
      </div>

      {/* Display PDF Name and Error Message Below the Dropzone */}

    
      <div className="mt-2 text-center">
        {pdfName && <p className="text-gray-500 dark:text-gray-400">{pdfName}</p>}
        {errorMessage && <p className="text-xl text-red-500">{errorMessage}</p>}
      </div>

      {
        imageSrc &&(

        
      
      <div className='flex  mx-auto w-full sm:w-2/12 md:w-10/12 lg:w-8/12 mt-5 '>
      <button className=" border mr-2 text-gray-900 mx-auto w-full sm:w-2/12 md:w-10/12 lg:w-8/12  bg-white focus:border-gray-300
            hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm 
            px-3 py-1.5 mb-4 "  
            onClick={handleusermodification}
       
        >
          
            <span className=" ml-1 sm:inline-block">User Modification</span>
            </button>
            <button className=" border text-gray-900 mx-auto w-full sm:w-2/12 md:w-10/12 lg:w-8/12  bg-white focus:border-gray-300
            hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm 
            px-3 py-1.5 mb-4 "  
            onClick={moveTOlabel}
            
        >     
            <span className="ml-1 sm:inline-block">Next</span>
            </button>
      </div>
  )}
    </div>
  );
};

export default BoundingBox;
