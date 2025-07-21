export interface Categoria {
  id: number;
  nombre: string;
  estado: "activo" | "inactivo";
  descripcion: string;
}