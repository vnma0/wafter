$repo = "vnma0/hestia"

$releases_url = "https://api.github.com/repos/$repo/releases/latest"

Write-Host Determining latest release of Hestia...
$get_res = Invoke-WebRequest $releases_url | ConvertFrom-Json
Write-Host Hestia: $get_res.tag_name

Write-Host Downloading latest release...
$asset_name = $get_res.assets[0].name
$asset_url = $get_res.assets[0].browser_download_url
Invoke-WebRequest $asset_url -Out $asset_name

Write-Host Extracting latest release...
if (-Not (Test-Path -Path .\public)) {
    Remove-Item -path .\public -Recurse -Force
}
Expand-Archive $asset_name -DestinationPath .\public
Remove-Item $asset_name 

Write-Host Successfully installed Hestia