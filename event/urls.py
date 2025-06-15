from django.urls import include, path
from rest_framework.routers import DefaultRouter

from event import views
from event.views import EventList, EventUserView, EventParticipantsView, join_event

router = DefaultRouter()
router.register('', EventList, basename='events')

urlpatterns = [
    path('', include(router.urls)),

    path('user/<int:id>/', EventUserView.as_view(), name='event-user'),
    path('<int:event_id>/participants/', EventParticipantsView.as_view(), name='event-participants'),
path('<int:event_id>/join/', views.join_event, name='join-event'),

]