export interface Usuario {
  id?: string;
  nombre_completo: string;
  correo_electronico: string;
  contrasena: string;
  foto_perfil?: string;
  cedula: string;
  numero_celular: string;
  enlace_whatsapp?: string;
}
