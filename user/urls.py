from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user.views import AuthentificationView, RegularUserList, UserRegisterView

router = DefaultRouter()
router.register("", RegularUserList, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("dj-rest-auth/registration/",
         UserRegisterView.as_view(),
         name="register"),
    path("dj-rest-auth/login/",
         AuthentificationView.as_view(),
         name="rest_login"),
]
# asdasd