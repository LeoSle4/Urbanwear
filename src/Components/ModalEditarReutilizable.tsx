import React, { useState, useEffect } from "react";
import "../Styles/Componentes/ModalEditarReutilizable.css";

export interface Campo<T> {
  nombre: keyof T;
  etiqueta: string;
  tipo: "text" | "number" | "select";
  opciones?: { valor: string | number; etiqueta: string }[];
}

interface ModalEditarProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  fields: Campo<T>[]; // ✅ CORRECTO
  initialData: T | null; // ✅ CORRECTO
}

export function ModalEditar<T>({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData,
}: ModalEditarProps<T>) {
  const [formData, setFormData] = useState<T>({} as T);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = fields.find((f) => f.nombre === name);

    if (field?.tipo === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-contenido">
        <h2>Editar</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={String(field.nombre)}>
              <label>{field.etiqueta}</label>
              {field.tipo === "select" ? (
                <select
                  name={String(field.nombre)}
                  value={formData[field.nombre] as string | number}
                  onChange={handleChange}
                >
                  {field.opciones?.map((op) => (
                    <option key={op.valor} value={op.valor}>
                      {op.etiqueta}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.tipo}
                  name={String(field.nombre)}
                  value={formData[field.nombre] as string | number}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}

          <div className="botones-modal">
            <button type="submit" className="btn-agregar">
              Guardar cambios
            </button>
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
