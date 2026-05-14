from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth routes
    path('api/auth/', include('users.urls')),        # → /api/auth/register/ and /api/auth/me/
    path('api/auth/login/',   TokenObtainPairView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),

    # Task routes
    path('api/tasks/', include('tasks.urls')),
]


# from django.contrib import admin
# from django.urls import path, include
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/auth/register/', include('users.urls')),
#     path('api/auth/login/',    TokenObtainPairView.as_view()),
#     path('api/auth/refresh/',  TokenRefreshView.as_view()),
#     path('api/auth/me/',       include('users.urls')),
#     path('api/',               include('tasks.urls')),
# ]

# from django.contrib import admin
# from django.urls import path, include
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('tasks.urls')),

#     # JWT auth endpoints — these come free from simplejwt
#     path('api/auth/login/',   TokenObtainPairView.as_view()),  # get tokens
#     path('api/auth/refresh/', TokenRefreshView.as_view()),     # get new access token
#     path('api/auth/register/', include('users.urls')),         # our custom register
# ]