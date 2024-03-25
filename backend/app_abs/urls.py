from django.urls import path
from . import views
from .views import *
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import re_path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Votre code continue ici...
schema_view = get_schema_view(
   openapi.Info(
      title="PFA : Gestion de l'Absence",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
   path("",views.index, name="index"),
   path('api/login/', LoginView.as_view(), name='login'),
   
   # ------------------------------- student  -------------------------------
   path('api/UpdateStudent/', UpdateStudent.as_view(), name='UpdateStudent'),
   path('api/AddStudent/', AddStudent.as_view(), name='AddStudent'),
   path('api/GetEtudiantsParFiliere/', GetEtudiantsParFiliere.as_view(), name='GetEtudiantsParFiliere'), 
   path('api/GetStudentByMail/', GetStudentByMail.as_view(), name='GetStudentByMail'),
   
   # ------------------------------- Teacher  -------------------------------
   path('api/AddTeacher/', AddTeacher.as_view(), name='AddTeacher'),
   path('api/GetTeacher/', GetTeacher.as_view(), name='GetTeacher'),
   path('api/Update_Teacher/', Update_Teacher.as_view(), name='Update_Teacher'),
   path('api/GetProfByMail/', GetProfByMail.as_view(), name='GetProfByMail'),
   
   # ------------------------------- Filiere  -------------------------------
   path('api/AddFiliere/', AddFiliere.as_view(), name='AddFiliere'),
   path('api/GetFiliere/', GetFiliere.as_view(), name='GetFiliere'), 
   path('api/UpdateFiliere/', UpdateFiliere.as_view(), name='UpdateFiliere'), 
   path('api/DeleteFiliere/', DeleteFiliere.as_view(), name='DeleteFiliere'),
   path('api/GetFiliereByCodeFiliere/', GetFiliereByCodeFiliere.as_view(), name='GetFiliereByCodeFiliere'),
   
   # ------------------------------- Semestre  -------------------------------
   path('api/AddSemestre/', AddSemestre.as_view(), name='AddSemestre'),
   path('api/GetSemestre/', GetSemestre.as_view(), name='GetSemestre'),
   path('api/DeleteSemestre/', DeleteSemestre.as_view(), name='DeleteSemestre'),
   
   
   # ------------------------------- Module  -------------------------------
   path('api/AddModule/', AddModule.as_view(), name='AddModule'),
   path('api/UpdateModule/', UpdateModule.as_view(), name='UpdateModule'),
   path('api/DeleteModule/', DeleteModule.as_view(), name='DeleteModule'),
   path('api/GetModule/', GetModule.as_view(), name='GetModule'),
   
   
   
   # ------------------------------- ElementModule  -------------------------------
   path('api/AddElementModule/', AddElementModule.as_view(), name='AddElementModule'),
   path('api/UpdateElementModule/', UpdateElementModule.as_view(), name='UpdateElementModule'),
   path('api/GetEModule/', GetEModule.as_view(), name='GetEModule'),
   path('api/DeleteElementModule/', DeleteElementModule.as_view(), name='DeleteElementModule'),
   
   path('api/GetModuleWithElementModule/', GetModuleWithElementModule.as_view(), name='GetModuleWithElementModule'),
   
   path('api/GetElementDeModuleEtModuleParProf/', GetElementDeModuleEtModuleParProf.as_view(), name='GetElementDeModuleEtModuleParProf'),
   
   
   
   # ------------------------------- Seance  -------------------------------
   path('api/AddSeance/', AddSeance.as_view(), name='AddSeance'),
   path('api/GetSeance/', GetSeance.as_view(), name='GetSeance'),
   path('api/GetSeanceProf/', GetSeanceProf.as_view(), name='GetSeanceProf'),
   
   
   
   
   
   # ------------------------------- Absence  -------------------------------
   path('api/AddAbsence/', AddAbsence.as_view(), name='AddAbsence'),
   path('api/GetAbsence/', GetAbsence.as_view(), name='GetAbsence'),
   
   
   # ------------------------------- Swagger  -------------------------------
   
   re_path(r'^swagger(?P<format>\.json\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   #re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   
    # URLs pour l'obtention du token JWT
   path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]

