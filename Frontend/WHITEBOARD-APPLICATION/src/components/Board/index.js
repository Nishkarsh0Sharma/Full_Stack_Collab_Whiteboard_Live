import {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import rough from "roughjs";
import boardContext from '../../store/board-context';
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from '../../constants';
import toolboxContext from '../../store/toolbox-context';
import classes from './index.module.css';
import { updateCanvas } from '../../utils/api';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke } from '../../utils/element';
import { AuthContext } from '../../store/auth-context';

function Board(){
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const { id: canvasId } = useParams();
  const { token } = useContext(AuthContext);
  const [updateError, setUpdateError] = useState(null);
  const {
    elements, 
    toolActionType,
    boardMouseDownHandler, 
    boardMouseMoveHandler, 
    boardMouseUpHandler,
    textAreaBlurHandler, 
    undo,
    redo,
  } = useContext(boardContext);

  const {toolboxState} = useContext(toolboxContext);
  
  // Track when elements first load to force re-render
  const [hasInitialElements, setHasInitialElements] = useState(false);
  
  useEffect(() => {
    if (elements && elements.length > 0 && !hasInitialElements) {
      console.log('🚀 Initial elements loaded, forcing canvas re-render');
      setHasInitialElements(true);
      
      // Force immediate re-render
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const event = new CustomEvent('forceCanvasRender');
          canvas.dispatchEvent(event);
        }
      }, 10);
    }
  }, [elements, hasInitialElements]);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Force initial clear
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      console.log('🎨 Canvas initialized:', canvas.width, 'x', canvas.height);
    }
  } ,  [] );

  useEffect( ()=> {
    function handleKeyDown(event){
      if( event.ctrlKey && event.key === 'z' ){
        undo();
      }else if( event.ctrlKey && event.key === 'y' ){
        redo();
      }
    }

    document.addEventListener("keydown" , handleKeyDown);
    return () => document.removeEventListener("keydown" , handleKeyDown);
  } , [undo , redo] );

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const roughCanvas = rough.canvas(canvas);
    const context = canvas.getContext('2d');

    // Always clear the canvas first
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    // If no elements, just clear and return
    if (!elements || elements.length === 0) {
      context.restore();
      return;
    }

    console.log('🎨 Rendering elements on canvas:', elements.length, 'elements');
    
    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW: {
          let roughElement;

          if (element.type === TOOL_ITEMS.LINE || element.type === TOOL_ITEMS.ARROW) {
            roughElement = roughCanvas.line(
              element.x1, element.y1, element.x2, element.y2,
              { stroke: element.stroke, strokeWidth: element.size }
            );
          } else if (element.type === TOOL_ITEMS.RECTANGLE) {
            roughElement = roughCanvas.rectangle(
              element.x1, element.y1,
              element.x2 - element.x1, element.y2 - element.y1,
              { stroke: element.stroke, fill: element.fill || null, strokeWidth: element.size, fillStyle: 'solid' }
            );
          } else if (element.type === TOOL_ITEMS.CIRCLE) {
            const width = element.x2 - element.x1;
            const height = element.y2 - element.y1;
            roughElement = roughCanvas.ellipse(
              element.x1 + width / 2, element.y1 + height / 2, width, height,
              { stroke: element.stroke, fill: element.fill || null, strokeWidth: element.size, fillStyle: 'solid' }
            );
          }

          if (roughElement) roughCanvas.draw(roughElement);

          if (element.type === TOOL_ITEMS.ARROW) {
            const angle = Math.atan2(element.y2 - element.y1, element.x2 - element.x1);
            const arrowLength = 20;
            const arrowAngle = Math.PI / 6;

            context.beginPath();
            context.moveTo(element.x2, element.y2);
            context.lineTo(
              element.x2 - arrowLength * Math.cos(angle - arrowAngle),
              element.y2 - arrowLength * Math.sin(angle - arrowAngle)
            );
            context.moveTo(element.x2, element.y2);
            context.lineTo(
              element.x2 - arrowLength * Math.cos(angle + arrowAngle),
              element.y2 - arrowLength * Math.sin(angle + arrowAngle)
            );
            context.strokeStyle = element.stroke;
            context.lineWidth = element.size;
            context.stroke();
          }
          break;
        }

        case TOOL_ITEMS.BRUSH: {
          if (element.points?.length > 0) {
            const stroke = getStroke(element.points, {
              size: element.size || 3,
              thinning: 0.5,
              smoothing: 0.5,
              streamline: 0.5,
            });
            const pathData = getSvgPathFromStroke(stroke);
            const path = new Path2D(pathData);
            context.fillStyle = element.stroke || '#000';
            context.fill(path);
          }
          break;
        }

        case TOOL_ITEMS.TEXT: {
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke || '#000';
          context.fillText(element.text || '', element.x1, element.y1);
          break;
        }

        default:
          console.warn(`Unknown element type: ${element.type}`);
      }
    });

    context.restore();

    return () => context.clearRect(0, 0, canvas.width, canvas.height);
  }, [elements]);

  useEffect( ()=>{
    if( TOOL_ACTION_TYPES.WRITING === toolActionType ){
      setTimeout(()=> textAreaRef.current?.focus(), 0);
    }
  } , [toolActionType] );

  const handleMouseDown = (event) => {
    boardMouseDownHandler(event , toolboxState); 
  };

  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  };

  const handleMouseUp = async () => {
    // Let BoardProvider handle all updates via WebSocket
    boardMouseUpHandler();
    
    // Removed direct API calls - BoardProvider handles this via WebSocket
    // This prevents conflicts between WebSocket and direct API updates
  };

  const optimizeElementsForServer = (elements) => {
    return elements.map(element => {
      const optimizedElement = { ...element };
      delete optimizedElement.roughEle;
      delete optimizedElement.path;
      
      if (element.type === TOOL_ITEMS.BRUSH && element.points?.length > 50) {
        const skipFactor = Math.floor(element.points.length / 50);
        optimizedElement.points = element.points.filter((_, index) => index % skipFactor === 0);
      }
      return optimizedElement;
    });
  };

  return (
    <>
      { toolActionType === TOOL_ACTION_TYPES.WRITING && <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur= { (event) => textAreaBlurHandler(event.target.value ) }
      />}
      {updateError && (
        <div className={classes.errorMessage}>
          {updateError}
        </div>
      )}
      <canvas 
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
