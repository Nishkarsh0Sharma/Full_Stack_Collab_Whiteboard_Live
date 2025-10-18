import { ARROW_LENGTH, TOOL_ITEMS } from '../constants';
import rough from 'roughjs/bin/rough';
import { getArrowHeadsCoordinates , isPointCloseToLine } from './math';
import getStroke from 'perfect-freehand';
const gen = rough.generator();


export const createElement = (id,x1,y1,x2,y2,{type,stroke,fill,size}) => {
    const element = {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        stroke,
        fill,
        size,
    };
    let options = {
        speed : id + 1, // id can't be zero
        fillStyle: 'solid',
    };

    if(stroke){
        options.stroke = stroke;
    }

    if(fill){
        options.fill = fill;
    }
    if(size){
        options.strokeWidth = size;
    }

    switch (type) {
        case TOOL_ITEMS.BRUSH:{
            const brushELement = {
                id,
                points: [{x : x1 , y : y1}],
                path: new Path2D(getSvgPathFromStroke(getStroke([{x:x1, y:y1}], { size: size || 5 }))),
                type,
                stroke,
                size: size || 5,
            };
            return brushELement;
        }
        case TOOL_ITEMS.LINE:{
            element.roughEle = gen.line(x1, y1, x2, y2, options);
            return element;
        }

        case TOOL_ITEMS.RECTANGLE:{
            element.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
            return element;
        }

        case TOOL_ITEMS.CIRCLE:{
            const cx = (x1+x2)/2 , cy = (y1+y2)/2;
            const width = x2-x1 , height = y2-y1;
            element.roughEle = gen.ellipse(cx,cy,width,height,options);
            return element;
        }

        case TOOL_ITEMS.ARROW:{
            const {x3,y3,x4,y4} = getArrowHeadsCoordinates(x1, y1, x2, y2 , ARROW_LENGTH);
            const points = [
                [x1,y1],
                [x2,y2],
                [x3,y3],
                [x2,y2],
                [x4,y4],
            ];
            element.roughEle = gen.linearPath(points , options);
            return element;
        }

        case TOOL_ITEMS.ERASER:{
            return element;
        }

        case TOOL_ITEMS.TEXT: {
            element.text = "";
            return element;
        }

        default:
            throw new Error(`Unknown tool type: ${type}`);
    }
};

export const isPointNearElement = (element , pointX , pointY) => {
    const {x1, y1, x2, y2, type , fill} = element;
    switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
            // Handle single-click (zero-length) arrows/lines as a point hit-test
            if (x1 === x2 && y1 === y2) {
                const dx = pointX - x1;
                const dy = pointY - y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                // Use a threshold that scales a bit with size so thicker tools are easier to erase
                const threshold = Math.max(10, (element.size || 1) * 2);
                return distance <= threshold;
            }
            return isPointCloseToLine( x1, y1, x2, y2, pointX, pointY );
        
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
            return(
                isPointCloseToLine( x1, y1, x2, y1, pointX, pointY ) ||
                isPointCloseToLine( x2, y1, x2, y2, pointX, pointY ) ||
                isPointCloseToLine( x2, y2, x1, y2, pointX, pointY ) ||
                isPointCloseToLine( x1, y2, x1, y1, pointX, pointY ) ||
                // Check if the point is inside the rectangle or circle
                 (fill !== null && pointX <= Math.max(x1,x2) && pointX >= Math.min(x1,x2) && pointY <= Math.max(y1,y2) && pointY >= Math.min(y1,y2))
            );

        case TOOL_ITEMS.BRUSH:
            const context = document.getElementById("canvas").getContext("2d");
            return context.isPointInPath(element.path , pointX , pointY);

        case TOOL_ITEMS.TEXT: {
            // Check if click is near the text position (simple bounding box)
            const textWidth = element.text.length * (element.size || 32) * 0.6; // Approximate text width
            const textHeight = element.size || 32; // Text height
            
            return (
                pointX >= x1 && 
                pointX <= x1 + textWidth && 
                pointY >= y1 && 
                pointY <= y1 + textHeight
            );
        }

        default:
            throw new Error(`Unknown tool type: ${type}`);
    }
};

export const getSvgPathFromStroke = (stroke) => {
    if(!stroke.length) return "";

    const d = stroke.reduce(
        (acc , [x0,y0] , i , arr) => {
            const [x1,y1] = arr[ (i+1) % arr.length ];
            acc.push( x0 , y0 , (x0+x1)/2 , (y0+y1)/2 );
            return acc;
        }, 
        [ "M", ...stroke[0] , "Q" ]
    );

    d.push("Z");
    return d.join(" ");
};