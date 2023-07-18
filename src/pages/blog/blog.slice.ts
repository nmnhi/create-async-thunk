import {
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current,
} from "@reduxjs/toolkit";
import { Post } from "types/blog.type";
import { axiosInstance } from "utils/http";

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
  loading: boolean;
  currentRequestId: undefined | string;
}
const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined,
};

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

export const getPostList = createAsyncThunk(
  "blog/getPostList",
  async (_params: number, thunkAPI) => {
    const response = await axiosInstance.get<Post[]>("posts", {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const addPost = createAsyncThunk(
  "blog/addPost",
  async (body: Omit<Post, "id">, thunkAPI) => {
    const response = await axiosInstance.post<Post>("posts", body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "blog/finishEditingPost",
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    const response = await axiosInstance.put<Post>(`posts/${postId}`, body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string, thunkAPI) => {
    const response = await axiosInstance.delete<Post[]>(`posts/${postId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    deletePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const foundPostIndex = state.postList.findIndex(
        (post) => post.id === postId
      );
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1);
      }
    },
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const foundPost =
        state.postList.find((post) => post.id === postId) || null;
      state.editingPost = foundPost;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingPost = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        const deletePostIndex = state.postList.findIndex(
          (post) => post.id === postId
        );
        if (deletePostIndex !== -1) {
          state.postList.splice(deletePostIndex, 1);
        }
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) =>
          action.type.endsWith("/rejected") ||
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (
            state.loading &&
            action.meta.requestId === state.currentRequestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )

      .addDefaultCase((state, action) => {
        console.log(`action type: ${action.type}`, current(state));
      });
  },
});

export const { cancelEditingPost, startEditingPost } = blogSlice.actions;

const blogReducer = blogSlice.reducer;

export default blogReducer;
