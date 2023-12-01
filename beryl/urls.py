
from django.contrib import admin
from django.urls import path

from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    path('process-image/', views.process_image_from_frontend),
    path('fetch-results/', views.fetch_results),
]
