repo="vnma0/hestia"

releases_url="https://api.github.com/repos/$repo/releases/latest"

echo Determining latest release of Hestia...
get_res=$(curl $releases_url)
echo Hestia: $(echo $get_res | jq -r ".tag_name")

echo Downloading latest release...
asset_name=$(echo $get_res | jq -r ".assets[0].name")
asset_url=$(echo $get_res | jq -r ".assets[0].browser_download_url")
sha_url=$(echo $get_res | jq -r ".assets[1].browser_download_url")
get_sha=$(curl -L $sha_url)

wget $asset_url
asset_sha=$(sha512sum $asset_name)

if [ "$get_sha" == "$asset_sha" ]; then
    echo Extracting latest release...
    if [ -d public ]; then
        rm -rf public
    fi
    unzip $asset_name -d public
    mv ./public/build/* ./public
    rmdir ./public/build
else
    echo "Checksum is not equal, please rerun the script !" >&2
fi
rm $asset_name