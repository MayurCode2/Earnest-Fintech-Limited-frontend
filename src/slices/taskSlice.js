import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'https://limitedbackend.onrender.com/tasks';

// Async Thunk for fetching tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get(apiUrl);
  return response.data;
});

// Async Thunk for updating task status
export const updateTaskStatus = createAsyncThunk('tasks/updateTaskStatus', async ({ taskId, completed }) => {
  const response = await axios.patch(`${apiUrl}/${taskId}/update-status`, { completed });
  return response.data;
});

// Async Thunk for creating a task
export const createTask = createAsyncThunk('tasks/createTask', async (taskData) => {
  const response = await axios.post(apiUrl, taskData);
  return response.data;
});

// Async Thunk for deleting a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
  await axios.delete(`${apiUrl}/${taskId}`);
  return taskId;
});

// Async Thunk for updating a task by ID
export const updateTaskById = createAsyncThunk('tasks/updateTaskById', async ({ taskId, updatedData }) => {
  const response = await axios.patch(`${apiUrl}/${taskId}`, updatedData);
  return response.data;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? { ...task, completed: action.payload.completed } : task
        );
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
       
      })
      .addCase(updateTaskById.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? { ...task, ...action.payload } : task
        );
      });
  },
});

export default taskSlice.reducer;