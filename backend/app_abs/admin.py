from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Professeur)
admin.site.register(Etudiant)

admin.site.register(Filiere)
admin.site.register(EModule)
admin.site.register(Module)
admin.site.register(Semestre)
admin.site.register(Seance)
admin.site.register(Absence)
admin.site.register(Admin)