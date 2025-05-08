from langchain.tools import tool
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from pytube import YouTube
import re

@tool
def extract_youtube_metadata(url: str) -> str:
    """
    Extracts title, channel name, and transcript text (if available) from a YouTube video URL.
    Returns a JSON string with fields: title, channel, transcript (if available).
    """
    try:
        # Extract video ID
        video_id_match = re.search(r"(?:v=|be/)([\w-]{11})", url)
        if not video_id_match:
            return "Error: Could not extract video ID from URL."
        video_id = video_id_match.group(1)

        # Use pytube to get metadata
        yt = YouTube(url)
        title = yt.title
        channel = yt.author

        # Get transcript
        try:
            transcript_data = YouTubeTranscriptApi.get_transcript(video_id)
            transcript_text = " ".join([entry["text"] for entry in transcript_data])
        except TranscriptsDisabled:
            transcript_text = "Transcript not available."
        except Exception as e:
            transcript_text = f"Transcript error: {str(e)}"

        return {
            "title": title,
            "channel": channel,
            "transcript": transcript_text,
            "url": url
        }

    except Exception as e:
        return f"Error fetching YouTube data: {str(e)}"