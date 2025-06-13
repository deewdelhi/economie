from django.urls import path, include
from rest_framework.routers import DefaultRouter

from skill.views import SkillsView,  UserSkillsWithEvents

router = DefaultRouter()
router.register('', SkillsView, basename='skills')

urlpatterns = [
    path('', include(router.urls)),
    path('user/<int:id>/', UserSkillsWithEvents.as_view(), name='skill-user'),

]