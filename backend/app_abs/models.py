# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin



class UserManager(BaseUserManager):
    def create_user(self, email, role,first_register= True,password=1234):
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        role = role
        first_register = first_register
        user = self.model(email=email, role = role,first_register = first_register)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, role, first_register=False, password=None):
        email = self.normalize_email(email)
        role = role
        first_register = first_register

        user = self.create_user(email=email, role=role, first_register=first_register, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user



class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=100)
    first_register = models.BooleanField(default=True)
    password  = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_register','role']

    objects = UserManager()



class Filiere(models.Model):
    code = models.CharField(unique=True,verbose_name='code_filiere', max_length=255)
    nom = models.CharField(verbose_name='nom_filiere',max_length=255)

class Etudiant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE)
    nom = models.CharField(verbose_name='nom', max_length=100)
    prenom = models.CharField(verbose_name='prenom', max_length=100)
    CIN = models.CharField(verbose_name='CIN', max_length=8, unique=True)

    #objects = EtudManager()

    def __str__(self):
        return f"{self.prenom} {self.nom}"
    
    class Meta:
        verbose_name = 'etudiant'
        verbose_name_plural = 'etudiants'


class Professeur(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nom = models.CharField(verbose_name='nom', max_length=100)
    prenom = models.CharField(verbose_name='prenom', max_length=100)
    Tel = models.CharField(verbose_name='Tel', max_length=8, unique=True)


    def __str__(self):
        return f"{self.prenom} {self.nom}"
    
    class Meta:
        verbose_name = 'professeur'
        verbose_name_plural = 'professeurs'

class Admin(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nom = models.CharField(verbose_name='nom', max_length=100)
    prenom = models.CharField(verbose_name='prenom', max_length=100)
    Tel = models.CharField(verbose_name='Tel', max_length=8, unique=True)


    def __str__(self):
        return f"{self.prenom} {self.nom}"
    
    class Meta:
        verbose_name = 'admin'
        
class Promo(models.Model):
    annee = models.CharField(unique=True,verbose_name='annee promo', max_length=255)


class Semestre(models.Model) :
    numero = models.IntegerField(verbose_name='num_sem')
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE)
    annee = models.CharField(verbose_name='annee promo', max_length=255)

    def __str__(self):
        return f"Semestre {self.numero} de la filière {self.filiere.nom}"

class Module(models.Model):
    code = models.CharField(max_length=255)
    nom = models.CharField(verbose_name='code_module', max_length=255)
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE)
    ResponsabeModule = models.ForeignKey(Professeur, on_delete=models.CASCADE)

class EModule(models.Model):
    code = models.CharField(verbose_name='code_element_module', max_length=255)
    nom = models.CharField(max_length=255)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE)
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE)
    ResponsabeModule = models.ForeignKey(Professeur ,on_delete=models.CASCADE)

class Seance(models.Model):
    date = models.CharField(max_length=255)
    heure = models.CharField(max_length=255)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    e_module = models.ForeignKey(EModule, on_delete=models.CASCADE,null=True)
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE)
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE)
    

class Absence(models.Model):
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE)
    etudiant = models.ForeignKey(Etudiant ,on_delete=models.CASCADE)
    absence = models.BooleanField()
    commentaire = models.CharField(verbose_name='commentaire', max_length=255)   
 