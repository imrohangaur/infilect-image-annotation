import './App.css';
import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import ImageFromUrl from "./ImageFromUrl";
import Annotation from "./Annotation";

// List of image URLs to be displayed
const imageUrls = [
  "/assets/Image 1.jpg",
  "/assets/Image 2.jpg",
  "/assets/Image 3.webp",
  "/assets/Image 4.jpg",
  "/assets/Image 5.jpg"
];

function App() {
  // State variables to manage annotations and other data
  const [annotations, setAnnotations] = useState({});
  const [currentAnnotations, setCurrentAnnotations] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);  //keep tracks of the image
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [selectedId, selectAnnotation] = useState(null);
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Function to navigate to the previous image
  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      //fetch the old annotations if saved
      setCurrentAnnotations(annotations[imageUrls[currentImageIndex - 1]] || []);
    }
  };

  // Function to navigate to the next image
  const handleNext = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      //fetch the old annotations if saved
      setCurrentAnnotations(annotations[imageUrls[currentImageIndex + 1]] || []);
    }
  };

  // Function to save annotations for the current image
  const handleSave = () => {
    setAnnotations({
      ...annotations,
      [imageUrls[currentImageIndex]]: currentAnnotations
    });
  };

  // Function to handle downloading annotations as a JSON file
  const handleSubmit = () => {
    const json = JSON.stringify(annotations, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "annotations.json";
    link.click();
    // Clean up by revoking the URL after the download
    URL.revokeObjectURL(url);
  };

  // Function to handle mouse down event for creating new annotation
  const handleMouseDown = event => {
    if (selectedId === null && newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuidv4();
      setNewAnnotation([{ x, y, width: 0, height: 0, id }]);
    }
  };

  // Function to handle mouse move event for updating new annotation's dimensions
  const handleMouseMove = event => {
    if (selectedId === null && newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuidv4();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          id
        }
      ]);
    }
  };

  // Function to handle mouse up event for finalizing new annotation
  const handleMouseUp = () => {
    if (selectedId === null && newAnnotation.length === 1) {
      const newAnnotations = [...currentAnnotations, ...newAnnotation];
      setCurrentAnnotations(newAnnotations);
      setNewAnnotation([]);
    }
  };

  // Function to handle mouse enter event for changing cursor on the canvas
  const handleMouseEnter = event => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  // Function to handle key down event for deleting selected annotation
  const handleKeyDown = event => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      if (selectedId !== null) {
        const newAnnotations = currentAnnotations.filter(
          annotation => annotation.id !== selectedId
        );
        setCurrentAnnotations(newAnnotations);
      }
    }
  };

  // Combine existing and new annotations for rendering
  const annotationsToDraw = [...currentAnnotations, ...newAnnotation];

  return (
    <div tabIndex={1} onKeyDown={handleKeyDown} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', height: '100vh', overflow: 'scroll', backgroundColor: 'black' }}>
      <Stage
        width={canvasMeasures.width}
        height={canvasMeasures.height}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className='card'
      >
        <Layer>
          <ImageFromUrl
            setCanvasMeasures={setCanvasMeasures}
            imageUrl={imageUrls[currentImageIndex]}
            onMouseDown={() => {
              // deselect when clicked on empty area
              selectAnnotation(null);
            }}
          />
          {annotationsToDraw.map((annotation, i) => {
            return (
              <Annotation
                key={i}
                shapeProps={annotation}
                isSelected={annotation.id === selectedId}
                onSelect={() => {
                  selectAnnotation(annotation.id);
                }}
                onChange={newAttrs => {
                  const rects = currentAnnotations.slice();
                  rects[i] = newAttrs;
                  setCurrentAnnotations(rects);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '50%', flexWrap: 'wrap' }}>
        <button id="btn" onClick={handlePrevious} disabled={currentImageIndex === 0}>Previous</button>
        <button id="btn" onClick={handleNext} disabled={currentImageIndex === imageUrls.length - 1}>Next</button>
        <button id="btn" onClick={handleSave}>Save</button>
        <button id="btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default App;
