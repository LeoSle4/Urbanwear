// Components/ModalReutilizable.tsx
import { useEffect, useState } from "react";
import "../Styles/Componentes/ModalAgregadoReutilizable.css";

export interface Campo<T> {
  key: keyof T;
  label: string;
  type: "text" | "number" | "email" | "date" | "select" | "password";
  options?: { label: string; value: string | number }[];
}

interface ModalAgregarReutilizableProps<T> {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  campos: Campo<T>[];
  initialData?: Partial<T> | null;
}

function ModalAgregarReutilizable<T>({
  visible,
  onClose,
  onSubmit,
  campos,
  initialData = null,
}: ModalAgregarReutilizableProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData, visible]);

  const handleChange = (key: keyof T, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({});
  };

  if (!visible) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h2>{initialData ? "Editar" : "Agregar"} producto</h2>
        <form onSubmit={handleSubmit}>
          {campos.map((campo) => (
            <div key={String(campo.key)} className="campo-formulario">
              <label htmlFor={`campo-${String(campo.key)}`}>
                {campo.label}
              </label>

              {campo.type === "select" && campo.options ? (
                <select
                  id={`campo-${String(campo.key)}`}
                  value={(formData[campo.key] as string | number) || ""}
                  onChange={(e) => handleChange(campo.key, e.target.value)}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {campo.options.map((op) => (
                    <option key={String(op.value)} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`campo-${String(campo.key)}`}
                  type={campo.type}
                  value={(formData[campo.key] as string | number) || ""}
                  onChange={(e) =>
                    handleChange(
                      campo.key,
                      campo.type === "number"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                  required={campo.key !== "password" || !initialData}
                />
              )}
            </div>
          ))}

          <div className="acciones-modal">
            <button type="submit">
              {initialData ? "Guardar cambios" : "Agregar"}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarReutilizable;
