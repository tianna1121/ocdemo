FROM pig4cloud/java:8-jre

MAINTAINER wangiegie@gmail.com

ENV TZ=Asia/Shanghai
ENV JAVA_OPTS="-Xms128m -Xmx256m -Djava.security.egd=file:/dev/./urandom"

RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /aiops-register

WORKDIR /aiops-register

EXPOSE 8848

ADD ./target/aiops-register.jar ./


CMD sleep 60;java $JAVA_OPTS -jar aiops-register.jar


