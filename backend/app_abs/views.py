from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import * 
from django.http import JsonResponse
import json
from .models import *
import random
import string
from django.core.mail import send_mail
from pfa.settings import EMAIL_HOST_USER



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
#from rest_framework_simplejwt.authentication import jwt_required
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404





def generate_random_code(length=6):
    """
    Génère un code aléatoire de la longueur spécifiée.
    """
    characters = string.ascii_letters + string.digits
    code = ''.join(random.choice(characters) for _ in range(length))
    return code

def send_code_to_user(email, code):
    """
    Envoie le code généré à l'utilisateur par e-mail.
    """
    subject = "Code de vérification"
    message = f"Votre code de vérification est : {code}"
    from_email = "abdellahimehdi051@gmail.com"  # Remplacez par votre adresse e-mail
    recipient_list = [email]
    send_mail(subject, message, EMAIL_HOST_USER, recipient_list,fail_silently=False)


def index(request):
    # User = get_user_model()
    # User.objects.create_user(email='prof02@gmail.com',role = 'professeur', password='1234522')
    # prof = Professeur.objects.create(User)
    # prof.save()
    return HttpResponse("Hello, world. You're at the app_abs index.")


class LoginView(APIView):
    @csrf_exempt
    @swagger_auto_schema(
        operation_description="API endpoint to authenticate a user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, example='user@example.com'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, example='mypassword'),
            },
            required=['email', 'password']
        ),
        responses={
            200: openapi.Response(description="Successful login"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            first_register = user.first_register
            role = user.role
            
            if first_register:
                # Récupérer les informations de l'utilisateur
                email = user.email
                role = user.role

                # Générer le token JWT avec les informations de l'utilisateur
                refresh = RefreshToken.for_user(user)
                refresh['user'] = {
                    'email': email,
                    'first_register': first_register,
                    'role': role
                }  # Ajouter les informations de l'utilisateur au token

                return Response({
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh)
                }, status=status.HTTP_200_OK)
            else:
                if role == 'etudiant':
                    try:
                        etudiant = Etudiant.objects.get(user=user)
                        # Récupérer les informations de l'étudiant
                        nom = etudiant.nom
                        prenom = etudiant.prenom
                        filiere = etudiant.filiere.code
                        CIN = etudiant.CIN

                        # Générer le token JWT avec les informations de l'utilisateur
                        refresh = RefreshToken.for_user(user)
                        refresh['user'] = {
                            'email': email,
                            'nom': nom,
                            'prenom': prenom,
                            'filiere': filiere,
                            'first_register': first_register,
                            'CIN': CIN,
                            'role': role,
                        }  # Ajouter les informations de l'utilisateur au token

                        return Response({
                            'access_token': str(refresh.access_token),
                            'refresh_token': str(refresh)
                        }, status=status.HTTP_200_OK)
                    except Etudiant.DoesNotExist:
                        pass
                
                if role == 'professeur':
                    try:
                        professeur = Professeur.objects.get(user=user)
                        # Récupérer les informations du professeur
                        nom = professeur.nom
                        prenom = professeur.prenom
                        tel = professeur.Tel

                        # Générer le token JWT avec les informations de l'utilisateur
                        refresh = RefreshToken.for_user(user)
                        refresh['user'] = {
                            'email': email,
                            'nom': nom,
                            'prenom': prenom,
                            'first_register': first_register,
                            'tel': tel,
                            'role': role,
                        }  # Ajouter les informations de l'utilisateur au token

                        return Response({
                            'access_token': str(refresh.access_token),
                            'refresh_token': str(refresh)
                        }, status=status.HTTP_200_OK)
                    except Professeur.DoesNotExist:
                        pass
                if role == 'admin' :
                    try :
                        # Générer le token JWT avec les informations de l'utilisateur
                        refresh = RefreshToken.for_user(user)
                        refresh['user'] = {
                            'email': email,
                            'first_register': first_register,
                            'role': role,
                        }  # Ajouter les informations de l'utilisateur au token

                        return Response({
                            'access_token': str(refresh.access_token),
                            'refresh_token': str(refresh)
                        }, status=status.HTTP_200_OK)

                    except Professeur.DoesNotExist:
                        pass
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




class UpdateStudent(APIView):
    @swagger_auto_schema(
        operation_description="API endpoint to authenticate an update user view",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, example='user@example.com'),
                'nom': openapi.Schema(type=openapi.TYPE_STRING, example='DAH'),
                'prenom': openapi.Schema(type=openapi.TYPE_STRING, example='Abdallahi'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, example='mypassword'),
                'CIN': openapi.Schema(type=openapi.TYPE_STRING, example='CIN'), 
                'filiere': openapi.Schema(type=openapi.TYPE_STRING, example='filiere'),
            },
            required=['email', 'nom', 'prenom', 'password']
        ),
        responses={
            200: openapi.Response(description="Successful update"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def put(self, request):
        try:
            # Récupérer les données fournies dans la requête POST
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            nom = data.get('nom')
            prenom = data.get('prenom')
            filiere_code = data.get('filiere')
            CIN = data.get('CIN')

            # Récupérer l'objet User correspondant à l'e-mail
            user = get_object_or_404(User, email=email)
            filiere = get_object_or_404(Filiere, code=filiere_code)

            try:
                # Vérifier si un objet Etudiant existe déjà pour cet utilisateur
                etudiant = Etudiant.objects.get(user=user)
            except Etudiant.DoesNotExist:
                # Aucun objet Etudiant existant, créer un nouvel objet Etudiant
                etudiant = Etudiant.objects.create(user=user, filiere=filiere)

            # Mettre à jour les attributs de l'objet Etudiant
            etudiant.nom = nom
            etudiant.prenom = prenom
            etudiant.CIN = CIN
            etudiant.user.first_register = False
            etudiant.user.set_password(password)
            etudiant.user.save()
            etudiant.save()
            return Response({'success': True, 'message': 'Le profil de l\'étudiant a bien été modifié'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'L\'utilisateur n\'existe pas.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception:
            return Response({'error': 'Une erreur s\'est produite lors de la mise à jour du profil de l\'étudiant.'}, status=status.HTTP_401_UNAUTHORIZED)


class Update_Teacher(APIView):
    @swagger_auto_schema(
        operation_description="API endpoint to authenticate an update user view",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, example='user@example.com'),
                'nom': openapi.Schema(type=openapi.TYPE_STRING, example='DAH'),
                'prenom': openapi.Schema(type=openapi.TYPE_STRING, example='Abdallahi'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, example='mypassword'),
                'Tel': openapi.Schema(type=openapi.TYPE_STRING, example='Tel'), 
            },
            required=['email', 'nom', 'prenom', 'password']
        ),
        responses={
            200: openapi.Response(description="Successful update"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def put(self, request):
        try:
            # Récupérer les données fournies dans la requête POST
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            nom = data.get('nom')
            prenom = data.get('prenom')
            Tel = data.get('Tel')

            # Récupérer l'objet User correspondant à l'e-mail
            user = get_object_or_404(User, email=email)

            try:
                # Vérifier si un objet Professeur existe déjà pour cet utilisateur
                professeur = Professeur.objects.get(user=user)
            except Professeur.DoesNotExist:
                # Aucun objet Professeur existant, créer un nouvel objet Professeur
                professeur = Professeur.objects.create(user=user)

            # Mettre à jour les attributs de l'objet Professeur
            professeur.nom = nom
            professeur.prenom = prenom
            professeur.Tel = Tel
            professeur.user.first_register = False
            professeur.user.set_password(password)
            professeur.user.save()
            professeur.save()

            return Response({'success': True, 'message': 'Le profil du professeur a bien été modifié'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'L\'utilisateur n\'existe pas.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception:
            return Response({'error': 'Une erreur s\'est produite lors de la mise à jour du profil du professeur.'}, status=status.HTTP_401_UNAUTHORIZED)


class AddStudent(APIView) :
    @csrf_exempt
    @swagger_auto_schema(
        operation_description="API endpoint to authenticate a update user view",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'liste_email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING, example='user@example.com')),
            },
            required=['liste_email']
        ),
        responses={
                200: openapi.Response(description="Successful adding"),
                400: "Bad Request",
                401: "Unauthorized",
                
            }
        
        )
    def post(self, request):
        try:
            liste_emails = request.data.get('liste_email', [])

            for email in liste_emails:
                # Vérifier si l'utilisateur existe déjà
                user = User.objects.filter(email=email).first()

                if user is None:
                    # L'utilisateur n'existe pas, créer un nouvel utilisateur
                    code = generate_random_code()
                    Email = email  # Remplacez par l'adresse e-mail de l'utilisateur
                    #send_code_to_user(Email, code)
                    user = User.objects.create_user(email=email, role='etudiant', first_register=True,password= '12345')
                    #user.set_password(str(12345))
                    user.save()
                else:
                    # L'utilisateur existe déjà
                    print(f"L'utilisateur avec l'adresse e-mail {email} existe déjà.")

            return Response({'status': 200}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

            
class AddTeacher(APIView) :
    @csrf_exempt
    @swagger_auto_schema(
        operation_description="API endpoint to authenticate a update user view",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'liste_email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING, example='user@example.com')),
            },
            required=['liste_email']
        ),
        responses={
                200: openapi.Response(description="Successful adding"),
                400: "Bad Request",
                401: "Unauthorized",
                
            }
        
        )
    def post(self, request):
        try:
            liste_emails = request.data.get('liste_email', [])
            for email in liste_emails:
                # Vérifier si l'utilisateur existe déjà
                user = User.objects.filter(email=email).first()
                if user is None:
                    # L'utilisateur n'existe pas, créer un nouvel utilisateur
                    code = generate_random_code()
                    Email = email  # Remplacez par l'adresse e-mail de l'utilisateur
                    #send_code_to_user(Email, code)
                    user = User.objects.create_user(email=email, role='professeur', first_register=True,password= '12345')
                    user.save()
                    return Response({'status': 200}, status=status.HTTP_200_OK)
                else:
                    # L'utilisateur existe déjà
                    return Response({'status': "L'utilisateur avec l'adresse e-mail {email} existe déjà."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class GetTeacher(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des professeurs",
        responses={
            400: "Bad Request",
            401: "Unauthorized",
            200: openapi.Response(
                description="Liste des professeurs",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'email' : openapi.Schema(type=openapi.TYPE_STRING),
                            'nom': openapi.Schema(type=openapi.TYPE_STRING),
                            'prenom': openapi.Schema(type=openapi.TYPE_STRING)
                        }
                    )
                )
            )
        }
    )
    def get(self, request):
        try:
            profs = Professeur.objects.all()
            serialized_profs = []
            
            for prof in profs:
                serialized_profs.append({'email': prof.user.email , 'nom': prof.nom, 'prenom': prof.prenom})
        
            return Response(serialized_profs, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
 


class GetEtudiantsParFiliere(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des étudiants par filière",
        manual_parameters=[
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière (ex: INDIA)',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des étudiants par filière",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'mail': openapi.Schema(type=openapi.TYPE_STRING),
                            'nom': openapi.Schema(type=openapi.TYPE_STRING),
                            'prenom': openapi.Schema(type=openapi.TYPE_STRING),
                            'CIN': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            code_filiere = request.GET.get('codeFiliere')

            # Vérifier si la filière existe
            filiere = Filiere.objects.filter(code=code_filiere).first()

            if filiere:
                etudiants = Etudiant.objects.filter(filiere=filiere)
                serialized_etudiants = []

                for etudiant in etudiants:
                    serialized_etudiants.append({
                        'email': etudiant.user.email,
                        'nom': etudiant.nom,
                        'prenom': etudiant.prenom,
                        'CIN': etudiant.CIN,
                    })

                return Response(serialized_etudiants, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)



class AddFiliere(APIView):
    @csrf_exempt
    @swagger_auto_schema(
        operation_description="API endpoint to authenticate an update user view",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'filiere': openapi.Schema(type=openapi.TYPE_STRING, example='Ingénierie numérique en Data Science & IA'),
                'codefiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
            },
            required=['filiere', 'codefiliere']
        ),
        responses={
            200: openapi.Response(description="Successful adding"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def post(self, request):
        try:
            filiere_name = request.data.get('filiere')
            code_filiere = request.data.get('codefiliere')

            # Vérifier si la filière existe déjà
            filiere = Filiere.objects.filter(code=code_filiere).first()

            if filiere is None:
                filiere = Filiere.objects.create(code=code_filiere, nom=filiere_name)
                filiere.save()
                return Response({'status': 200}, status=status.HTTP_200_OK)
            else:
                return Response({'status': f"La filière {code_filiere} existe déjà."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)



class GetFiliere(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des filières",
        responses={
            400: "Bad Request",
            401: "Unauthorized",
            200: openapi.Response(
                description="Liste des filières",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'codefiliere': openapi.Schema(type=openapi.TYPE_STRING),
                            'filiere': openapi.Schema(type=openapi.TYPE_STRING)
                        }
                    )
                )
            )
        }
    )
    def get(self, request):
        try:
            filieres = Filiere.objects.all()
            serialized_filieres = []
            
            for filiere in filieres:
                serialized_filieres.append({'codefiliere': filiere.code, 'filiere': filiere.nom})
        
            return Response(serialized_filieres, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class UpdateFiliere(APIView):
    @swagger_auto_schema(
        operation_description="Modifier une filière",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'ancienCodeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'nouveauCodeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INFO'),
                'nouveauNomFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='Informatique'),
            },
            required=['ancienCodeFiliere', 'nouveauCodeFiliere', 'nouveauNomFiliere']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def put(self, request):
        try:
            ancien_code_filiere = request.data.get('ancienCodeFiliere')
            nouveau_code_filiere = request.data.get('nouveauCodeFiliere')
            nouveau_nom_filiere = request.data.get('nouveauNomFiliere')

            # Vérifier si l'ancienne filière existe
            filiere = Filiere.objects.filter(code=ancien_code_filiere).first()

            if filiere:
                filiere.code = nouveau_code_filiere
                filiere.nom = nouveau_nom_filiere
                filiere.save()
                return Response({'status': 'Success'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class DeleteFiliere(APIView):
    @swagger_auto_schema(
        operation_description="Supprimer une filière",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
            },
            required=['codeFiliere']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def delete(self, request):
        try:
            code_filiere = request.data.get('codeFiliere')

            # Vérifier si la filière existe
            filiere = Filiere.objects.filter(code=code_filiere).first() 

            if filiere:
                filiere.delete()
                return Response({'status': 'Success'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)



class AddSemestre(APIView):
    @csrf_exempt
    @swagger_auto_schema(
        operation_description="API endpoint to add a new semester",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'numero': openapi.Schema(type=openapi.TYPE_INTEGER, example='1 - 2 - 3 - 4 ...'),
                'filiere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
            },
            required=['numero', 'filiere']
        ),
        responses={
            200: openapi.Response(description="Successful adding"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def post(self, request):
        try:
            numero = request.data.get('numero')
            filiere = request.data.get('filiere')

            # Vérifier si la filière existe déjà
            filiere_exist = Filiere.objects.filter(code=filiere).first()
            semester_exist = Semestre.objects.filter(numero=numero,filiere=filiere_exist).first()

            if not filiere_exist:
                return Response({'status': f"La filière {filiere} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if not semester_exist:
                    semestre = Semestre.objects.create(numero=numero, filiere=filiere_exist)
                    semestre.save()
                    return Response({'status': 'Success'}, status=status.HTTP_200_OK)
                return Response({'status': f"Le semestre {numero} existe déjà."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class GetSemestre(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des semestres",
        manual_parameters=[
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière (ex: INDIA)',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des semestres",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'numero': openapi.Schema(type=openapi.TYPE_STRING),
                            'filiere': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            code_filiere = request.GET.get('codeFiliere')

            filiere = Filiere.objects.filter(code=code_filiere).first()
            if filiere:
                semestres = Semestre.objects.filter(filiere=filiere)
                serialized_semestres = []

                for semestre in semestres:
                    serialized_semestres.append({
                        'numero': semestre.numero,
                        'filiere': semestre.filiere.code,
                    })

                return Response(serialized_semestres, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class DeleteSemestre(APIView):
    @swagger_auto_schema(
        operation_description="Supprimer un semestre",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'numeroSemestre': openapi.Schema(type=openapi.TYPE_INTEGER, example='1'),
            },
            required=['codeFiliere', 'numeroSemestre']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def delete(self, request):
        try:
            code_filiere = request.data.get('codeFiliere')
            numero_semestre = request.data.get('numeroSemestre')

            # Vérifier si le semestre existe
            filiere_exist = Filiere.objects.filter(code=code_filiere).first()
            if filiere_exist :
                semestre = Semestre.objects.filter( numero=numero_semestre,filiere=filiere_exist).first()

                if semestre:
                    semestre.delete()
                    return Response({'status': 'Success'}, status=status.HTTP_200_OK)
                else:
                    return Response({'status': 'Le semestre n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': 'Filiere n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        

class AddModule(APIView):
    @swagger_auto_schema(
        operation_description="API endpoint to add a new module",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'numeroSemestre': openapi.Schema(type=openapi.TYPE_INTEGER, example='1'),
                'codeModule': openapi.Schema(type=openapi.TYPE_STRING, example='MATH101'),
                'nomModule': openapi.Schema(type=openapi.TYPE_STRING, example='Mathématiques'),
                'responsableModule': openapi.Schema(type=openapi.TYPE_STRING, example='prof1@gmail.com'),
            },
            required=['codeFiliere', 'numeroSemestre', 'codeModule', 'nomModule', 'responsableModule']
        ),
        responses={
            200: openapi.Response(description="Successful adding"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def post(self, request):
        try:
            code_filiere = request.data.get('codeFiliere')
            numero_semestre = request.data.get('numeroSemestre')
            code = request.data.get('codeModule')
            nom_module = request.data.get('nomModule')
            responsable_module = request.data.get('responsableModule')

            # Vérifier si la filière existe
            filiere = Filiere.objects.filter(code=code_filiere).first()
            if not filiere:
                return Response({'status': f"La filière {code_filiere} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si le semestre existe
            semestre = Semestre.objects.filter(filiere=filiere, numero=numero_semestre).first()
            if not semestre:
                return Response({'status': f"Le semestre {numero_semestre} de la filière {code_filiere} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si le responsable du module existe
            user = User.objects.filter(email=responsable_module).first()
            responsable = Professeur.objects.filter(user=user).first()
           
            #responsable = Professeur.objects.select_related('user').get(user__email=responsable_module)
            if not responsable:
                return Response({'status': f"Le professeur {responsable_module} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Créer le nouveau module
            module = Module.objects.create(
                code=code,
                nom=nom_module,
                semestre=semestre,
                ResponsabeModule=responsable
            )
            module.save()

            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class UpdateModule(APIView):
    @swagger_auto_schema(
        operation_description="API endpoint to update a module",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'ancienCodeModule': openapi.Schema(type=openapi.TYPE_STRING, example='MATH101'),
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'numeroSemestre': openapi.Schema(type=openapi.TYPE_INTEGER, example='1'),
                'newCodeModule': openapi.Schema(type=openapi.TYPE_STRING, example='MATH102'),
                'newNomModule': openapi.Schema(type=openapi.TYPE_STRING, example='Mathématiques II'),
                'newResponsableModule': openapi.Schema(type=openapi.TYPE_STRING, example='prof1@gmail.com'),
            },
            required=['ancienCodeModule', 'codeFiliere', 'numeroSemestre', 'newCodeModule', 'newNomModule', 'newResponsableModule']
        ),
        responses={
            200: openapi.Response(description="Successful update"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def put(self, request):
        try:
            ancien_code_module = request.data.get('ancienCodeModule')
            code_filiere = request.data.get('codeFiliere')
            numero_semestre = request.data.get('numeroSemestre')
            new_code_module = request.data.get('newCodeModule')
            new_nom_module = request.data.get('newNomModule')
            new_responsable_module = request.data.get('newResponsableModule')

            # Vérifier si le module existe
            module = Module.objects.filter(code=ancien_code_module).first()
            if not module:
                return Response({'status': f"Le module {ancien_code_module} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si la filière existe
            filiere = Filiere.objects.filter(code=code_filiere).first()
            if not filiere:
                return Response({'status': f"La filière {code_filiere} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si le semestre existe
            semestre = Semestre.objects.filter(filiere=filiere, numero=numero_semestre).first()
            if not semestre:
                return Response({'status': f"Le semestre {numero_semestre} de la filière {code_filiere} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si le responsable du module existe
            responsable = Professeur.objects.select_related('user').get(user__email=new_responsable_module)
            if not responsable:
                return Response({'status': f"Le professeur {new_responsable_module} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Mettre à jour les informations du module
            module.code = new_code_module
            module.nom = new_nom_module
            module.semestre = semestre
            module.ResponsabeModule = responsable
            module.save()

            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class DeleteModule(APIView):
    @swagger_auto_schema(
        operation_description="API endpoint to delete a module",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'numeroSemestre': openapi.Schema(type=openapi.TYPE_INTEGER, example='1'),
                'codeModule': openapi.Schema(type=openapi.TYPE_STRING, example='MATH101'),
            },
            required=['codeFiliere', 'numeroSemestre', 'codeModule']
        ),
        responses={
            200: openapi.Response(description="Successful deletion"),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def delete(self, request):
        try:
            code_filiere = request.data.get('codeFiliere')
            numero_semestre = request.data.get('numeroSemestre')
            code_module = request.data.get('codeModule')

            # Vérifier si la filière existe
            filiere = Filiere.objects.filter(code=code_filiere).first()
            if not filiere:
                return Response({'status': f"La filière {code_filiere} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si le semestre existe
            semestre = Semestre.objects.filter(filiere=filiere, numero=numero_semestre).first()
            if not semestre:
                return Response({'status': f"Le semestre {numero_semestre} de la filière {code_filiere} n'existe pas."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si le module existe
            module = Module.objects.filter(code=code_module, semestre=semestre).first()
            if not module:
                return Response({'status': f"Le module {code_module} n'existe pas dans le semestre {numero_semestre} de la filière {code_filiere}."}, status=status.HTTP_400_BAD_REQUEST)

            # Supprimer le module
            module.delete()

            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)



class GetModule(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des modules du semestre de la filière concernée",
        manual_parameters=[
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière (ex: INDIA)'
            ),
            openapi.Parameter(
                name='numeroSemestre',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                required=True,
                description='Numéro du semestre (ex: 1)'
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des modules",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'codeModule': openapi.Schema(type=openapi.TYPE_STRING),
                            'nomModule': openapi.Schema(type=openapi.TYPE_STRING),
                            'responsable': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            code_filiere = request.GET.get('codeFiliere')
            numero_semestre = request.GET.get('numeroSemestre')

            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=numero_semestre)
            modules = Module.objects.filter(semestre=semestre)
            
            serialized_modules = []
            for module in modules:
                serialized_modules.append({
                    'codeModule': module.code,
                    'nomModule': module.nom,
                    'responsable' : module.ResponsabeModule.user.email
                })
            
            return Response(serialized_modules, status=status.HTTP_200_OK)
        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Semestre.DoesNotExist:
            return Response({'status': 'Le semestre n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({'status': 'Aucun module trouvé pour ce semestre.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class GetEModule(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des elements de la Module concernée",
        manual_parameters=[
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière (ex: INDIA)'
            ),
            
            openapi.Parameter(
                name='numeroSemestre',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                required=True,
                description='Numéro du semestre (ex: 1)'
            ),
            
        ],
        responses={
            200: openapi.Response(
                description="Liste des modules",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'codeEModule': openapi.Schema(type=openapi.TYPE_STRING),
                            'nomEModule': openapi.Schema(type=openapi.TYPE_STRING),
                            'responsable': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            code_filiere = request.GET.get('codeFiliere')
            numero_semestre = request.GET.get('numeroSemestre')
            #codemod = request.GET.get('Module')

            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=numero_semestre)
            emodules = EModule.objects.filter(semestre=semestre,filiere=filiere)
            
            serialized_modules = []
            for module in emodules:
                serialized_modules.append({
                    'codeEModule': module.code,
                    'nomEModule': module.nom,
                    'responsable' : module.ResponsabeModule.user.email
                })
            
            return Response(serialized_modules, status=status.HTTP_200_OK)
        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Semestre.DoesNotExist:
            return Response({'status': 'Le semestre n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({'status': 'Aucun Emodule trouvé pour ce semestre.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class AddElementModule(APIView):
    @swagger_auto_schema(
        operation_description="Ajouter un élément de module",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'codefiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'numeroSemestre': openapi.Schema(type=openapi.TYPE_INTEGER, example='1'),
                'codeModule': openapi.Schema(type=openapi.TYPE_STRING, example='MATH101'),
                'codeElementModule': openapi.Schema(type=openapi.TYPE_STRING, example='ELEM101'),
                'NomElementModule': openapi.Schema(type=openapi.TYPE_STRING, example='Élément 101'),
                'ResponsabeElementModule': openapi.Schema(type=openapi.TYPE_STRING, example='prof1@gmail.com'),
            },
            required=['codefiliere', 'numeroSemestre', 'codeModule', 'codeElementModule', 'NomElementModule', 'ResponsabeElementModule']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def post(self, request):
        try:
            code_filiere = request.data.get('codefiliere')
            numero_semestre = request.data.get('numeroSemestre')
            code_module = request.data.get('codeModule')
            code_element_module = request.data.get('codeElementModule')
            nom_element_module = request.data.get('NomElementModule')
            responsable_element_module = request.data.get('ResponsabeElementModule')

            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=numero_semestre)
            module = Module.objects.get(code=code_module, semestre=semestre)
            responsable = Professeur.objects.select_related('user').get(user__email=responsable_element_module)
            
            element_module = EModule.objects.create(
                code=code_element_module,
                nom=nom_element_module,
                module=module,
                filiere=filiere,
                semestre=semestre,
                ResponsabeModule=responsable
            )
            element_module.save()
            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Semestre.DoesNotExist:
            return Response({'status': 'Le semestre n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({'status': 'Le module n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Professeur.DoesNotExist:
            return Response({'status': 'Le professeur responsable n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class UpdateElementModule(APIView):
    @swagger_auto_schema(
        operation_description="Modifier un élément de module",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'ancienCodeElementModule': openapi.Schema(type=openapi.TYPE_STRING, example='ELEM101'),
                'codeModule': openapi.Schema(type=openapi.TYPE_STRING, example='MATH101'),
                'codefiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'numeroSemestre': openapi.Schema(type=openapi.TYPE_INTEGER, example='1'),
                'newcodeElementModule': openapi.Schema(type=openapi.TYPE_STRING, example='ELEM102'),
                'newNomElementModule': openapi.Schema(type=openapi.TYPE_STRING, example='Élément 102'),
                'newResponsabeElementModule': openapi.Schema(type=openapi.TYPE_STRING, example='prof1@gmail.com'),
            },
            required=['ancienCodeElementModule', 'codeModule', 'codefiliere', 'numeroSemestre', 'newcodeElementModule', 'newNomElementModule', 'newResponsabeElementModule']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def put(self, request):
        try:
            ancien_code_element_module = request.data.get('ancienCodeElementModule')
            code_module = request.data.get('codeModule')
            code_filiere = request.data.get('codefiliere')
            numero_semestre = request.data.get('numeroSemestre')
            new_code_element_module = request.data.get('newcodeElementModule')
            new_nom_element_module = request.data.get('newNomElementModule')
            new_responsable_element_module = request.data.get('newResponsabeElementModule')

            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=numero_semestre)
            module = Module.objects.get(code=code_module, semestre=semestre)
            responsable = Professeur.objects.select_related('user').get(user__email=new_responsable_element_module)
            

            element_module = EModule.objects.get(
                code=ancien_code_element_module,
                module=module,
                filiere=filiere,
                semestre=semestre
            )

            element_module.code = new_code_element_module
            element_module.nom = new_nom_element_module
            element_module.ResponsabeModule = responsable
            element_module.save()

            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Semestre.DoesNotExist:
            return Response({'status': 'Le semestre n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({'status': 'Le module n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Professeur.DoesNotExist:
            return Response({'status': 'Le professeur responsable n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except EModule.DoesNotExist:
            return Response({'status': 'L\'élément de module n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)



class DeleteElementModule(APIView):
    @swagger_auto_schema(
        operation_description="Supprimer un élément de module",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='INDIA'),
                'numeroSemestre': openapi.Schema(type=openapi.TYPE_INTEGER, example='1'),
                'codeModule': openapi.Schema(type=openapi.TYPE_STRING, example='MATH101'),
                'codeElement': openapi.Schema(type=openapi.TYPE_STRING, example='ELEM101'),
            },
            required=['codeFiliere', 'numeroSemestre', 'codeModule', 'codeElement']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def delete(self, request):
        try:
            code_filiere = request.data.get('codeFiliere')
            numero_semestre = request.data.get('numeroSemestre')
            code_module = request.data.get('codeModule')
            code_element = request.data.get('codeElement')

            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=numero_semestre)
            module = Module.objects.get(code=code_module, semestre=semestre)
            element_module = EModule.objects.get(
                code=code_element,
                module=module,
                filiere=filiere,
                semestre=semestre
            )

            element_module.delete()

            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Semestre.DoesNotExist:
            return Response({'status': 'Le semestre n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({'status': 'Le module n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except EModule.DoesNotExist:
            return Response({'status': 'L\'élément de module n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        

class GetModuleWithElementModule(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des modules avec leurs éléments de module",
        manual_parameters=[
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière (ex: INDIA)',
            ),
            openapi.Parameter(
                name='numeroSemestre',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                required=True,
                description='Numéro du semestre (ex: 1)',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des modules avec leurs éléments de module",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'codeModule': openapi.Schema(type=openapi.TYPE_STRING),
                            'nomModule': openapi.Schema(type=openapi.TYPE_STRING),
                            'elementsModule': openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'codeElement': openapi.Schema(type=openapi.TYPE_STRING),
                                        'nomElement': openapi.Schema(type=openapi.TYPE_STRING),
                                    }
                                )
                            )
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            code_filiere = request.GET.get('codeFiliere')
            numero_semestre = request.GET.get('numeroSemestre')

            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=numero_semestre)
            modules = Module.objects.filter(semestre=semestre)
            
            serialized_modules = []
            for module in modules:
                elements_module = EModule.objects.filter(
                    module=module,
                    filiere=filiere,
                    semestre=semestre
                ).values('code', 'nom')
                
                serialized_elements_module = [
                    {'codeElement': element['code'], 'nomElement': element['nom']}
                    for element in elements_module
                ]
                
                serialized_modules.append({
                    'codeModule': module.code,
                    'nomModule': module.nom,
                    'elementsModule': serialized_elements_module
                })
            
            return Response(serialized_modules, status=status.HTTP_200_OK)
        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Semestre.DoesNotExist:
            return Response({'status': 'Le semestre n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({'status': 'Aucun module trouvé pour ce semestre.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


# -----------------------------------------------------------------------------------------------------------------------------
class GetFiliereByCodeFiliere(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie le nom (libellé) de la filière à partir de son codeFiliere",
        manual_parameters=[
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière',
                example='INDIA',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Nom (libellé) de la filière",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'nomFiliere': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            code_filiere = request.query_params.get('codeFiliere')
            filiere = Filiere.objects.filter(code=code_filiere).first()

            if filiere:
                return Response({'nomFiliere': filiere.nom}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'Filière non trouvée'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class GetStudentByMail(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie les informations de l'étudiant à partir de son adresse e-mail",
        manual_parameters=[
            openapi.Parameter(
                name='mail',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description="Adresse e-mail de l'étudiant",
                example='student@example.com',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Informations de l'étudiant",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'nom': openapi.Schema(type=openapi.TYPE_STRING),
                        'prenom': openapi.Schema(type=openapi.TYPE_STRING),
                        'mail': openapi.Schema(type=openapi.TYPE_STRING),
                        'filiere': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            mail = request.query_params.get('mail')
            etudiant = Etudiant.objects.filter(user__email=mail).first()

            if etudiant:
                return Response({
                    'nom': etudiant.nom,
                    'prenom': etudiant.prenom,
                    'mail': etudiant.user.email,
                    'filiere': etudiant.filiere.nom,
                }, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'Étudiant non trouvé'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class GetProfByMail(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie les informations du professeur à partir de son adresse e-mail",
        manual_parameters=[
            openapi.Parameter(
                name='mail',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Adresse e-mail du professeur',
                example='professeur@example.com',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Informations du professeur",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'nom': openapi.Schema(type=openapi.TYPE_STRING),
                        'prenom': openapi.Schema(type=openapi.TYPE_STRING),
                        'mail': openapi.Schema(type=openapi.TYPE_STRING),
                        'Tel': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            mail = request.query_params.get('mail')
            professeur = Professeur.objects.select_related('user').filter(user__email=mail).first()

            if professeur:
                return Response(
                    {
                        'nom': professeur.nom,
                        'prenom': professeur.prenom,
                        'mail': professeur.user.email,
                        'Tel': professeur.Tel,
                        
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response({'status': 'Professeur non trouvé'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

# class GetElementDeModuleEtModuleParProf(APIView):
#     @swagger_auto_schema(
#         operation_description="Renvoie la liste des modules et des éléments de module enseignés par un professeur",
#         manual_parameters=[
#             openapi.Parameter(
#                 name='emailProf',
#                 in_=openapi.IN_QUERY,
#                 type=openapi.TYPE_STRING,
#                 required=True,
#                 description="Adresse e-mail du professeur",
#                 example="professeur@example.com",
#             ),
#         ],
#         responses={
#             200: openapi.Response(
#                 description="Liste des modules et des éléments de module enseignés par le professeur",
#                 schema=openapi.Schema(
#                     type=openapi.TYPE_ARRAY,
#                     items=openapi.Schema(
#                         type=openapi.TYPE_OBJECT,
#                         properties={
#                             'codeModule': openapi.Schema(type=openapi.TYPE_STRING),
#                             'nomModule': openapi.Schema(type=openapi.TYPE_STRING),
#                             'codeElement': openapi.Schema(type=openapi.TYPE_STRING),
#                             'nomElement': openapi.Schema(type=openapi.TYPE_STRING),
#                             'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING),
#                             'filiere': openapi.Schema(type=openapi.TYPE_STRING),
#                             'semestre': openapi.Schema(type=openapi.TYPE_STRING),
#                         }
#                     )
#                 )
#             ),
#             400: "Bad Request",
#             401: "Unauthorized",
#         }
#     )
#     def get(self, request):
#         try:
#             email_prof = request.query_params.get('emailProf')
#             professeur = Professeur.objects.select_related('user').get(user__email=email_prof)

#             modules = Module.objects.filter(ResponsabeModule=professeur)
#             serialized_data = []

#             for module in modules:
#                 elements_module = EModule.objects.filter(module=module)
#                 for element in elements_module:
#                     serialized_data.append({
#                         'codeModule': module.code,
#                         'nomModule': module.nom,
#                         'codeElement': element.code,
#                         'nomElement': element.nom,
#                         'codeFiliere': element.filiere.code,
#                         'filiere': element.filiere.nom,
#                         'semestre': element.semestre.numero,
#                     })

#             return Response(serialized_data, status=status.HTTP_200_OK)

#         except Professeur.DoesNotExist:
#             return Response({'status': 'Professeur non trouvé'}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class GetElementDeModuleEtModuleParProf(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des modules et des éléments de module enseignés par un professeur",
        manual_parameters=[
            openapi.Parameter(
                name='emailProf',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description="Adresse e-mail du professeur",
                example="professeur@example.com",
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des modules et des éléments de module enseignés par le professeur",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'filiere': openapi.Schema(type=openapi.TYPE_STRING),
                        'semestre': openapi.Schema(type=openapi.TYPE_STRING),
                        'codeModule': openapi.Schema(type=openapi.TYPE_STRING),
                        'nomModule': openapi.Schema(type=openapi.TYPE_STRING),
                        'elementsModule': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'codeElement': openapi.Schema(type=openapi.TYPE_STRING),
                                    'nomElement': openapi.Schema(type=openapi.TYPE_STRING),
                                }
                            )
                        )
                    }
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            email_prof = request.query_params.get('emailProf')
            professeur = Professeur.objects.select_related('user').get(user__email=email_prof)

            modules = Module.objects.filter(ResponsabeModule=professeur)
            serialized_data = []

            for module in modules:
                elements_module = EModule.objects.filter(module=module)
                elements_data = []

                for element in elements_module:
                    elements_data.append({
                        'codeElement': element.code,
                        'nomElement': element.nom,
                    })

                serialized_data.append({
                    'filiere': module.semestre.filiere.code,
                    'semestre': module.semestre.numero,
                    'codeModule': module.code,
                    'nomModule': module.nom,
                    'elementsModule': elements_data,
                })

            return Response(serialized_data, status=status.HTTP_200_OK)

        except Professeur.DoesNotExist:
            return Response({'status': 'Professeur non trouvé'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


from datetime import datetime


# ----------------------------------------------------- NON VER -----------------------------------------------------
class AddSeance(APIView):
    @swagger_auto_schema(
        operation_description="Ajoute une séance",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'date': openapi.Schema(type=openapi.TYPE_STRING, example='d-m-y'),
                'heure': openapi.Schema(type=openapi.TYPE_STRING, example='16h-18h'),
                'code_emodule': openapi.Schema(type=openapi.TYPE_STRING, example='Element M001'),
                'codeModule': openapi.Schema(type=openapi.TYPE_STRING, example='M001'),
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='F001'),
                'codeSemestre': openapi.Schema(type=openapi.TYPE_STRING, example='S1'),
            },
            required=['date', 'heure', 'codeFiliere', 'codeSemestre']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
        }
    )
    def post(self, request):
        try:
            data = request.data
            date = data.get('date')
            heure = data.get('heure')
            code_emodule = data.get('code_emodule')
            code_module = data.get('codeModule')
            code_filiere = data.get('codeFiliere')
            code_semestre = data.get('codeSemestre')

            # Convertir la date et l'heure en objets datetime
            #date = datetime.strptime(date_str, '%d/%m/%Y').date()
            #heure = datetime.strptime(heure_str, '%H:%M').time()
            #heure = heure_str

            # Récupérer les objets correspondants aux codes fournis
            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(numero=code_semestre, filiere=filiere)
            

            if code_emodule == '':
                if code_module:
                    module = Module.objects.get(code=code_module, semestre=semestre)
                    seance = Seance.objects.create(
                        date=date,
                        heure=heure,
                        module=module,
                        filiere=filiere,
                        semestre=semestre
                    )
                    seance.save()
                    return Response({'status': 200}, status=status.HTTP_200_OK)
            elif code_emodule:
                if code_module:
                    module = Module.objects.get(code=code_module, semestre=semestre)
                    e_module = EModule.objects.get(code =code_emodule, module=module, semestre=semestre, filiere=filiere)
                    seance = Seance.objects.create(
                            date=date,
                            heure=heure,
                            module=module,
                            e_module=e_module,
                            filiere=filiere,
                            semestre=semestre
                    )
                    seance.save()
                    return Response({'status': 200}, status=status.HTTP_200_OK)
              
            else:
                return Response({'status': 'Veuillez fournir le code de l\'élément ou du module'}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GetSeance(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des séances pour un élément/module donné",
        manual_parameters=[
            openapi.Parameter(
                name='codeElement',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=False,
                description='Code de elément',
                example='E1',
            ),
            openapi.Parameter(
                name='codeModule',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=False,
                description='Code du module',
                example='M1',
            ),
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière',
                example='INDIA',
            ),
            openapi.Parameter(
                name='numeroSemestre',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                required=True,
                description='Numéro du semestre',
                example='1',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des séances",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'date': openapi.Schema(type=openapi.TYPE_STRING),
                            'heure': openapi.Schema(type=openapi.TYPE_STRING),
                            'e_module': openapi.Schema(type=openapi.TYPE_STRING),
                            'module': openapi.Schema(type=openapi.TYPE_STRING),
                            'filiere': openapi.Schema(type=openapi.TYPE_STRING),
                            'semestre': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            code_element = request.query_params.get('codeElement')
            code_module = request.query_params.get('codeModule')
            code_filiere = request.query_params.get('codeFiliere')
            numero_semestre = request.query_params.get('numeroSemestre')

            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=numero_semestre)

            seances = Seance.objects.filter(
                filiere=filiere,
                semestre=semestre
            )
            
            if code_element:
                module = Module.objects.get(code=code_module, semestre=semestre)
                elements = EModule.objects.filter(code = code_element,module=module, semestre=semestre, filiere=filiere)
                seances = seances.filter(e_module=elements)
                serialized_seances = []
                for seance in seances:
                    serialized_seances.append({
                    'date': seance.date,
                    'heure': seance.heure,
                })

                return Response(serialized_seances, status=status.HTTP_200_OK)

            elif code_element =='':
               if code_module : 
                    module = Module.objects.get(code=code_module, semestre=semestre)
                    seances = seances.filter(module=module)
                    serialized_seances = []
                    for seance in seances:
                        serialized_seances.append({
                            'date': seance.date,
                            'heure': seance.heure,
                        })

                    return Response(serialized_seances, status=status.HTTP_200_OK)

            else:
                return Response({'status': 'Veuillez fournir le code de l\'élément ou du module'}, status=status.HTTP_400_BAD_REQUEST)

            
        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Semestre.DoesNotExist:
            return Response({'status': 'Le semestre n\'existe pas pour cette filière.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


#-------------------------------------------------------------------------------------------------------------@csrf_exempt
from django.db import transaction

# class AddAbsence(APIView):
#     @swagger_auto_schema(
#         operation_description="Stocke les informations d'une absence dans les tables Seance et Absence",
#         request_body=openapi.Schema(
#             type=openapi.TYPE_OBJECT,
#             properties={
#                 'dateSeance': openapi.Schema(type=openapi.TYPE_STRING,example ='dd/mm/yyyy'),
#                 'heureSeance': openapi.Schema(type=openapi.TYPE_STRING, example='09h-11h'),
#                 'mailEtud': openapi.Schema(type=openapi.TYPE_STRING, example='etud@example.com'),
#                 'absence': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
#                 'commentaire': openapi.Schema(type=openapi.TYPE_STRING, example='Absent pour raison médicale'),
#             },
#             required=['dateSeance', 'heureSeance', 'mailEtud', 'absence', 'commentaire']
#         ),
#         responses={
#             200: openapi.Response(description="Absence ajoutée avec succès"),
#             400: "Bad Request",
#             401: "Unauthorized",
#         }
#     )
#     def post(self, request):
#         try:
#             data = request.data
#             date_seance = data.get('dateSeance')
#             heure_seance = data.get('heureSeance')
#             mail_etud = data.get('mailEtud')
#             absence = data.get('absence')
#             commentaire = data.get('commentaire')

#             # Récupérer le professeur en fonction de son adresse e-mail
#             etudiant = Etudiant.objects.select_related('user').get(user__email=mail_etud)


#             # Vérifier si la séance existe
#             seance = Seance.objects.get(
#                 date=date_seance,
#                 heure=heure_seance
#             )
            
#             if not seance:
#                 return Response({'error': 'La séance spécifiée n\'existe pas'}, status=status.HTTP_400_BAD_REQUEST)

#             # Créer l'absence avec la séance correspondante
           
#             absence_obj = Absence.objects.create(
#                 seance=seance,
#                 etudiant=etudiant,
#                 absence=absence,
#                 commentaire=commentaire
#             )
#             absence_obj.save()

#             return Response({'success': True, 'message': 'L\'absence a été ajoutée avec succès'}, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class AddAbsence(APIView):
    @swagger_auto_schema(
        operation_description="Ajoute les absences pour une séance",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'codeFiliere': openapi.Schema(type=openapi.TYPE_STRING, example='F001'),
                'codeModule': openapi.Schema(type=openapi.TYPE_STRING, example='M001'),
                'codeEModule': openapi.Schema(type=openapi.TYPE_STRING, example='EM001'),
                'dateSeance': openapi.Schema(type=openapi.TYPE_STRING, example='dd/mm/yyyy'),
                'heureSeance': openapi.Schema(type=openapi.TYPE_STRING, example='16h-18h'),
                'listeEtudiants': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'mail': openapi.Schema(type=openapi.TYPE_STRING, example='etudiant@example.com'),
                            'commentaire': openapi.Schema(type=openapi.TYPE_STRING, example='Commentaire'),
                            'absence': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                        }
                    )
                ),
            },
            required=['codeFiliere', 'codeModule', 'dateSeance', 'heureSeance', 'listeEtudiants']
        ),
        responses={
            200: "Success",
            400: "Bad Request",
        }
    )
    def post(self, request):
        try:
            data = request.data
            code_filiere = data.get('codeFiliere')
            code_module = data.get('codeModule')
            code_emodule = data.get('codeEModule')
            date_seance = data.get('dateSeance')
            heure_seance = data.get('heureSeance')
            liste_etudiants = data.get('listeEtudiants')

            # Récupérer les objets correspondants aux codes fournis
            filiere = Filiere.objects.get(code=code_filiere)
            module = Module.objects.get(code=code_module, filiere=filiere)
            e_module = None

            if code_emodule:
                e_module = EModule.objects.get(code=code_emodule, module=module, filiere=filiere)

            seance = Seance.objects.get(date=date_seance, heure=heure_seance, e_module=e_module, module=module, filiere=filiere)

            # Parcourir la liste des étudiants et ajouter les absences
            for etudiant_data in liste_etudiants:
                mail = etudiant_data.get('mail')
                commentaire = etudiant_data.get('commentaire')
                absence = etudiant_data.get('absence')

                etudiant = Etudiant.objects.get(user__email=mail)

                Absence.objects.create(seance=seance, etudiant=etudiant, absence=absence, commentaire=commentaire)

            return Response({'status': 200}, status=status.HTTP_200_OK)

        except Filiere.DoesNotExist:
            return Response({'status': 'La filière n\'existe pas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({'status': 'Le module n\'existe pas pour cette filière.'}, status=status.HTTP_400_BAD_REQUEST)
        except EModule.DoesNotExist:
            return Response({'status': 'L\'élément de module n\'existe pas pour ce module.'}, status=status.HTTP_400_BAD_REQUEST)
        except Seance.DoesNotExist:
            return Response({'statusDésolé, la seance n\'existe pas pour ce module.'}, status=status.HTTP_400_BAD_REQUEST)
 
            
class GetSeanceProf(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des séances créées par un professeur pour un élément/module spécifique, un semestre et une filière donnés",
        manual_parameters=[
            openapi.Parameter(
                name='emailProf',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Adresse e-mail du professeur',
                example='professeur@example.com',
            ),
            openapi.Parameter(
                name='codeElement',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=False,
                description='Code de l\'élément/module',
                example='ELE01',
            ),
            openapi.Parameter(
                name='codeModule',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=False,
                description='Code du module',
                example='MOD01',
            ),
            openapi.Parameter(
                name='codeSemestre',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code du semestre',
                example='S1',
            ),
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière',
                example='INFO',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des séances créées",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'date': openapi.Schema(type=openapi.TYPE_STRING),
                            'heure': openapi.Schema(type=openapi.TYPE_STRING),
                            'e_module': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'code': openapi.Schema(type=openapi.TYPE_STRING),
                                    'nom': openapi.Schema(type=openapi.TYPE_STRING),
                                }
                            ),
                            'filiere': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'code': openapi.Schema(type=openapi.TYPE_STRING),
                                    'nom': openapi.Schema(type=openapi.TYPE_STRING),
                                }
                            ),
                            'semestre': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'numero': openapi.Schema(type=openapi.TYPE_STRING),
                                    'annee': openapi.Schema(type=openapi.TYPE_STRING),
                                }
                            ),
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            email_prof = request.query_params.get('emailProf')
            code_element = request.query_params.get('codeElement')
            code_module = request.query_params.get('codeModule')
            code_semestre = request.query_params.get('codeSemestre')
            code_filiere = request.query_params.get('codeFiliere')

            professeur = Professeur.objects.get(user__email=email_prof)
            filiere = Filiere.objects.get(code=code_filiere)
            semestre = Semestre.objects.get(filiere=filiere, numero=code_semestre)

            element_module = EModule.objects.get(code=code_element, filiere =filiere,semestre=semestre,ResponsabeModule= professeur)
           
            seances = Seance.objects.filter(
                e_module=element_module,
                filiere=filiere,
                semestre=semestre,
            )

            seances_list = []
            for seance in seances:
                seances_list.append({
                    'date': seance.date,
                    'heure': seance.heure,
                    # 'e_module': {
                    #     'code': seance.e_module.code,
                    #     'nom': seance.e_module.nom,
                    # },
                    # 'filiere': {
                    #     'code': seance.filiere.code,
                    #     'nom': seance.filiere.nom,
                    # },
                    # 'semestre': {
                    #     'numero': seance.semestre.numero,
                    # },
                })

            return Response(seances_list, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class GetAbsence(APIView):
    @swagger_auto_schema(
        operation_description="Renvoie la liste des absences pour une séance donnée, associée à un professeur, un élément/module, un semestre et une filière spécifiques",
        manual_parameters=[
            openapi.Parameter(
                name='emailEtud',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Adresse e-mail du etudiant',
                example='etud@example.com',
            ),
            openapi.Parameter(
                name='codeElement',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=False,
                description='Code de l\'élément/module',
                example='ELE01',
            ),
            openapi.Parameter(
                name='codeModule',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=False,
                description='Code du module',
                example='MOD01',
            ),
            openapi.Parameter(
                name='codeSemestre',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code du semestre',
                example='S1',
            ),
            openapi.Parameter(
                name='codeFiliere',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Code de la filière',
                example='INFO',
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des absences",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'seance': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'date': openapi.Schema(type=openapi.TYPE_STRING),
                                    'heure': openapi.Schema(type=openapi.TYPE_STRING),
                                    # 'e_module': openapi.Schema(
                                    #     type=openapi.TYPE_OBJECT,
                                    #     properties={
                                    #         'code': openapi.Schema(type=openapi.TYPE_STRING),
                                    #         'nom': openapi.Schema(type=openapi.TYPE_STRING),
                                    #     }
                                    # ),
                                    # 'filiere': openapi.Schema(
                                    #     type=openapi.TYPE_OBJECT,
                                    #     properties={
                                    #         'code': openapi.Schema(type=openapi.TYPE_STRING),
                                    #         'nom': openapi.Schema(type=openapi.TYPE_STRING),
                                    #     }
                                    # ),
                                    # 'semestre': openapi.Schema(
                                    #     type=openapi.TYPE_OBJECT,
                                    #     properties={
                                    #         'numero': openapi.Schema(type=openapi.TYPE_STRING),
                                    #         'annee': openapi.Schema(type=openapi.TYPE_STRING),
                                    #     }
                                    # ),
                                }
                            ),
                            'absence': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            'commentaire': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            ),
            400: "Bad Request",
            401: "Unauthorized",
        }
    )
    def get(self, request):
        try:
            # Récupérer les paramètres de requête
            email_etud = request.GET.get('emailEtud')
            code_element = request.GET.get('codeElement')
            code_module = request.GET.get('codeModule')
            code_semestre = request.GET.get('codeSemestre')
            code_filiere = request.GET.get('codeFiliere')

            # Récupérer l'objet Professeur correspondant à l'e-mail
            etud = Professeur.objects.get(user__email=email_etud)

            # Filtrer les absences en fonction des paramètres de requête
            absences = Absence.objects.filter(
                etudiant= etud,
                seance__e_module__code=code_element,
                seance__e_module__module__code=code_module,
                seance__semestre__numero=code_semestre,
                seance__filiere__code=code_filiere
            )

            # Construire la liste des absences
            absences_list = []
            for absence in absences:
                absences_list.append({
                    'seance': {
                        'date': absence.seance.date,
                        'heure': absence.seance.heure,
                    },
                    'absence': absence.absence,
                    'commentaire': absence.commentaire,
                })

            return Response(absences_list, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)












# class LoginView(APIView):
#     @swagger_auto_schema(
#         operation_description="API endpoint to authenticate a user",
#         request_body=openapi.Schema(
#             type=openapi.TYPE_OBJECT,
#             properties={
#                 'email': openapi.Schema(type=openapi.TYPE_STRING, example='user@example.com'),
#                 'password': openapi.Schema(type=openapi.TYPE_STRING, example='mypassword'),
#             },
#             required=['email', 'password']
#         ),
#         responses={
#             200: openapi.Response(description="Successful login"),
#             400: "Bad Request",
#             401: "Unauthorized",
            
#         }
#     )
#     def post(self, request):
#         # Votre logique de connexion ici
#         email = request.data.get('email')
#         password = request.data.get('password')

#         user = authenticate(email=email, password=password)
#         if user is not None:
#             login(request,user)
#             user_info = {'email': user.email}
#             token, _ = Token.objects.get_or_create(user=user)
#             return Response({'token': token.key,'message': 'Login successful', 'user_info': user_info}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Invalid credentials',},status=status.HTTP_401_UNAUTHORIZED)


  
    





# def index(request):
#     User = get_user_model()
     
#     User.objects.create_user(email='a@example.com', password='aaa')

#     return HttpResponse("Hello, world. You're at the app_abs index.")
