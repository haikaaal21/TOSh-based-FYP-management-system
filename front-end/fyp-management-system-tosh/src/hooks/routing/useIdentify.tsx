import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

//TODO: Identifier for routing, if 10601 then student, if 10602 then staff
//TODO: After task above is done, implement 1060201 for Coordinator, and 1060202 for Supervisor
function useIdentify() {
    let [whereTo, setWhereTo] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (whereTo) {
            navigate(whereTo);
        }
    })
    function identify(identiferCode: string) {
        switch (identiferCode) {
            case "10601":
                setWhereTo("/student");
                break;
            case "10602":
                setWhereTo("/staff");
                break;
        }
    }
    
    return { whereTo, identify };
}

export default useIdentify;