# videosdk-custom-recording-template-react-example

VideoSDK is a platform that offers a range of video streaming tools and solutions for content creators, publishers, and developers.

## What is Custom Template ? 

- Custom template is template for live stream, which allows users to add real-time graphics to their streams.
- With custom templates, users can create unique and engaging video experiences by overlaying graphics, text, images, and animations onto their live streams. These graphics can be customized to match the branding.
- Custom templates enable users to create engaging video content with real-time graphics, with live scoreboards, social media feeds, and other customizations, users can easily create unique and visually appealing streams that stands out from the crowd.

 <br/>
 
Here is complete integration guide of [Customized Live Stream](https://docs.videosdk.live/react/guide/interactive-live-streaming/custom-template)
 

## Custom template with VideoSDK

In this section, we will discuss how Custom Templates work with VideoSDK.

- **`Host`**: The host is responsible for starting the live streaming by passing the `templateURL`. The `templateURL` is the URL of the hosted template webpage. The host is also responsible for managing the template, such as changing text, logos, and switching template layout, among other things.

- **`VideoSDK Template Engine`** : The VideoSDK Template Engine accepts and opens the templateURL in the browser. It listens to all the events performed by the Host and enables customization of the template according to the Host's preferences.

- **`Viewer`**: The viewer can stream the content. They can watch the live stream with the added real-time graphics, which makes for a unique and engaging viewing experience.

![custom template](https://cdn.videosdk.live/website-resources/docs-resources/custom_template.png)

## Understanding Template URL

The template URL is the webpage that VideoSDK Template Engine will open while composing the live stream.

The template URL will appear as shown below.

![template url](https://cdn.videosdk.live/website-resources/docs-resources/custom_template_url.png)

The Template URL consists of two parts:

- Your actual page URL, which will look something like `https://example.com/videosdk-template`.
- Query parameters, which will allow the VideoSDK Template Engine to join the meeting when the URL is opened. There are a total of three query parameters:
  - `token`: This will be your token, which will be used to join the meeting.
  - `meetingId`: This will be the meeting ID that will be joined by the VideoSDK Template Engine.
  - `participantId`: This will be the participant ID of the VideoSDK Template Engine, which should be passed while joining the template engine in your template so that the tempalte engine participant is not visible to other participants. **This parameter will be added by the** **VideoSDK**.
  
 **NOTE** : You can pass N number of query parameters as per your requirements.

Here is complete integration guide of [Customized Live Stream](https://docs.videosdk.live/react/guide/interactive-live-streaming/custom-template)

## Add Template URL in VideoSDK API

- We will add this `templateUrl` to the body of the [Start HLS](https://docs.videosdk.live/api-reference/realtime-communication/start-hlsStream) API.

- Here, we took the [HLS](https://docs.videosdk.live/api-reference/realtime-communication/start-hlsStream) API example, if you want go with [Recording](https://docs.videosdk.live/api-reference/realtime-communication/start-recording) or [RTMP](https://docs.videosdk.live/api-reference/realtime-communication/start-livestream) the same steps will be consider.

```js
const startRecording = () => {
   const roomId = "your_meeting_id"
   const SDK_TOKEN = "your_sdk_token"
   const API_TOKEN = "your_api_token"
    
    const url = `https://api.videosdk.live/v2/hls/start`;
    //Update your Custom Template URL here if you have deployed your own
    const templateUrl = `https://lab.videosdk.live/react-custom-template-demo?meetingId=${meetingId}&token=${authToken}`;
    const options = {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: meetingId,
        templateUrl: templateUrl,
      }),
    };
    
    const result = await fetch(url, options)
      .then((response) => response.json()) // result will have downstreamUrl
      .catch((error) => console.error("error", error));
}

```

## Beatland layout

The template renders a fixed 8-tile layout: 2 battlers, 1 host (circle) and 5 judges. Empty slots show a placeholder, so all 8 tiles are always on screen.

### Preview without a meeting

```
npm start
# open http://localhost:3000/react-custom-template-demo/?demo=true
```

### Template URL options

| Param | Default | Description |
| --- | --- | --- |
| `orientation` | `landscape` | `portrait` switches to the 9:16 Instagram layout |
| `rotate` | `90` in portrait, `0` otherwise | Rotates the stage. In portrait, the 9:16 Instagram layout is turned 90° so it fills the 16:9 livestream frame. Use `-90` to turn it the other way, or `0` for no rotation |
| `category` | `SOLO CATEGORY` | Header text (also used in the footer) |
| `centerText` | empty | Text in the bar between the battler names, e.g. `ROUND 1` |
| `footer` | event details | Footer items separated by `\|` |
| `live` | `true` | `false` hides the LIVE badge |
| `demo` | `false` | Renders sample names with no meeting |

### Going live on Instagram

Use the RTMP livestream API with the portrait template URL. Nothing is recorded.

```js
const templateUrl =
  `https://your-domain.com/?meetingId=${roomId}&token=${token}&orientation=portrait`;

await fetch("https://api.videosdk.live/v2/livestreams/start", {
  method: "POST",
  headers: { Authorization: token, "Content-Type": "application/json" },
  body: JSON.stringify({
    roomId,
    templateUrl,
    outputs: [
      { url: "rtmp://live-upload.instagram.com:80/rtmp/", streamKey: "<INSTAGRAM_STREAM_KEY>" },
    ],
  }),
});
```

Get the stream URL and key from Instagram Live Producer each time you go live. For YouTube or another landscape platform, use the same call without `orientation=portrait`.

### Choosing who goes in which tile

Slots are filled in this order of priority:

1. **PubSub from the host app** on the `BEATLAND_LAYOUT` topic. Messages are JSON and are merged, so you can send partial updates. Use `persist: true` so the template gets the latest layout when it joins.

   ```js
   const { publish } = usePubSub("BEATLAND_LAYOUT");
   publish(
     JSON.stringify({
       battlers: ["<participantIdA>", "<participantIdB>"],
       host: "<participantId>",
       judges: ["<id1>", "<id2>", "<id3>", "<id4>", "<id5>"],
       countries: { "<participantIdA>": "ca" }, // ISO country codes for flags
       names: { "<participantIdA>": "DEN" },     // optional display-name overrides
       centerText: "ROUND 1",
     }),
     { persist: true }
   );
   ```

2. **Participant metaData** passed when each person joins: `metaData: { role: "battler" | "host" | "judge", country: "ca" }`.
3. **Join order**: the first two speakers are battlers, then the host, then judges.

To use the official logo, add it as `public/beatland-logo.png`. Otherwise a built-in version is shown.

## Documentation

[Read the documentation](https://docs.videosdk.live/) to start using VideoSDK.

## Community

- [Discord](https://discord.gg/Gpmj6eCq5u) - To get involved with the Video SDK community, ask questions and share tips.
- [Twitter](https://twitter.com/video_sdk) - To receive updates, announcements, blog posts, and general Video SDK tips.

