    import { api } from '../../shared/api/rtk';

    export const authApi = api.injectEndpoints({
    endpoints: (b) => ({
        login: b.mutation({
        query: ({ identifier, password }) => ({
            url: '/auth/local',
            method: 'POST',
            body: { identifier, password },
        }),
        }),
        register: b.mutation({
        query: ({ username, email, password }) => ({
            url: '/auth/local/register',
            method: 'POST',
            body: { username, email, password },
        }),
        }),
    }),
    });
    export const { useLoginMutation, useRegisterMutation } = authApi;
