#!/bin/bash

sudo apt-get install -y python-software-properties build-essential cmake libev4 libev-dev libpcap-dev git libmsgpack-dev libmsgpack3 zlib1g-dev libssl-dev  libreadline-dev imagemagick
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update -y
sudo apt-get install nodejs git graphviz -y

git clone https://github.com/m-mizutani/swarm.git
cd swarm && cmake . && make && sudo make install && cd ..

git clone https://github.com/m-mizutani/devourer.git
cd devourer && cmake . && make && sudo make install && cd ..

git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile

export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

source ~/.bash_profile
rbenv install 2.1.4
rbenv global 2.1.4
rbenv rehash
gem install dvrtools fluentd

git clone https://github.com/m-mizutani/dnsmap.git
cd dnsmap && npm install
mkdir -p public/map
mkdir -p uploads
cp settings.orig.yml settings.yml
