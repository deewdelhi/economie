from django.urls import path, include
from rest_framework.routers import DefaultRouter

from preference.views import PreferenceView

router = DefaultRouter()
router.register('', PreferenceView, basename='preferences')

urlpatterns = [
    path('', include(router.urls)),

]