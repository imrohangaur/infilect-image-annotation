import React, { useEffect } from "react";
import { Rect, Transformer } from "react-konva";

const Annotation = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const transformRef = React.useRef();

    // Attach the transformer to the shape when selected
    useEffect(() => {
        if (isSelected) {
            // Attach the transformer to the selected shape
            transformRef.current.setNode(shapeRef.current);
            // Redraw the layer to reflect the changes
            transformRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    // Change cursor to "move" when hovering over the shape
    const onMouseEnter = event => {
        event.target.getStage().container().style.cursor = "move";
    };

    // Change cursor back to "crosshair" when leaving the shape
    const onMouseLeave = event => {
        event.target.getStage().container().style.cursor = "crosshair";
    };

    return (
        <React.Fragment>
            {/* The annotation rectangle */}
            <Rect
                fill="black"
                opacity={0.5}
                stroke="blue"
                onMouseDown={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onDragEnd={event => {
                    onChange({
                        ...shapeProps,
                        x: event.target.x(),
                        y: event.target.y()
                    });
                }}
                onTransformEnd={event => {
                    // Handle resizing using the transformer
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // Reset the scale
                    node.scaleX(1);
                    node.scaleY(1);

                    // Update shape properties including width and height
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY)
                    });
                }}
            />
            {/* Show transformer when the shape is selected */}
            {isSelected && <Transformer ref={transformRef} />}
        </React.Fragment>
    );
};

export default Annotation;
