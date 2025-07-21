import { useEffect, useState } from "react";
import type { Producto } from "../Types/Producto";
import type { Categoria } from "../Types/Categoria";
import type { Campo } from "../Components/ModalAgregadoReutilizable";
import Navbar from "../Components/Navbar";
import MenuOpciones from "../Components/MenuOpciones";
import ModalAgregar from "../Components/ModalAgregadoReutilizable";
import ModalEditar  from "../Components/ModalEditarReutilizable";
import "../Styles/Productos.css";

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null
  );

  // Cargar productos y categorías desde db.json
  useEffect(() => {
    fetch("http://localhost:3001/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos:", err));

    fetch("http://localhost:3001/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  // Obtener nombre de la categoría según su id
  const obtenerNombreCategoria = (idCategoria: number): string => {
    const categoria = categorias.find((cat) => cat.id === idCategoria);
    return categoria ? categoria.nombre : "Desconocida";
  };

  // Campos del formulario
  const camposProducto: Campo<Producto>[] = [
    { key: "nombre", label: "Nombre", type: "text" },
    { key: "descripcion", label: "Descripción", type: "text" },
    { key: "precio", label: "Precio", type: "number" },
    { key: "stock", label: "Stock", type: "number" },
    { key: "imagen", label: "URL de imagen", type: "text" },
    {
      key: "categoriaId",
      label: "Categoría",
      type: "select",
      options: categorias.map((cat) => ({
        value: cat.id.toString(),
        label: cat.nombre,
      })),
    },
  ];

  // Agregar producto usando POST al backend
  const agregarProducto = async (nuevo: Partial<Producto>) => {
    const nuevoProducto: Producto = {
      id: 0, // El backend lo asignará
      ...nuevo,
      precio: Number(nuevo.precio),
      stock: Number(nuevo.stock),
      categoriaId: Number(nuevo.categoriaId),
    } as Producto;

    try {
      const res = await fetch("http://localhost:3001/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      const productoGuardado = await res.json();
      setProductos((prev) => [...prev, productoGuardado]);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };
  const editarProducto = async (actualizado: Partial<Producto>) => {
    if (!productoEditando) return;

    const productoFinal: Producto = {
      ...productoEditando,
      ...actualizado,
      precio: Number(actualizado.precio),
      stock: Number(actualizado.stock),
      categoriaId: Number(actualizado.categoriaId),
    };

    try {
      const res = await fetch(
        `http://localhost:3001/productos/${productoFinal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoFinal),
        }
      );

      const productoActualizado = await res.json();

      setProductos((prev) =>
        prev.map((prod) =>
          prod.id === productoActualizado.id ? productoActualizado : prod
        )
      );
      setProductoEditando(null);
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };

  return (
    <>
      <Navbar />
      <MenuOpciones />

      <main className="productos-contenedor">
        <header className="productos-header">
          <h1>Productos</h1>
          <button className="btn-agregar" onClick={() => setMostrarModal(true)}>
            Agregar nuevo producto
          </button>
        </header>

        <section className="productos-lista">
          {productos.map((prod) => (
            <article key={prod.id} className="producto-card">
              <img
                src={prod.imagen}
                alt={prod.nombre}
                className="producto-imagen"
              />
              <div className="producto-info">
                <h2>{prod.nombre}</h2>
                <p>{prod.descripcion}</p>
                <p>
                  <strong>Precio:</strong> S/ {prod.precio.toFixed(2)}
                </p>
                <p>
                  <strong>Stock:</strong> {prod.stock}
                </p>
                <p>
                  <strong>Categoría:</strong>{" "}
                  {obtenerNombreCategoria(prod.categoriaId)}
                </p>
                <div className="producto-acciones">
                  <button
                    className="btn-editar"
                    onClick={() => setProductoEditando(prod)}
                  >
                    Editar
                  </button>
                  <button className="btn-eliminar">Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Modal para agregar producto */}
      <ModalAgregar<Producto>
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSubmit={agregarProducto}
        campos={camposProducto}
      />

      {/* Modal para editar producto */}
      {productoEditando && (
        <ModalEditar
          isOpen={!!productoEditando}
          onClose={() => setProductoEditando(null)}
          onSubmit={editarProducto}
          fields={camposProducto} // ✅
          initialData={productoEditando} // ✅
        />
      )}
    </>
  );
}
