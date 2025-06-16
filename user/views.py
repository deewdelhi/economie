from dj_rest_auth.registration.views import RegisterView
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dj_rest_auth.views import LoginView
from rest_framework.authtoken.models import Token

from event.serializers import EventSerializer
from user.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated


from user.models import User
from user.serializers import (
    AuthenticationSerializer,
    UserSerializer,
    RegisterUserSerializer,
)


class RegularUserList(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class UserRegisterView(RegisterView):
    serializer_class = RegisterUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class AuthenticationView(LoginView):
    serializer_class = AuthenticationSerializer

    def post(self, request, *args, **kwargs):
        serializer = AuthenticationSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        self.user = get_object_or_404(
            User, username=serializer.validated_data["username"]
        )

        token, created = Token.objects.get_or_create(user=self.user)
        return Response(
            {
                "key": token.key,
                "id": self.user.id,
                "username": self.user.username,
                "role": self.user.role,
            },
            status=status.HTTP_200_OK,
        )

@api_view(['POST'])
def rate_user(request, user_id):
    rating = int(request.GET.get('rate'))
    try:
        user = User.objects.get(pk=user_id)
        user.rating += rating
        user.rated_by += 1
        user.save()
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"message": "Successfully rated the user."}, status=status.HTTP_200_OK)



@api_view(['GET'])
def user_joined_events(request, user_id):
    user = User.objects.get(pk=user_id)
    joined_events = user.events.all()
    serializer = EventSerializer(joined_events, many=True)
    return Response(serializer.data)