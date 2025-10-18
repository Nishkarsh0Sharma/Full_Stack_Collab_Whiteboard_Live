import { createContext } from "react";

const toolboxContext = createContext({
    toolboxState: {},
    chnageStroke : () => {},
    changeFill : () => {},
    changeSize : () => {},
});

export default toolboxContext;