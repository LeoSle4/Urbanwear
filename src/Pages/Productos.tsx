import { useEffect, useState } from "react";
import type { Producto } from "../Types/Producto";
import type { Categoria } from "../Types/Categoria";
import Navbar from "../Components/Navbar";
import MenuOpciones from "../Components/MenuOpciones";
import ModalAgregar from "../Components/ModalAgregadoReutilizable";
import "../Styles/Productos.css";

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);

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

    const obtenerNombreCategoria = (idCategoria: number): string => {
        const categoria = categorias.find((cat) => cat.id === idCategoria);
        return categoria ? categoria.nombre : "Desconocida";
    };

    const camposProducto = [
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


    const agregarProducto = (nuevo: Partial<Producto>) => {
        const nuevoProducto: Producto = {
            id: productos.length + 1, // Solo como ejemplo; el ID real debería venir del backend
            ...nuevo,
            precio: Number(nuevo.precio),
            stock: Number(nuevo.stock),
            categoriaId: Number(nuevo.categoriaId),
        } as Producto;

        // Aquí deberías hacer un POST al backend, pero por ahora lo agregamos localmente
        setProductos((prev) => [...prev, nuevoProducto]);
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
                            <img src={prod.imagen} alt={prod.nombre} className="producto-imagen" />
                            <div className="producto-info">
                                <h2>{prod.nombre}</h2>
                                <p>{prod.descripcion}</p>
                                <p><strong>Precio:</strong> S/ {prod.precio.toFixed(2)}</p>
                                <p><strong>Stock:</strong> {prod.stock}</p>
                                <p><strong>Categoría:</strong> {obtenerNombreCategoria(prod.categoriaId)}</p>
                                <div className="producto-acciones">
                                    <button className="btn-editar">Editar</button>
                                    <button className="btn-eliminar">Eliminar</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>

            {/* Modal */}
            <ModalAgregar<Producto>
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onSubmit={agregarProducto}
                campos={camposProducto}
            />
        </>
    );
}
