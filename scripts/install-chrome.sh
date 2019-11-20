# Add Google repository
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list

# Install OS deps
apt-get update -yqqq

# Install Chrome browser
apt-get install -y google-chrome-stable
