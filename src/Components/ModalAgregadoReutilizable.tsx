import { useState } from "react";
import "../Styles/Componentes/ModalAgregadoReutilizable.css";

interface Campo<T> {
  key: keyof T;
  label: string;
  type: "text" | "number" | "email" | "date" | "select";
  options?: { label: string; value: string }[]; // Para los selects
}

interface ModalProps<T> {
  visible: boolean;
  onClose: () => void;
  onSubmit: (nuevo: Partial<T>) => void;
  campos: Campo<T>[];
}

export default function ModalAgregar<T>({
  visible,
  onClose,
  onSubmit,
  campos,
}: ModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});

  const handleChange = (
    key: keyof T,
    value: string | number
  ) => {
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
        <h2>Agregar nuevo</h2>
        <form onSubmit={handleSubmit}>
          {campos.map((campo) => (
            <div key={String(campo.key)} className="campo-formulario">
              <label>{campo.label}</label>
              {campo.type === "select" && campo.options ? (
                <select
                  value={(formData[campo.key] as string) || ""}
                  onChange={(e) =>
                    handleChange(campo.key, e.target.value)
                  }
                >
                  <option value="">Seleccione una opción</option>
                  {campo.options.map((opcion) => (
                    <option
                      key={opcion.value}
                      value={opcion.value}
                    >
                      {opcion.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={campo.type}
                  value={formData[campo.key] as string || ""}
                  onChange={(e) =>
                    handleChange(
                      campo.key,
                      campo.type === "number"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                />
              )}
            </div>
          ))}
          <div className="acciones-modal">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
