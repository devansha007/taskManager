from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated  
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer
from tasks.tasks import send_welcome_email 


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset           = User.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        print("INCOMING DATA:", request.data)  # <-- add this
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            print("ERROR IN REGISTER:", e)
            raise
    def perform_create(self, serializer):
        user = serializer.save()
        try:
            send_welcome_email.delay(user.id)
        except Exception as e:
            print(f"Warning: Could not queue welcome email: {e}")

class MeView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# from rest_framework import generics, permissions
# from django.contrib.auth import get_user_model
# from .serializers import RegisterSerializer

# User = get_user_model()

# class RegisterView(generics.CreateAPIView):
#     queryset           = User.objects.all()
#     serializer_class   = RegisterSerializer
#     permission_classes = [permissions.AllowAny]  # anyone can register, no token needed


## Now Test the Full Flow

# Run the server and test these 3 steps in the DRF browsable UI or Postman:

# # **Step 1 — Register a user:**

# POST http://127.0.0.1:8000/api/auth/register/
# Body (JSON):
# {
    #     "email": "alex@test.com",
    #     "username": "alex",
    #     "password": "testpass123",
    #     "password2": "testpass123"
# }
# # ```

# # **Step 2 — Login to get tokens:**
# # ```
# POST http://127.0.0.1:8000/api/auth/login/
# Body (JSON):
# {
#     "email": "alex@test.com",
#     "password": "testpass123"
# }