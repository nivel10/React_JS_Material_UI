import React from "react";
import { useAuth } from "../auth/UserAuth";

const User: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <section style={{ padding: 16 }}>
      <h1>Perfil de usuario (privado)</h1>
      {user ? (
        <div>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Remember me:</strong> {user.rememberMe ? 'yes' : 'no'}</p>
        </div>
      ) : (
        <p>No hay datos de usuario disponibles.</p>
      )}
    </section>
  );
};

export default User;