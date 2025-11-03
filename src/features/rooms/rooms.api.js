import { api } from '../../shared/api/rtk';

export const roomsApi = api.injectEndpoints({
  endpoints: (b) => ({
    available: b.query({
      query: ({ limit=20, offset=0 }={}) => `/rooms/available?limit=${limit}&offset=${offset}`,
      providesTags: ['Rooms'],
    }),
    quickplay: b.mutation({
      query: () => ({ url: '/rooms/quickplay', method: 'POST' }),
      invalidatesTags: ['Rooms','Room'],
    }),
    joinRoom: b.mutation({
      query: ({ id, asRole }) => ({ url: `/rooms/${id}/join`, method: 'POST', body: { asRole } }),
      invalidatesTags: ['Room'],
    }),
    leaveRoom: b.mutation({
      query: (id) => ({ url: `/rooms/${id}/leave`, method: 'POST' }),
      invalidatesTags: ['Rooms','Room'],
    }),
    configRoom: b.mutation({
      query: ({ id, data }) => ({ url: `/rooms/${id}/config`, method: 'POST', body: data }),
      invalidatesTags: ['Room'],
    }),
    startMatch: b.mutation({
      query: (matchId) => ({ url: `/matches/${matchId}/start`, method: 'POST' }),
      invalidatesTags: ['Match','Room'],
    }),
    finishMatch: b.mutation({
      query: ({ id, payload }) => ({ url: `/matches/${id}/finish`, method: 'POST', body: payload }),
      invalidatesTags: ['Match','Room','Leaderboard','Me'],
    }),
  }),
});
export const {
  useAvailableQuery,
  useQuickplayMutation,
  useJoinRoomMutation,
  useLeaveRoomMutation,
  useConfigRoomMutation,
  useStartMatchMutation,
  useFinishMatchMutation,
} = roomsApi;
