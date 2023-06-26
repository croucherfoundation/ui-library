import { ReactNode, createContext } from "react";
import { NextFont } from "../types/next-font";

interface FontProviderProps {
    marrSans: NextFont;
    children: ReactNode | ReactNode[] | undefined;
}

interface FontContextProps {
    marrSans: NextFont;
}


export const FontContext = createContext({} as FontContextProps);
 
const FontProvider: React.FC<FontProviderProps> = ({marrSans,children}) => {
    return ( 
        <FontContext.Provider value={{
            marrSans
        }}>
            {children}
        </FontContext.Provider>
     );
}
 
export default FontProvider;