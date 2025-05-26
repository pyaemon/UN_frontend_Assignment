import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry } from "./baseQueryWithRetry";

interface PhotoMetadata {
  tags: string[];
  updatedAt: string;
}

export const photoApi = createApi({
  reducerPath: "photoApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Photo"],
  endpoints: (builder) => ({
    getPhotos: builder.query<string[], void>({
      query: () => "photos",
      providesTags: ["Photo"],
    }),
    getPhotoById: builder.query<Blob, string>({
      query: (id) => ({
        url: `photos/${id}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getPhotoMetadata: builder.query<PhotoMetadata, string>({
      query: (id) => `metadata/${id}`,
      providesTags: (result, error, id) => [{ type: "Photo", id }],
    }),
    uploadPhoto: builder.mutation<
      { id: string },
      { file: File; metadata?: object }
    >({
      query: ({ file, metadata }) => {
        const formData = new FormData();
        formData.append("photo", file);
        if (metadata) {
          formData.append("metadata", JSON.stringify(metadata));
        }
        return {
          url: "photos",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Photo"],
    }),
    updatePhotoMetadata: builder.mutation<
      PhotoMetadata,
      { id: string; metadata: Partial<PhotoMetadata> }
    >({
      query: ({ id, metadata }) => ({
        url: `metadata/${id}`,
        method: "PUT",
        body: { metadata },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Photo", id }],
    }),
    deletePhoto: builder.mutation<void, string>({
      query: (id) => ({
        url: `photos/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          photoApi.util.updateQueryData("getPhotos", undefined, (draft) => {
            return draft.filter((photoId) => photoId !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Photo"],
    }),
  }),
});

export const {
  useGetPhotosQuery,
  useGetPhotoByIdQuery,
  useGetPhotoMetadataQuery,
  useUploadPhotoMutation,
  useUpdatePhotoMetadataMutation,
  useDeletePhotoMutation,
} = photoApi;
