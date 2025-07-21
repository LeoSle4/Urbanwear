// pages/Categorias.tsx

import { useEffect, useState } from "react";
import type { Categoria } from "../Types/Categoria";
import Navbar from "../Components/Navbar";
import MenuOpciones from "../Components/MenuOpciones";
import ModalReutilizable, { type Campo } from "../Components/ModalAgregadoReutilizable";
import ModalEliminarReutilizable from "../Components/ModalEliminar";

import "../Styles/General.css";
import "../Styles/Clientes.css"; // reutilizando estilos

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al obtener categorías:", err));
  }, []);

  const campos: Campo<Categoria>[] = [
    { key: "nombre", label: "Nombre", type: "text" },
    { key: "descripcion", label: "Descripción", type: "text" },
    {
      key: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Activo", value: "activo" },
        { label: "Inactivo", value: "inactivo" },
      ],
    },
  ];

  const agregarCategoria = async (nuevaCategoria: Omit<Categoria, "id">) => {
    const res = await fetch("http://localhost:3001/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaCategoria),
    });
    const data = await res.json();
    setCategorias([...categorias, data]);
  };

  const editarCategoria = async (actualizada: Partial<Categoria>) => {
    if (!categoriaEditando) return;

    const categoriaFinal: Categoria = {
      ...categoriaEditando,
      ...actualizada,
    };

    const res = await fetch(`http://localhost:3001/categorias/${categoriaFinal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoriaFinal),
    });

    const data = await res.json();

    setCategorias((prev) =>
      prev.map((c) => (c.id === data.id ? data : c))
    );
    setCategoriaEditando(null);
  };

  const eliminarCategoria = async () => {
    if (!categoriaSeleccionada) return;

    await fetch(`http://localhost:3001/categorias/${categoriaSeleccionada.id}`, {
      method: "DELETE",
    });

    setCategorias(categorias.filter((c) => c.id !== categoriaSeleccionada.id));
    setCategoriaSeleccionada(null);
    setMostrarEliminar(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCategoriaEditando(null);
  };

  return (
    <>
      <Navbar />
      <MenuOpciones />

      <main className="contenedor">
        <div className="encabezado">
          <h1>Categorías</h1>
          <button
            className="boton-agregar"
            onClick={() => {
              setMostrarModal(true);
              setCategoriaEditando(null);
            }}
          >
            Agregar nueva categoría
          </button>
        </div>

        <div className="cards-contenedor">
          {categorias.map((categoria) => (
            <div className="card-glass" key={categoria.id}>
              <h2>{categoria.nombre}</h2>
              <p><strong>Estado:</strong> {categoria.estado}</p>
              <p><strong>Descripción:</strong> {categoria.descripcion}</p>

              <div className="botones-card">
                <button
                  className="btn-gris"
                  onClick={() => {
                    setCategoriaEditando(categoria);
                    setMostrarModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn-gris oscuro"
                  onClick={() => {
                    setCategoriaSeleccionada(categoria);
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
            if (categoriaEditando) {
              editarCategoria(data);
            } else {
              agregarCategoria(data as Omit<Categoria, "id">);
            }
            cerrarModal();
          }}
          campos={campos}
          initialData={categoriaEditando}
        />

        <ModalEliminarReutilizable
          mostrar={mostrarEliminar}
          onCerrar={() => {
            setMostrarEliminar(false);
            setCategoriaSeleccionada(null);
          }}
          onConfirmar={eliminarCategoria}
          mensaje={`¿Deseas eliminar la categoría "${categoriaSeleccionada?.nombre}"?`}
        />
      </main>
    </>
  );
}
