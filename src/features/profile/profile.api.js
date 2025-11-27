import { api } from '../../shared/api/rtk';

export const profileApi = api.injectEndpoints({
  endpoints: (b) => ({
    me: b.query({
      query: () => '/player-profiles/me',
      providesTags: ['Me'],
    }),
    updateMe: b.mutation({
      query: (data) => ({ url: '/player-profiles/me', method: 'PATCH', body: data }),
      invalidatesTags: ['Me'],
    }),
    leaderboard: b.query({
      query: ({ limit=20, offset=0 }={}) => `/leaderboard?limit=${limit}&offset=${offset}`,
      providesTags: ['Leaderboard'],
    }),
  }),
});
export const { useMeQuery, useUpdateMeMutation, useLeaderboardQuery } = profileApi;
