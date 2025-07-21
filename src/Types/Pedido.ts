export interface Pedido {
  id: number;
  clienteId: number;
  fecha: string;
  total: number;
  estado: "En proceso" | "Entregado" | "Cancelado";
}
