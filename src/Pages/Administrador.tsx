import { useEffect, useState } from "react";
import type { Administrador } from "../Types/Administrador";
import Navbar from "../Components/Navbar";
import MenuOpciones from "../Components/MenuOpciones";
import ModalReutilizable, { type Campo } from "../Components/ModalAgregadoReutilizable";
import ModalEliminarReutilizable from "../Components/ModalEliminar";

import "../Styles/General.css";
import "../Styles/Clientes.css";

export default function Administradores() {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [adminSeleccionado, setAdminSeleccionado] = useState<Administrador | null>(null);
  const [adminEditando, setAdminEditando] = useState<Administrador | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/administradores")
      .then((res) => res.json())
      .then((data) => setAdministradores(data))
      .catch((err) => console.error("Error al obtener administradores:", err));
  }, []);

  const campos: Campo<Administrador>[] = [
    { key: "nombre", label: "Nombre", type: "text" },
    { key: "correo", label: "Correo", type: "email" },
    { key: "password", label: "Contraseña", type: "password" },
  ];

  const agregarAdministrador = async (nuevoAdmin: Omit<Administrador, "id">) => {
    const res = await fetch("http://localhost:3001/administradores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoAdmin),
    });
    const data = await res.json();
    setAdministradores([...administradores, data]);
  };
  const editarAdministrador = async (actualizado: Partial<Administrador>) => {
  if (!adminEditando) return;

  // No sobrescribas el password si está vacío
  const adminFinal: Administrador = {
    ...adminEditando,
    ...actualizado,
    password: actualizado.password?.toString().trim()
      ? actualizado.password
      : adminEditando.password,
  };

  const res = await fetch(`http://localhost:3001/administradores/${adminFinal.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adminFinal),
  });

  const data = await res.json();

  setAdministradores((prev) =>
    prev.map((a) => (a.id === data.id ? data : a))
  );
  setAdminEditando(null);
};


  

  const eliminarAdministrador = async () => {
    if (!adminSeleccionado) return;

    await fetch(`http://localhost:3001/administradores/${adminSeleccionado.id}`, {
      method: "DELETE",
    });
    setAdministradores(administradores.filter((a) => a.id !== adminSeleccionado.id));
    setAdminSeleccionado(null);
    setMostrarEliminar(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setAdminEditando(null);
  };

  return (
    <>
      <Navbar />
      <MenuOpciones />

      <main className="contenedor">
        <div className="encabezado">
          <h1>Administradores</h1>
          <button
            className="boton-agregar"
            onClick={() => {
              setMostrarModal(true);
              setAdminEditando(null);
            }}
          >
            Agregar nuevo administrador
          </button>
        </div>

        <div className="cards-contenedor">
          {administradores.map((admin) => (
            <div className="card-glass" key={admin.id}>
              <h2>{admin.nombre}</h2>
              <p><strong>Correo:</strong> {admin.correo}</p>
              <p><strong>Contraseña:</strong> {admin.password}</p>

              <div className="botones-card">
                <button
                  className="btn-gris"
                  onClick={() => {
                    setAdminEditando(admin);
                    setMostrarModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn-gris oscuro"
                  onClick={() => {
                    setAdminSeleccionado(admin);
                    setMostrarEliminar(true);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <ModalReutilizable
          visible={mostrarModal}
          onClose={cerrarModal}
          onSubmit={(data) => {
            if (adminEditando) {
              editarAdministrador(data);
            } else {
              agregarAdministrador(data as Omit<Administrador, "id">);
            }
            cerrarModal();
          }}
          campos={campos}
          initialData={adminEditando}
        />

        <ModalEliminarReutilizable
          mostrar={mostrarEliminar}
          onCerrar={() => {
            setMostrarEliminar(false);
            setAdminSeleccionado(null);
          }}
          onConfirmar={eliminarAdministrador}
          mensaje={`¿Deseas eliminar al administrador "${adminSeleccionado?.nombre}"?`}
        />
      </main>
    </>
  );
}
