import { useEffect, useState } from "react";
import type { Cliente } from "../Types/Cliente";
import Navbar from "../Components/Navbar";
import MenuOpciones from "../Components/MenuOpciones";
import ModalReutilizable, { type Campo } from "../Components/ModalAgregadoReutilizable";
import ModalEliminarReutilizable from "../Components/ModalEliminar";

import "../Styles/General.css";
import "../Styles/Clientes.css";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error al obtener clientes:", err));
  }, []);

  const campos: Campo<Cliente>[] = [
    { key: "nombre", label: "Nombre", type: "text" },
    { key: "correo", label: "Correo", type: "email" },
    { key: "telefono", label: "Teléfono", type: "text" },
    { key: "direccion", label: "Dirección", type: "text" },
  ];

  const agregarCliente = async (nuevoCliente: Omit<Cliente, "id">) => {
    const res = await fetch("http://localhost:3001/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCliente),
    });
    const data = await res.json();
    setClientes([...clientes, data]);
  };

  const editarCliente = async (actualizado: Partial<Cliente>) => {
    if (!clienteEditando) return;

    const clienteFinal: Cliente = {
      ...clienteEditando,
      ...actualizado,
    };

    const res = await fetch(`http://localhost:3001/clientes/${clienteFinal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clienteFinal),
    });

    const data = await res.json();

    setClientes((prev) =>
      prev.map((c) => (c.id === data.id ? data : c))
    );
    setClienteEditando(null);
  };

  const eliminarCliente = async () => {
    if (!clienteSeleccionado) return;

    await fetch(`http://localhost:3001/clientes/${clienteSeleccionado.id}`, {
      method: "DELETE",
    });
    setClientes(clientes.filter((c) => c.id !== clienteSeleccionado.id));
    setClienteSeleccionado(null);
    setMostrarEliminar(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteEditando(null);
  };

  return (
    <>
      <Navbar />
      <MenuOpciones />

      <main className="contenedor">
        <div className="encabezado">
          <h1>Clientes</h1>
          <button
            className="boton-agregar"
            onClick={() => {
              setMostrarModal(true);
              setClienteEditando(null); // aseguramos que sea "Agregar"
            }}
          >
            Agregar nuevo cliente
          </button>
        </div>

        <div className="cards-contenedor">
          {clientes.map((cliente) => (
            <div className="card-glass" key={cliente.id}>
              <h2>{cliente.nombre}</h2>
              <p><strong>Correo:</strong> {cliente.correo}</p>
              <p><strong>Teléfono:</strong> {cliente.telefono}</p>
              <p><strong>Dirección:</strong> {cliente.direccion}</p>

              <div className="botones-card">
                <button
                  className="btn-gris"
                  onClick={() => {
                    setClienteEditando(cliente);
                    setMostrarModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn-gris oscuro"
                  onClick={() => {
                    setClienteSeleccionado(cliente);
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
            if (clienteEditando) {
              editarCliente(data);
            } else {
              agregarCliente(data as Omit<Cliente, "id">);
            }
            cerrarModal();
          }}
          campos={campos}
          initialData={clienteEditando}
        />

        <ModalEliminarReutilizable
          mostrar={mostrarEliminar}
          onCerrar={() => {
            setMostrarEliminar(false);
            setClienteSeleccionado(null);
          }}
          onConfirmar={eliminarCliente}
          mensaje={`¿Deseas eliminar al cliente "${clienteSeleccionado?.nombre}"?`}
        />
      </main>
    </>
  );
}
