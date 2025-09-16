import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from "@mui/material";
import { Edit, Delete, Save, Close, CalendarToday } from "@mui/icons-material";
import { useNotification } from "../components/useNotification";
import type { IResult } from "../interfaces/ICommons";

interface ITaskItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
}

interface IInputError {
  success: boolean;
  message: string;
}

const Task: React.FC = () => {
  const { notify } = useNotification();
  const [tasks, setTasks] = useState<ITaskItem[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
    date: ""
  });

  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ITaskItem>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [titleError, setTitleError] = useState<IInputError>({ success: true, message: '', });
  const [descriptionError, setDescriptionError] = useState<IInputError>({ success: true, message: '', });
  const [dateError, setDateError] = useState<IInputError>({ success: true, message: '', });

  const taskCheck = () => {
    const response: IResult<unknown> = { success: true, message: '', data: {} };
    try {
      if (!newTask.title) {
        response.success = false;
        setTitleError({ success: false, message: 'this field is required', });
      }

      if (!newTask.description) {
        response.success = false;
        setDescriptionError({ success: false, message: 'this field is required', });
      }

      if (!newTask.date) {
        response.success = false;
        setDateError({ success: false, message: 'this field is required', });
      }
    } catch (ex) {
      response.success = false;
      if (ex instanceof Error) {
        notify(ex?.message, 'error', 4000);
      } else {
        notify(String(ex), 'error', 4000);
      }
    }
    return response;
  }

  const handleAddTask = () => {
    let response: IResult<unknown> = { success: true, message: '', data: {} };
    try {
      response = taskCheck();
      if (!response.success) {
        return;
      }

      setTasks([
        ...tasks,
        { id: Date.now(), ...newTask }
      ]);
      setNewTask({ title: "", description: "", completed: false, date: "" });
    } catch (ex) {
      if (ex instanceof Error) {
        notify(ex?.message, 'error', 4000);
      } else {
        notify(String(ex), 'error', 4000);
      }
    }

  };

  const handleEditTask = (task: ITaskItem) => {
    setEditTaskId(task.id);
    setEditData(task);
  };

  const handleSaveTask = () => {
    setTasks(tasks.map(t => t.id === editTaskId ? { ...(t as ITaskItem), ...editData } as ITaskItem : t));
    setEditTaskId(null);
    setEditData({});
  };

  const handleDeleteTask = () => {
    setTasks(tasks.filter(t => t.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks (Private)
      </Typography>

      {/* Add Task Form */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <TextField
          error={!titleError?.success}
          helperText={!titleError?.success ? titleError?.message : ''}
          label="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          onFocus={() => setTitleError({success: true, message: '', })}
        />
        <TextField
          error={!descriptionError?.success}
          helperText={!descriptionError?.success ? descriptionError?.message : ''}
          label="Description"
          multiline
          rows={2}
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          onFocus={() => setDescriptionError({success: true, message: '', })}
        />
        <TextField
          error={!dateError?.success}
          helperText={!dateError?.success ? dateError?.message : ''}
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          onFocus={() => setDateError({success: true, message: '', })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarToday fontSize="small" />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </Box>

      {/* Task List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tasks.map((task) => (
          <Card key={task.id} variant="outlined">
            <CardContent>
              {editTaskId === task.id ? (
                <>
                  <TextField
                    label="Title"
                    fullWidth
                    sx={{ mb: 1 }}
                    value={editData.title || ""}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mb: 1 }}
                    value={editData.description || ""}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                  <TextField
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 1 }}
                    value={editData.date || ""}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={editData.completed || false}
                      onChange={(e) => setEditData({ ...editData, completed: e.target.checked })}
                    />
                    <Typography>Completed</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Date: {task.date || "No date"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={(e) =>
                        setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: e.target.checked } : t))
                      }
                    />
                    <Typography>Completed</Typography>
                  </Box>
                </>
              )}
            </CardContent>
            <CardActions>
              {editTaskId === task.id ? (
                <>
                  <IconButton color="success" onClick={handleSaveTask}>
                    <Save />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => setEditTaskId(null)}>
                    <Close />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton color="primary" onClick={() => handleEditTask(task)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => setDeleteConfirmId(task.id)}>
                    <Delete />
                  </IconButton>
                </>
              )}
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Task;