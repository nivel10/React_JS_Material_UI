import React from "react";

const Task: React.FC = () => {
  return (
    <section style={{ padding: 16 }}>
      <h1>Tareas (privado)</h1>
      <p>
        Aquí iría tu listado de tareas protegido por sesión.  
        Puedes cargar datos desde tu API y mostrarlos solo si el usuario está autenticado.
      </p>
    </section>
  );
};

export default Task;