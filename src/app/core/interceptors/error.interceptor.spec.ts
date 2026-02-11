import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('ErrorInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    const notificationServiceMock = {
      error: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should handle 404 error', (done) => {
    httpClient.get('/test').subscribe({
      error: () => {
        expect(notificationService.error).toHaveBeenCalledWith('Recurso no encontrado');
        done();
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 400 error with message', (done) => {
    const errorMsg = 'Error personalizado de API';
    httpClient.get('/test').subscribe({
      error: () => {
        expect(notificationService.error).toHaveBeenCalledWith(errorMsg);
        done();
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.flush({ message: errorMsg }, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 0 status (connection error)', (done) => {
    httpClient.get('/test').subscribe({
      error: () => {
        expect(notificationService.error).toHaveBeenCalledWith(
          'No se pudo conectar con el servidor',
        );
        done();
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.error(new ProgressEvent('error'));
  });

  it('should handle other server errors', (done) => {
    httpClient.get('/test').subscribe({
      error: () => {
        expect(notificationService.error).toHaveBeenCalledWith(
          expect.stringContaining('Error del servidor (500)'),
        );
        done();
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
