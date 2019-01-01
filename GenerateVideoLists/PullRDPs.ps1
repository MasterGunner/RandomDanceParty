param (
    [string]$playlistFile,
    [string]$outputFile
)

$APIKey = Get-Content '.\API Key.txt'
$playlists = Import-Csv $playlistFile

$global:videoList = @()

function Get-PlaylistVideos {
    param (
        [string]$year,
        [string]$playlistId, 
        [string]$pageToken
    )

    Write-Host "$year`t$playlistId`t$pageToken`t$($global:videoList.length)"
    
    $requestString = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=$playlistID&key=$APIKey&maxResults=50"
    if($pageToken) {
        $requestString += "&pageToken=$pageToken"
    }

    $response = wget $requestString
    $responseContent = $response.Content | ConvertFrom-Json
    $responseContent.items | % { $global:videoList += [PSCustomObject]@{
        Year = $year
        VideoId=$_.contentDetails.videoId
    } }

    if($responseContent.nextPageToken) {
        Get-PlaylistVideos $year $playlistId $responseContent.nextPageToken
    }
}

$playlists | % {
    Get-PlaylistVideos $_.year $_.id
}

$global:videoList | ConvertTo-Json | Out-File $outputFile