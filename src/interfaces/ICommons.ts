export interface IResult<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface IErrorInput {
    success: boolean;
    message: string;
}