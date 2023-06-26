import { useFormContext } from "react-hook-form";

interface ErrorMessageProps {
    name:string;
}
 
const ErrorMessage: React.FC<ErrorMessageProps> = ({name}) => {
    const {formState:{errors}} = useFormContext();
    return ( 
        <div className="w-full">
            <p className="text-csw-public-red">{errors[name]?.message?.toString()}</p>
        </div>
     );
}
 
export default ErrorMessage;