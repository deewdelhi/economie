from django.urls import include, path
from rest_framework.routers import DefaultRouter

from event.views import EventList, EventUserView

router = DefaultRouter()
router.register('', EventList, basename='events')

urlpatterns = [
    path('', include(router.urls)),

    path('user/<int:id>/', EventUserView.as_view(), name='event-user'),

]