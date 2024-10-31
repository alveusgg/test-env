FROM ubuntu:24.04

RUN apt-get update -y
RUN apt-get install -y wget curl gnupg2

RUN wget -q -O - http://nimblestreamer.com/gpg.key | apt-key add -
RUN	curl -o /etc/apt/sources.list.d/nimble.sources https://nimblestreamer.com/ubuntu/nimble.sources

RUN	apt-get update -y
RUN	apt-get install nimble nimble-srt nimble-transcoder -y

ARG	WMSPANEL_SERVER_NAME
ARG	WMSPANEL_ACCOUNT
ARG	WMSPANEL_PASS
ARG WMSPANEL_TRANSCODER_LICENSE

#RUN	/usr/bin/nimble_regutil -u $WMSPANEL_ACCOUNT -p $WMSPANEL_PASS --server-name $WMSPANEL_SERVER_NAME
#RUN /usr/bin/nimble_regutil -u $WMSPANEL_ACCOUNT -p $WMSPANEL_PASS --transcoder-license $WMSPANEL_TRANSCODER_LICENSE

RUN	echo "management_listen_interfaces = *" >> /etc/nimble/nimble.conf

## Uncomment for SSL config
# Place SSL certificate files to the same directory as Dockerfile and fill its file names in respective variables
#ARG	NIMBLE_SSL_CERT=
#ARG	NIMBLE_SSL_KEY=

#ADD 	$NIMBLE_SSL_CERT /etc/nimble
#ADD 	$NIMBLE_SSL_KEY /etc/nimble
#RUN	sudo echo "ssl_port = 443" >> /etc/nimble/nimble.conf
#RUN	sudo echo "ssl_certificate = /etc/nimble/$NIMBLE_SSL_CERT" >> /etc/nimble/nimble.conf
#RUN	sudo echo "ssl_certificate_key = /etc/nimble/$NIMBLE_SSL_KEY" >> /etc/nimble/nimble.conf
#RUN	sudo echo "ssl_http2_enabled = true" >> /etc/nimble/nimble.conf
##

#EXPOSE 8081 1935 554 443 4444/udp

ADD run.sh /run.sh

ENTRYPOINT "/run.sh"