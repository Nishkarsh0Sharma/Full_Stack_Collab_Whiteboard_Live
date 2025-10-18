import { createContext } from "react";

const BoardContext = createContext({
    activeToolItem : "",
    toolActionType : "",
    elements : [],
    history : [[]],
    index : 0,
    boardMouseDownHandler: () => {},
    changeToolHandler: () => {},
    boardMouseMoveHandler: ()=> {},
    boardMouseUpHandler: () => {},
});

export default BoardContext;