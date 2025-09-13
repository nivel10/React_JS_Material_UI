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
          <p><strong>First name:</strong> {user.first_name}</p>
          <p><strong>Last name:</strong> {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* <p><strong>Remember me:</strong> {user.remember_me ? 'yes' : 'no'}</p> */}
          <p><strong>Created:</strong> {new Date(user.created_at * 1000).toLocaleDateString('en-EU', {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"

          })}</p>
        </div>
      ) : (
        <p>No hay datos de usuario disponibles.</p>
      )}
    </section>
  );
};

export default User;