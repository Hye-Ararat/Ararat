#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi


apt install curl
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
apt install -y nodejs git
content=`wget https://raw.githubusercontent.com/Hye-Ararat/Ararat/main/ararat.service`

mv ./ararat.service /lib/systemd/system/ararat.service

mkdir /etc/ararat && cd /etc/ararat

git clone https://github.com/Hye-Ararat/Ararat .

echo "What is your postgres url:" 
read postgres
echo "DATABASE_URL=$postgres" | tee .env

echo "What is your encryption key:" 
read enc_key
echo "What is your panel url:"
read panel
echo -e "ENC_KEY=$enc_key 
PANEL_URL=$panel" | tee .env.local


npm install

systemctl enable --now ararat

printf "Thank for installing Ararat ;)"


