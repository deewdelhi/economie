from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user import views
from user.views import AuthenticationView, RegularUserList, UserRegisterView

router = DefaultRouter()
router.register("", RegularUserList, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("dj-rest-auth/registration/",
         UserRegisterView.as_view(),
         name="register"),
    path("dj-rest-auth/login/",
         AuthenticationView.as_view(),
         name="rest_login"),
    path("<int:user_id>/rate/", views.rate_user)
]
