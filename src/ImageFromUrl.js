import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const ImageFromUrl = ({
    imageUrl,
    setCanvasMeasures,
    onMouseDown,
    onMouseUp,
    onMouseMove
}) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        // Create a new image object and set its source URL
        const imageToLoad = new window.Image();
        imageToLoad.src = imageUrl;

        // Function to handle image load event
        const onImgLoad = () => {
            setImage(imageToLoad);
            setCanvasMeasures({
                width: window.innerWidth * 0.9,
                height: window.innerHeight * 0.85
            });
        }

        // Listen for the "load" event of the image and call onImgLoad
        imageToLoad.addEventListener("load", onImgLoad);

        //cleanup
        return () => imageToLoad.removeEventListener("load", onImgLoad);
    }, [imageUrl, setImage, setCanvasMeasures]);

    return (
        <Image
            image={image}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            height={window.innerHeight}
            width={window.innerWidth}
        />
    );
};

export default ImageFromUrl;
