import React, { useCallback, useState } from "react";
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
  InputAdornment,
  Fade
} from "@mui/material";
import { Edit, Delete, Close, CalendarToday, Check } from "@mui/icons-material";
import { useNotification } from "../components/useNotification";
import type { IErrorInput, IResult } from "../interfaces/ICommons";
import type { ITask } from "../interfaces/ITask";
import { useLoading } from "../components/useLoading";
import httpClient from "../api/httpClient";
import { useAuth } from "../auth/userAuth";
import { getError } from "../helpers/common";

const Task: React.FC = () => {
  const { user, } = useAuth();
  const { notify } = useNotification();
  const notifyRef = React.useRef(notify);
  const { openLoading, closeLoading, } = useLoading();
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [newTask, setNewTask] = useState<Partial<ITask>>({
    created_by: user?.id,
    title: "",
    description: "",
    completed: false,
    date: "",
  });

  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ITask>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [titleError, setTitleError] = useState<IErrorInput>({ success: true, message: '', });
  const [descriptionError, setDescriptionError] = useState<IErrorInput>({ success: true, message: '', });
  const [dateError, setDateError] = useState<IErrorInput>({ success: true, message: '', });
  const [titleEditError, setTitleEditError] = useState<IErrorInput>({ success: true, message: '', });
  const [descriptionEditError, setDescriptionEditError] = useState<IErrorInput>({ success: true, message: '', });
  const [dateEditError, setDateEditError] = useState<IErrorInput>({ success: true, message: '', });

  const [hasError, setHasError] = useState(false);

  const getData = useCallback(async () => {
    try {
      openLoading();

      const result = await httpClient.get(`/tasks/user/${user?.id}`);
      if (Array.isArray(result?.data) && result?.data?.length > 0) {
        setTasks(result?.data);
      }

      closeLoading();
    } catch (ex) {
      setHasError(true);
      closeLoading();
      notifyRef.current(getError(ex)?.message, 'error', 4000);
    }
  }, [openLoading, closeLoading, user?.id]);

  const taskCheck = ({ processType = 0 }) => {
    const response: IResult<unknown> = { success: true, message: '', data: {} };
    try {
      if (processType === 0) {
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
      } else {
        if (!editData.title) {
          response.success = false;
          setTitleEditError({ success: false, message: 'this field is required', });
        }

        if (!editData.description) {
          response.success = false;
          setDescriptionEditError({ success: false, message: 'this field is required', });
        }

        if (!editData.date) {
          response.success = false;
          setDateEditError({ success: false, message: 'this field is required', });
        }
      }
    } catch (ex) {
      response.success = false;
      // if (ex instanceof Error) {
      //   notify(ex?.message, 'error', 4000);
      // } else {
      //   notify(String(ex), 'error', 4000);
      // }
      notifyRef.current(getError(ex)?.message, 'error', 4000);
    }
    return response;
  }

  const handleAddTask = async () => {
    try {
      setErrorDefault();
      
      if (!taskCheck({ processType: 0, })?.success) return;

      openLoading();
      const result = await httpClient.post('/tasks', newTask);
      const taskCreated: ITask = result?.data;
      setTasks([
        ...tasks,
        taskCreated,
      ])

      setNewTask({ created_by: user?.id, title: "", description: "", completed: false, date: "", });

      notify('task created', 'success', 4000);
      closeLoading();
    } catch (ex) {
      closeLoading();
      // if (axios.isAxiosError(ex)) {
      //   notify((ex?.response?.data as { detail?: string })?.detail || ex?.message, 'error', 4000);
      // } else if (ex instanceof Error) {
      //   notify(ex?.message, 'error', 4000);
      // } else {
      //   notify(String(ex), 'error', 4000);
      // }
      notifyRef.current(getError(ex)?.message, 'error', 4000);
    }
  };

  const setErrorDefault = () => {
    setTitleError({ success: true, message: '', });
    setDescriptionError({ success: true, message: '', });
    setDateError({ success: true, message: '', });

    setTitleEditError({ success: true, message: '', });
    setDescriptionEditError({ success: true, message: '', });
    setDateEditError({ success: true, message: '', });
  }

  const handleEditTask = (task: ITask) => {
    setErrorDefault();

    setEditTaskId(task.id);
    setEditData({
      ...task,
      completed: !!task?.completed,
      description: task?.description ?? '',
    });
  };

  const handleSaveTask = async () => {
    try {
      if (!taskCheck({ processType: 1, })?.success) return;

      openLoading();
      const result = await httpClient.put(`/tasks/user/${editTaskId}/${user?.id}`, editData,);
      const taskUpdated: ITask = result?.data;
      setTasks(tasks.map(t => t.id === editTaskId ? { ...(t as ITask), ...taskUpdated } as ITask : t));
      setEditTaskId(null);
      setEditData({});

      notify('task updated', 'success', 4000);
      closeLoading();
    } catch (ex) {
      closeLoading();
      // if (axios.isAxiosError(ex)) {
      //   notify((ex?.response?.data as { detail?: string })?.detail || ex?.message, 'error', 4000);
      // } else if (ex instanceof Error) {
      //   notify(ex?.message, 'error', 4000);
      // } else {
      //   notify(String(ex), 'error', 4000);
      // }
      notifyRef.current(getError(ex)?.message, 'error', 4000);
    }
  };

  const handleDeleteTask = async () => {
    try {
      openLoading();

      const result = await httpClient.delete(`/tasks/user/${deleteConfirmId}/${user?.id}`);
      const taskDeleted: ITask = result?.data;

      // setTasks(tasks.filter(t => t.id !== deleteConfirmId));
      setTasks(tasks.filter(t => t.id !== taskDeleted?.id));
      setDeleteConfirmId(null);

      closeLoading();

      notifyRef.current('task deleted', 'success', 4000);
    } catch (ex) {
      closeLoading();
      notifyRef.current(getError(ex)?.message, 'error', 4000);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    if (!user?.id || hasError) return;
    getData();
    return () => clearTimeout(timer);
  }, [getData, user?.id, hasError]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Fade in={show} timeout={800}>
        <div>
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
              onKeyDown={(e) => { if (e?.key === 'Enter') handleAddTask(); }}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onFocus={() => setTitleError({ success: true, message: '', })}
            />
            <TextField
              error={!descriptionError?.success}
              helperText={!descriptionError?.success ? descriptionError?.message : ''}
              label="Description"
              multiline
              rows={2}
              value={newTask.description}
              onKeyDown={(e) => { if (e?.key === 'Enter') handleAddTask(); }}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              onFocus={() => setDescriptionError({ success: true, message: '', })}
            />
            <TextField
              error={!dateError?.success}
              helperText={!dateError?.success ? dateError?.message : ''}
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTask.date}
              onKeyDown={(e) => { if (e?.key === 'Enter') handleAddTask(); }}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              onFocus={() => setDateError({ success: true, message: '', })}
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
                        error={!titleEditError?.success}
                        helperText={titleEditError?.message || ''}
                        label="Title"
                        fullWidth
                        sx={{ mb: 1 }}
                        value={editData.title || ""}
                        onKeyDown={(e) => { if (e?.key === 'Enter') handleSaveTask(); }}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        onFocus={() => setTitleEditError({ success: true, message: '', })}
                      />
                      <TextField
                        error={!descriptionEditError?.success}
                        helperText={descriptionEditError?.message || ''}
                        label="Description"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 1 }}
                        value={editData.description || ""}
                        onKeyDown={(e) => { if (e?.key === 'Enter') handleSaveTask(); }}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        onFocus={() => setDescriptionEditError({ success: true, message: '', })}
                      />
                      <TextField
                        error={!dateEditError?.success}
                        helperText={dateEditError?.message || ''}
                        label="Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 1 }}
                        value={editData.date || ""}
                        onKeyDown={(e) => { if (e?.key === 'Enter') handleSaveTask(); }}
                        onChange={(e) => {
                          setEditData({ ...editData, date: e.target.value })
                        }}
                        onFocus={() => setDateEditError({ success: true, message: '', })}
                      />
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          checked={!!editData?.completed}
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
                        {/* Date: {new Date(task.date * 1000).toISOString().split('T')[0] || "No date"} */}
                        Date: {task.date || "No date"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <Checkbox
                          checked={!!task.completed}
                          onChange={(e) => {
                            if (editTaskId === task.id) {
                              setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: e.target.checked } : t))
                            }
                          }}
                          sx={{
                            cursor: editTaskId === task.id ? 'pointer' : 'default'
                          }}
                        />
                        <Typography >Completed</Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
                <CardActions>
                  {editTaskId === task.id ? (
                    <>
                      <IconButton color="success" onClick={handleSaveTask}>
                        <Check />
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
        </div>
      </Fade>
    </Container>
  );
};

export default Task;