from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user.views import RegularUserList, UserRegisterView

router = DefaultRouter()
router.register('', RegularUserList, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('dj-rest-auth/registration/', UserRegisterView.as_view(), name='register'),

]