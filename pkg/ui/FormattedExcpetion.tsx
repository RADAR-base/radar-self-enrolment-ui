import {CardTitle, MarginCard} from "../styled";
import {FC, PropsWithChildren} from "react";

type FormattedExceptionProps = PropsWithChildren<{tileText: string}>

const FormattedException: FC<FormattedExceptionProps> = ({tileText, children}) => {
    return (
        <>
        <MarginCard>
            <CardTitle>{tileText}</CardTitle>
            {children}
        </MarginCard>
        </>
    )
}

export default FormattedException;