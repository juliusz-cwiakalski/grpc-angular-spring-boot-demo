# Pull base image.
# FROM ubuntu:latest

# RUN \
#     # Update
#     apt-get update -y && \
#     # Install Java
#     apt-get install default-jre -y

FROM amazoncorretto:11

ADD ./target/chat-backend-grpc-0.0.1-SNAPSHOT.jar chat-backend-grpc.jar

EXPOSE 6565

CMD java -jar chat-backend-grpc.jar
