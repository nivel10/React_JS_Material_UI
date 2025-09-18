import axios, { HttpStatusCode } from "axios";
import type { IResult } from "../interfaces/ICommons";

export const getError = (ex: unknown) => {
    const currentMethod = 'getError';
    const response: IResult<unknown> = { success: true, message: '', data: {} };
    try {
        if (axios.isAxiosError(ex)) {
            let msgText = `${(ex?.status)}`;
            msgText += ` - ${(ex?.response?.data as { detail?: string })?.detail || ex?.message}`;
            msgText += ` - ${(ex?.response?.config as { url?: string })?.url || ex?.message}`;
            if (ex?.status !== HttpStatusCode.NotFound) {
                response.message = (ex?.response?.data as { detail?: string })?.detail || ex?.message;
            } else {
                response.message = msgText;
            }
        } else if (ex instanceof Error) {
            response.message = ex?.message;
        } else {
            response.message = String(ex);
        }
    } catch (ex) {
        response.success = false;
        response.message = `Method: ${currentMethod} - `;
        if (ex instanceof Error) {
            response.message += `${ex?.message}`;
        } else {
            response.message += `${String(ex)}`;
        }
    }

    return response;
}