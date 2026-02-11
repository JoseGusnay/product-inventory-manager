import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Solicitud incorrecta';
        } else if (error.status === 404) {
          errorMessage = 'Recurso no encontrado';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        } else {
          errorMessage = `Error del servidor (${error.status}): ${error.message}`;
        }
      }

      notificationService.error(errorMessage);
      return throwError(() => error);
    }),
  );
};
