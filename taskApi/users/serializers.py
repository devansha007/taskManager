from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'email', 'username', 'bio', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True,required=False)

    class Meta:
        model  = User
        fields = ['email', 'username', 'password', 'password2']

    # def validate(self, data):
    #     if data['password'] != data['password2']:
    #         raise serializers.ValidationError("Passwords do not match.")
    #     return data
    def validate(self, data):
        if 'password2' in data and data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)  # remove if exists, ignore if not
        return User.objects.create_user(**validated_data)



# from rest_framework import serializers
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class RegisterSerializer(serializers.ModelSerializer):
#     # write_only = appears in request but NEVER in response
#     # you don't want password coming back in the JSON!
#     password  = serializers.CharField(write_only=True, min_length=8)
#     password2 = serializers.CharField(write_only=True)

#     class Meta: 
#         model  = User
#         fields = ['email', 'username', 'password', 'password2']

#     # validate() runs after individual field checks
#     # here we check both passwords match
#     def validate(self, data):
#         if data['password'] != data['password2']:
#             raise serializers.ValidationError("Passwords do not match.")
#         return data

#     # create() is called when serializer.save() is called
#     # we use create_user() instead of create() so password gets hashed
#     def create(self, validated_data):
#         validated_data.pop('password2')  # remove before creating user
#         user = User.objects.create_user(
#             email    = validated_data['email'],
#             username = validated_data['username'],
#             password = validated_data['password'],  # gets hashed automatically
#         )
#         return user