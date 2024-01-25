from django.urls import path, include
from rest_framework_nested import routers
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from .controllers import *

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', UsersController, basename='users')
router.register(r'evals', PeerEvalsController, basename='eval')
router.register(r'classes', ClassRoomsController, basename='class')


classes_router = routers.NestedSimpleRouter(router, r'classes', lookup='class')
classes_router.register(r'members', ClassMembersController, basename='class-members')
classes_router.register(r'teams', TeamsController, basename='class-teams')

team_members = routers.NestedSimpleRouter(classes_router, r'teams', lookup='team')
team_members.register(r'members', TeamMembersController, basename='team-members')

teknoplat_router = routers.DefaultRouter(trailing_slash=False)
teknoplat_router.register('meetings', MeetingsController, basename='meeting')
teknoplat_router.register('pitches', PitchesController, basename='pitches')
teknoplat_router.register('ratings', RatingsController, basename='ratings')
teknoplat_router.register('remarks', RemarksController, basename='remarks')
teknoplat_router.register('idea_validation', ChatbotsController, basename='idea_validation')

urlpatterns = router.urls
urlpatterns += classes_router.urls
urlpatterns += team_members.urls
urlpatterns += teknoplat_router.urls

urlpatterns += [
    path('tokens/', include([
        path('acquire', TokensController.as_view(), name='acquire_token_pair'),
        path('refresh', TokenRefreshView.as_view(), name='refresh_token'),
        path('verify', TokenVerifyView.as_view(), name='verify_token'),
    ]))
]