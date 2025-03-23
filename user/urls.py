from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user.views import RegularUserList

router = DefaultRouter()
router.register('', RegularUserList, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]