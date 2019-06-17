$repo = "vnma0/hestia"

$releases_url = "https://api.github.com/repos/$repo/releases/latest"

Write-Host Determining latest release of Hestia...
$get_res = Invoke-WebRequest $releases_url | ConvertFrom-Json
Write-Host Hestia: $get_res.tag_name

Write-Host Downloading latest release...
$asset_name = $get_res.assets[0].name
$asset_url = $get_res.assets[0].browser_download_url
$sha_url = $get_res.assets[1].browser_download_url
$get_sha = ( -split [System.Text.Encoding]::ASCII.GetString((Invoke-WebRequest $sha_url).Content))[0]

Invoke-WebRequest $asset_url -Out $asset_name
$asset_sha = (Get-FileHash $asset_name -Algorithm SHA512).Hash

if ($get_sha -eq $asset_sha) {
    Write-Host Extracting latest release...
    if (Test-Path -Path .\public) {
        Remove-Item -path .\public -Recurse -Force
    }
    Expand-Archive $asset_name -DestinationPath .\public
    Move-Item -Path .\public\build\* -Destination .\public
    Remove-Item .\public\build
} else {
    Write-Error "Checksum is not equal, please rerun the script !"
}
Remove-Item $asset_name
