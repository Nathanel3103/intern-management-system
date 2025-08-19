from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Default behavior but use email instead of username
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        
        # Add custom claims
        data['user'] = {
            'id': self.user.id,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'email': self.user.email,
            'role': self.user.role,
        }
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, write_only=True, required=False)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'role']
        extra_kwargs = {
            'email': {'required': True},
            'password': {'write_only': True},
            'name': {'write_only': True},
            'role': {'required': False, 'write_only': True},
        }

    def create(self, validated_data):
        # Split the full name into first and last name
        full_name = validated_data.pop('name', '')
        name_parts = full_name.strip().split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Get role from validated data, default to ADMIN if not provided
        role = validated_data.pop('role', 'ADMIN')

        # Create user with email as username and specified role
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        return user

    def to_representation(self, instance):
        """Customize the response to include full name"""
        ret = super().to_representation(instance)
        ret['name'] = f"{instance.first_name} {instance.last_name}".strip()
        ret['role'] = instance.role
        return ret

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'first_name', 'last_name', 'email', 'role']
        read_only_fields = ['id', 'role']

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
