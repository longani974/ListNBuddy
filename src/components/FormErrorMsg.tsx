import React from "react";

type FormErrorMsgProps = {
    messageError: string | undefined;
};

const FormErrorMsg: React.FC<FormErrorMsgProps> = ({messageError}) => {
    return <span className="text-red-500">{messageError}</span>;
};
export default FormErrorMsg;
