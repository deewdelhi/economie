from django.core.paginator import Paginator
from requests import Response
from rest_framework import viewsets, status

from event.models import Event
from event.serializers import EventSerializer


class EventList(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        # Get the instance of the event
        # if "user" in self.request.GET:
        #     user = int(self.request.GET["user"])
        # instance = self.get_object()
        #
        # # Check if the current user is the creator of the event
        # if user != instance.creator.id:
        #     return Response({'detail': 'You are not allowed to update this event.'}, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        events = Event.objects.all()
        request_data = self.request.GET
        if 'name' in request_data:
            events = events.filter(name__icontains=request_data['name'])
        if 'starting_date' in request_data:
            events = events.filter(starting_date__lt=request_data['starting_date'])
        if 'ending_date' in request_data:
            events = events.filter(ending_date__gt=request_data['ending_date'])
        if 'creator' in request_data:
            events = events.filter(creator=request_data['creator'])
        if 'capacity' in request_data:
            events = events.filter(capacity__gte=request_data['capacity'])
        if 'location' in request_data:
            events = events.filter(location__icontains=request_data['location'])
        page_number = request_data.get('page')

        if page_number:
            paginator = Paginator(events, 10)
            page_obj = paginator.get_page(page_number)
            events = page_obj.object_list
        return events

# class RecipeUserView(APIView):
#
#     def get(self, request, id):
#         events = Recipe.objects.filter(creator=id)
#         request_data = self.request.GET
#         if 'difficulty' in request_data:
#             events = events.filter(difficulty=int(request_data['difficulty']))
#         if 'name' in request_data:
#             events = events.filter(name__icontains=request_data['name'])
#         if 'ingredients' in request_data:
#             events = events.filter(ingredients__name__icontains=request_data['ingredients'])
#         if 'time' in request_data:
#             events = events.filter(time_min__lte=int(request_data['time']), time_max__gte=int(request_data['time']))
#         if 'number_people' in request_data:
#             events = events.filter(number_people=request_data['number_people'])
#         if 'type_recipe' in request_data:
#             events = events.filter(type_recipe=request_data['type_recipe'])
#         if 'estimated_price_min' in request_data:
#             if 'estimated_price_max' in request_data:
#                 events = events.filter(estimated_price__gte=int(request_data['estimated_price_min']),
#                                                 estimated_price__lte=int(request_data['estimated_price_max']))
#             else:
#                 events = events.filter(estimated_price__gte=int(request_data['estimated_price_min']))
#         elif 'estimated_price_max' in request_data:
#             events = events.filter(estimated_price__lte=int(request_data['estimated_price_max']))
#         if 'total_calories_min' in request_data:
#             if 'total_calories_max' in request_data:
#                 events = events.filter(total_calories__gte=int(request_data['total_calories_min']),
#                                                 total_calories__lte=int(request_data['total_calories_max']))
#             else:
#                 events = events.filter(total_calories__gte=int(request_data['total_calories_min']))
#         elif 'total_calories_max' in request_data:
#             events = events.filter(total_calories__lte=int(request_data['total_calories_max']))
#         page_number = request_data.get('page')
#
#         if page_number:
#             paginator = Paginator(events, 9)
#             page_obj = paginator.get_page(page_number)
#             events = page_obj.object_list
#
#         serializer = eventserializer(events, many=True)
#         return Response(serializer.data)