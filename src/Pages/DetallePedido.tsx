// pages/DetallePedido.tsx

import { useEffect, useState } from "react";
import type { DetallePedido } from "../Types/DetallePedido";
import Navbar from "../Components/Navbar";
import MenuOpciones from "../Components/MenuOpciones";
import ModalReutilizable, { type Campo } from "../Components/ModalAgregadoReutilizable";
import ModalEliminarReutilizable from "../Components/ModalEliminar";

import "../Styles/General.css";
import "../Styles/Clientes.css"; // Reutilizamos los estilos de clientes

export default function DetallePedido() {
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<DetallePedido | null>(null);
  const [detalleEditando, setDetalleEditando] = useState<DetallePedido | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/detallePedido")
      .then((res) => res.json())
      .then((data) => setDetalles(data))
      .catch((err) => console.error("Error al obtener detalles:", err));
  }, []);

  const campos: Campo<DetallePedido>[] = [
    { key: "pedidoId", label: "ID Pedido", type: "number" },
    { key: "productoId", label: "ID Producto", type: "number" },
    { key: "cantidad", label: "Cantidad", type: "number" },
    { key: "precioUnitario", label: "Precio Unitario", type: "number" },
  ];

  const agregarDetalle = async (nuevoDetalle: Omit<DetallePedido, "id">) => {
    const res = await fetch("http://localhost:3001/detallePedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoDetalle),
    });
    const data = await res.json();
    setDetalles([...detalles, data]);
  };

  const editarDetalle = async (actualizado: Partial<DetallePedido>) => {
    if (!detalleEditando) return;

    const detalleFinal: DetallePedido = {
      ...detalleEditando,
      ...actualizado,
    };

    const res = await fetch(`http://localhost:3001/detallePedido/${detalleFinal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detalleFinal),
    });

    const data = await res.json();

    setDetalles((prev) =>
      prev.map((d) => (d.id === data.id ? data : d))
    );
    setDetalleEditando(null);
  };

  const eliminarDetalle = async () => {
    if (!detalleSeleccionado) return;

    await fetch(`http://localhost:3001/detallePedido/${detalleSeleccionado.id}`, {
      method: "DELETE",
    });

    setDetalles(detalles.filter((d) => d.id !== detalleSeleccionado.id));
    setDetalleSeleccionado(null);
    setMostrarEliminar(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setDetalleEditando(null);
  };

  return (
    <>
      <Navbar />
      <MenuOpciones />

      <main className="contenedor">
        <div className="encabezado">
          <h1>Detalle de Pedidos</h1>
          <button
            className="boton-agregar"
            onClick={() => {
              setMostrarModal(true);
              setDetalleEditando(null);
            }}
          >
            Agregar detalle
          </button>
        </div>

        <div className="cards-contenedor">
          {detalles.map((detalle) => (
            <div className="card-glass" key={detalle.id}>
              <h2>Detalle #{detalle.id}</h2>
              <p><strong>ID Pedido:</strong> {detalle.pedidoId}</p>
              <p><strong>ID Producto:</strong> {detalle.productoId}</p>
              <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
              <p><strong>Precio Unitario:</strong> ${detalle.precioUnitario.toFixed(2)}</p>

              <div className="botones-card">
                <button
                  className="btn-gris"
                  onClick={() => {
                    setDetalleEditando(detalle);
                    setMostrarModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn-gris oscuro"
                  onClick={() => {
                    setDetalleSeleccionado(detalle);
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
            if (detalleEditando) {
              editarDetalle(data);
            } else {
              agregarDetalle(data as Omit<DetallePedido, "id">);
            }
            cerrarModal();
          }}
          campos={campos}
          initialData={detalleEditando}
        />

        <ModalEliminarReutilizable
          mostrar={mostrarEliminar}
          onCerrar={() => {
            setMostrarEliminar(false);
            setDetalleSeleccionado(null);
          }}
          onConfirmar={eliminarDetalle}
          mensaje={`¿Deseas eliminar el detalle #${detalleSeleccionado?.id}?`}
        />
      </main>
    </>
  );
}
