import os
import sys
import django
from django.utils import timezone
from datetime import timedelta
import random

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from user.models import User
from event.models import Event
from skill.models import Skill
from preference.models import Preference


skill_names = [
    "Prim ajutor", "Organizare evenimente", "Comunicare", "Scriere rapoarte",
    "Gestionare social media", "Limbi străine", "Mentorat", "Fotografie",
    "Design grafic", "Programare", "Coordonare echipă", "Logistică",
    "Educație", "Management voluntari", "Consultanță juridică"
]

preference_names = [
    "Mediu", "Educație", "Sănătate", "Drepturile omului", "Animale",
    "Dezvoltare comunitară", "Ajutor umanitar", "Cultură și artă",
    "Sport și recreere", "Tehnologie", "Inovație socială", "Tineret",
    "Seniori", "Transport și logistică", "Sărăcie și excluziune socială"
]

event_names = [
    "Curățenie în parc", "Maraton caritabil", "Atelier de educație digitală",
    "Campanie de donare sânge", "Plantare de copaci", "Sprijin pentru bătrâni",
    "Festival cultural", "Workshop de fotografie", "Voluntariat la adăpost animale",
    "Proiect de mentorat școlar", "Campanie de conștientizare a sănătății",
    "Sesiune de reciclare creativă", "Ajutor pentru refugiați", "Colectare de haine",
    "Ziua voluntarului"
]

real_names = [
    "ana.popescu", "mihai.ionescu", "george.dumitru", "elena.marin",
    "alina.tudor", "andrei.petrescu", "ioana.stefan", "daniela.rusu",
    "bogdan.vasilescu", "cristina.neagu", "alexandru.ciobanu", "mihaela.dragan",
    "raluca.popa", "claudiu.nistor", "valentina.dan", "maria.gheorghe",
    "vlad.ionescu", "gabriela.popa", "stefan.ciobanu", "alexa.nita",
    "lorena.matei", "florin.dobre", "silvia.muntean", "daniel.toma",
    "claudia.brad", "sebastian.marcu", "irina.cazacu", "alexandru.dinca",
    "sandra.balan", "marcel.vlad"
]

# Creează skills și preferences
skills = []
for skill in skill_names:
    obj, _ = Skill.objects.get_or_create(name=skill)
    skills.append(obj)

preferences = []
for pref in preference_names:
    obj, _ = Preference.objects.get_or_create(name=pref)
    preferences.append(obj)


users = []
for i in range(30):
    username = real_names[i]
    email = f"{username}@gmail.com"
    user, created = User.objects.get_or_create(username=username, defaults={"email": email})
    if created:
        user.set_password("parola123")
        user.role = random.choices(["individual", "company"], weights=[0.8, 0.2])[0]
        user.description = f"Descriere pentru {username}"
        user.rating = random.randint(0, 5)
        user.date_of_birth = timezone.now().date() - timedelta(days=random.randint(18*365, 60*365))
        user.save()
    user.skills.set(random.sample(skills, k=random.randint(3,5)))
    user.preferences.set(random.sample(preferences, k=random.randint(2,4)))
    users.append(user)

# Creează evenimente
events = []
for i, event_name in enumerate(event_names):
    creator = random.choice(users)
    # Date start și end în viitor, între 1 și 30 zile
    start_date = timezone.now() + timedelta(days=random.randint(1,30))
    end_date = start_date + timedelta(days=random.randint(1,3))
    event, created = Event.objects.get_or_create(
        name=event_name,
        defaults={
            "description": f"Descriere pentru evenimentul {event_name}",
            "starting_date": start_date,
            "ending_date": end_date,
            "creator": creator,
            "capacity": random.randint(10, 100),
            "location": random.choice(["București", "Cluj-Napoca", "Timișoara", "Iași", "Brașov"]),
        }
    )
    event.preferences.set(random.sample(preferences, k=random.randint(1,3)))
    event.skills.set(random.sample(skills, k=random.randint(1,3)))
    events.append(event)

# Leagă random utilizatorii la evenimente ca participanți (20-40% șanse)
for user in users:
    joined_events = random.sample(events, k=random.randint(0,5))
    for event in joined_events:
        if random.random() < 0.4:
            user.events.add(event)

print("Seed completed!")
