import httpClient from "./httpClient";

interface IUserDelete {
    email: string;
    password: string;
};

export const userService = {
    userPut: async (id: string = '', data: unknown = {}) => {
        const res = await httpClient.put(`/users/${id}`, data);
        return res.data;
    },

    userDelete: async (id: string = '', data: IUserDelete = { email: '', password: '' }) => {
        const res = await httpClient.post(`/users/delete/${id}`, data);
        return res.data;
    },
}