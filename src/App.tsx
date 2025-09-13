// import { Button, Container, CssBaseline, Slider, Stack, TextField } from "@mui/material"
// import { useState } from "react"

// import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import PublicRoute from "./auth/PublicRouter"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoute from "./auth/PrivateRouter"
import Task from './pages/Task'
import User from "./pages/User"

function App() {
  // const [value, setValue] = useState("");

  // const handleButtonClick = () => {
  //   console?.log(value);
  // }

  return <>
    {/* <Container>
      <Stack gap={2}>
        <CssBaseline />
        <TextField value={value}
          onChange={(e) => {
            setValue(e?.target?.value)
          }}
          onKeyDown={(e) => {
            if (e?.key === "Enter") {
              handleButtonClick();
            }
          }
          }
          error={!value} />
        <Slider />
        <Button startIcon={<AutoAwesomeRoundedIcon />}
          variant="contained"
          onClick={() => handleButtonClick()}>Submit
        </Button>
        <AutoAwesomeRoundedIcon />
      </Stack>
    </Container> */}

    {/* <Container> */}
      <Navbar />
      <Routes>
        {/* Público */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Privado */}
        <Route element={<PrivateRoute />}>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/task" element={<Task />} />
          <Route path="/user" element={<User />} />
        </Route>

        <Route path="/" element={<Home />} />

        {/* Fallback opcional */}
        <Route path="*" element={<Home />} />
      </Routes>
    {/* </Container> */}

  </>
}

export default App
