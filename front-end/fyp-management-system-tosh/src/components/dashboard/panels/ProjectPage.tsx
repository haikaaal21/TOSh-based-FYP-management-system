import { useParams } from "react-router";
import useGet from "../../../hooks/api/useGet";

const ProjectPage = () => {

    const { projectid } = useParams<{ projectid: string }>();
    
    return (
        <>
        </>
    );
}

export default ProjectPage;