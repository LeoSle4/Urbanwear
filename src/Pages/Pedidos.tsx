import { useEffect, useState } from "react";
import type { Pedido } from "../Types/Pedido";
import Navbar from "../Components/Navbar";
import MenuOpciones from "../Components/MenuOpciones";
import ModalReutilizable, { type Campo } from "../Components/ModalAgregadoReutilizable";
import ModalEliminarReutilizable from "../Components/ModalEliminar";

import "../Styles/General.css";
import "../Styles/Clientes.css";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/pedidos")
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Error al obtener pedidos:", err));
  }, []);

  const campos: Campo<Pedido>[] = [
    { key: "clienteId", label: "ID Cliente", type: "number" },
    { key: "fecha", label: "Fecha", type: "date" },
    { key: "total", label: "Total", type: "number" },
    {
      key: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "En proceso", value: "En proceso" },
        { label: "Entregado", value: "Entregado" },
        { label: "Cancelado", value: "Cancelado" },
      ],
    },
  ];

  const agregarPedido = async (nuevoPedido: Omit<Pedido, "id">) => {
    const res = await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPedido),
    });
    const data = await res.json();
    setPedidos([...pedidos, data]);
  };

  const editarPedido = async (actualizado: Partial<Pedido>) => {
    if (!pedidoEditando) return;

    const pedidoFinal: Pedido = {
      ...pedidoEditando,
      ...actualizado,
    };

    const res = await fetch(`http://localhost:3001/pedidos/${pedidoFinal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidoFinal),
    });

    const data = await res.json();

    setPedidos((prev) =>
      prev.map((p) => (p.id === data.id ? data : p))
    );
    setPedidoEditando(null);
  };

  const eliminarPedido = async () => {
    if (!pedidoSeleccionado) return;

    await fetch(`http://localhost:3001/pedidos/${pedidoSeleccionado.id}`, {
      method: "DELETE",
    });
    setPedidos(pedidos.filter((p) => p.id !== pedidoSeleccionado.id));
    setPedidoSeleccionado(null);
    setMostrarEliminar(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPedidoEditando(null);
  };

  return (
    <>
      <Navbar />
      <MenuOpciones />

      <main className="contenedor">
        <div className="encabezado">
          <h1>Pedidos</h1>
          <button
            className="boton-agregar"
            onClick={() => {
              setMostrarModal(true);
              setPedidoEditando(null);
            }}
          >
            Agregar nuevo pedido
          </button>
        </div>

        <div className="cards-contenedor">
          {pedidos.map((pedido) => (
            <div className="card-glass" key={pedido.id}>
              <h2>Pedido #{pedido.id}</h2>
              <p><strong>ID Cliente:</strong> {pedido.clienteId}</p>
              <p><strong>Fecha:</strong> {pedido.fecha}</p>
              <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>

              <div className="botones-card">
                <button
                  className="btn-gris"
                  onClick={() => {
                    setPedidoEditando(pedido);
                    setMostrarModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn-gris oscuro"
                  onClick={() => {
                    setPedidoSeleccionado(pedido);
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
            if (pedidoEditando) {
              editarPedido(data);
            } else {
              agregarPedido(data as Omit<Pedido, "id">);
            }
            cerrarModal();
          }}
          campos={campos}
          initialData={pedidoEditando}
        />

        <ModalEliminarReutilizable
          mostrar={mostrarEliminar}
          onCerrar={() => {
            setMostrarEliminar(false);
            setPedidoSeleccionado(null);
          }}
          onConfirmar={eliminarPedido}
          mensaje={`¿Deseas eliminar el pedido #${pedidoSeleccionado?.id}?`}
        />
      </main>
    </>
  );
}
