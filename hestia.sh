repo="vnma0/hestia"

releases_url="https://api.github.com/repos/$repo/releases/latest"

echo Determining latest release of Hestia...
get_res=$(curl $releases_url)
echo Hestia: $(echo $get_res | jq -r ".tag_name")

echo Downloading latest release...
asset_name=$(echo $get_res | jq -r ".assets[0].name")
asset_url=$(echo $get_res | jq -r ".assets[0].browser_download_url")
# wget $asset_url

echo Extracting latest release...
if [ -d public ]; then
    rm -rf public
fi
unzip $asset_name -d public
mv ./public/build/* ./public
rmdir ./public/build
rm $asset_name
