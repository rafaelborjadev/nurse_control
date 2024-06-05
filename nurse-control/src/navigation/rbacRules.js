export const MODULE_ENUM = {
  routes: 'routes',
};

export const ROUTES = {
  usuarios: '/usuarios',
  pacientes: '/pacientes',
  configuracion: '/configuracion',
};

export const ROLES_ENUM = {
  Administrador: 'Administrador',
  Doctor: 'Doctor',
};

const rules = {
  [ROLES_ENUM.Administrador]: {
    [MODULE_ENUM.routes]: [
      ROUTES.usuarios,
      ROUTES.pacientes,
      ROUTES.configuracion,
    ],
  },
  [ROLES_ENUM.Doctor]: {
    [MODULE_ENUM.routes]: [ROUTES.pacientes, ROUTES.configuracion],
  },
};

export default rules;
