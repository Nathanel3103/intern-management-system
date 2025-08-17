from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def backend_status(request):
    """
    Simple status endpoint to confirm Django backend is running
    """
    return JsonResponse({
        'status': 'Backend is running successfully',
        'message': 'Django API server is operational',
        'available_endpoints': [
            '/api/auth/login/',
            '/api/auth/register/',
            '/api/auth/refresh/',
            '/admin/'
        ]
    })
