from django.urls import path, include
from rest_framework.routers import DefaultRouter

from skill.views import SkillsView

router = DefaultRouter()
router.register('', SkillsView, basename='skills')

urlpatterns = [
    path('', include(router.urls)),

]