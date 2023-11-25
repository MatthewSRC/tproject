
# TProject

Multi language speech translator.

Repository with both frontend and backend components. Developed using React Native (Typescript), the application interfaces with a custom RESTful API, integrating with various Google Services.

**This is a test project created for personal enrichment. Feel free to take a peek at the code if you're interested!**



## Useful resources

For more informations about:

- Usable voices and languages visit [Supported voices and languages](https://cloud.google.com/text-to-speech/docs/voices)
- Accepted audio encoding visit [Introduction to audio encoding](https://cloud.google.com/speech-to-text/v2/docs/encoding#:~:text=The%20Speech%2Dto%2DText%20API%20supports%20two%20lossless%20encodings%3A,as%20your%20audio%20encoding%20choice.)


## API Reference

For all the request to /api endpoints, an access token must be provided in the header.

#### Header

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Previously generated access token |

### Generate an access token
Generates and retrieves an access token for a valid user.

```http
  GET /auth/getAccessToken
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `idToken` | `string` | **Required**. Google ID token used for verification and backend token generation |

### Speechify

Transcribes, translates, and synthesizes audio content from an uploaded file.  

```http
  POST /api/speechify
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `sourceLanguageCode`      | `string` | **Required**. Language code of the input language |
| `targetLanguageCode`      | `string` | **Required**. Language code of the output language |
| `voiceName`      | `string` | **Required**. Text-to-speech voice name |
| `operationType`      | `string` |  **Default**: 'sync'  Value must be 'sync' for synchronous recognition or 'async' for asynchronous recognition. 'async' is needed for audio files longer than 60 seconds |


#### Body
**Required** An audio file to translate.  

## Debug endpoints API reference

### Upload audio file

Uploads an audio file to Cloud Storage.

```http
  POST /api/uploadAudio
```

#### Body
**Required** An audio file to translate.  

### Synthesize text

Synthesizes text into audio using a specified voice configuration.  

```http
  POST /api/synthesizeText
```

#### Body
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `text`      | `string` | **Required**. To synthesize text |
| `voice`      | `string` | **Required**. Text-to-speech voice name |

### Request translation

Translates text from a source language to a target language.

```http
  POST /api/requestTranslation
```

#### Body
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `text`      | `string` | **Required**. To translate text |
| `languages`      | `object { sourceLanguageCode: string, targetLanguageCode: string }` | **Required**. Source/target language codes |

### Recognize speech

Recognizes speech in an audio file (synchronously or asynchronously) and returns the transcription.

```http
  POST /api/recognizeSpeech
```

#### Body
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `uri`      | `string` | **Required if 'content' is not provided**. Cloud storage URI of the file |
| `content`      | `string` | **Required if 'uri' is not provided**. Base64 encoded audio content |
| `languageCode`      | `string` | **Required**. Language code of the input language |
| `operationType`      | `string` | **Default**: 'sync'  Value must be 'sync' for synchronous recognition or 'async' for asynchronous recognition. 'async' is needed for audio files longer than 60 seconds |

### Delete audio

Deletes a specified audio file from storage by its name.

```http
  POST /api/recognizeSpeech
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fileName`      | `string` | **Required**. The name of the file to delete |
