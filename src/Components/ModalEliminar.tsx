import React from "react";
import "../Styles/Componentes/ModalEliminar.css";

interface ModalEliminarProps {
  mostrar: boolean;
  onCerrar: () => void;
  onConfirmar: () => void;
  mensaje?: string;
}

const ModalEliminarReutilizable: React.FC<ModalEliminarProps> = ({
  mostrar,
  onCerrar,
  onConfirmar,
  mensaje = "¿Estás seguro de que deseas eliminar este elemento?",
}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-eliminar-overlay">
      <div className="modal-eliminar">
        <h3 className="modal-eliminar-titulo">Confirmar Eliminación</h3>
        <p className="modal-eliminar-mensaje">{mensaje}</p>
        <div className="modal-eliminar-botones">
          <button className="boton-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="boton-confirmar" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarReutilizable;
