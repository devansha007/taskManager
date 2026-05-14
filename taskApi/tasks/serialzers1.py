from djalaude ka importstatement


class Userserializer(serializers.serializer):
    email  = serializer.EmailField()
    bio = serializer.TextField()
    avata = serializer.ImageField()
    created_at  = serializer.DateTimeField(read_only = True)
     
    class Create(self ,**validated_data):
        return user.objects.create(serializer.validated_data)
    class Update(self , instance , **validated_data):
        instance.text =  validated_data.get('content',instance.text)

        instance.save()
        return instance         

class Somefuckserializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        extra_kwargs = {
            'password' : {'write_only' : True}

        } 
    
    def validate(self,data):
        if data['password'] != data['password']:
            raise serializers.ValidationError("passwp deosnot match")

        return data