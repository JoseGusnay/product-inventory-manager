export const UI_TEXTS = {
  ACTIONS: {
    ADD: 'Agregar',
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    CONFIRM: 'Confirmar',
    CANCEL: 'Cancelar',
    RESET: 'Reiniciar',
    SEND: 'Enviar',
    SEARCH_PLACEHOLDER: 'Search...',
  },
  TITLES: {
    FORM_ADD: 'Formulario de Registro',
    FORM_EDIT: 'Formulario de Edición',
    DELETE_TITLE: 'Eliminar Producto',
  },
  MESSAGES: {
    DELETE_CONFIRMATION: (name: string) => `¿Estás seguro que deseas eliminar el producto ${name}?`,
    RESULTS: 'Resultados',
    NO_RESULTS: 'No se encontraron productos',
    DELETE_SUCCESS: 'Producto eliminado correctamente',
    DELETE_ERROR: 'Error al eliminar el producto',
  },
  TABLE: {
    HEADERS: {
      LOGO: 'Logo',
      NAME: 'Nombre del producto',
      DESCRIPTION: 'Descripción',
      RELEASE_DATE: 'Fecha de liberación',
      REVISION_DATE: 'Fecha de reestructuración',
    },
  },
  FORM: {
    LABELS: {
      ID: 'ID',
      NAME: 'Nombre',
      DESCRIPTION: 'Descripción',
      LOGO: 'Logo',
      RELEASE_DATE: 'Fecha Liberación',
      REVISION_DATE: 'Fecha Revisión',
    },
    ERRORS: {
      REQUIRED: 'Este campo es requerido!',
      MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres!`,
      MAX_LENGTH: (max: number) => `Máximo ${max} caracteres!`,
      ID_EXISTS: '¡Este ID ya existe!',
      ID_INVALID: 'ID no válido!',
      DATE_INVALID: 'La fecha debe ser igual o mayor a la fecha actual',
      REVISION_INVALID: 'La fecha debe ser exactamente un año después de la de liberación',
    },
  },
};
