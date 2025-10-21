import React,{useState} from "react";

function useToggleState(initialState = false){
    const [state, setState] = useState(initialState);

    const toggleState = () =>{
        setState(state => !state)
    }
    return [state, toggleState]
}

export default useToggleState;