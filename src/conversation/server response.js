import Response from './response.js'
import Speaker from './speaker.js'
import { SETTINGS } from '../other/globals.js'
import ListenerPromise from './listener promise.js'

export default class ServerResponse extends Response {
  constructor(objectStream, questionJSON) {
    super(objectStream, questionJSON)
    this.speakers = []
    this.listeners = []
  }

  reply(json, type) {
    if (this.speakers.length > 0) throw new Error('response still has open speakers')
    if (this.listeners.length > 0) throw new Error('response still has open listeners')
    super.reply(json, type)
  }

  createSpeaker(speakerName, speakerType = SETTINGS.speakerTypeObject, optional = false) {
    const speaker = new Speaker(speakerType)
    let successCb
    const result = optional
      ? speaker
      : new Promise((success) => { successCb = success })

    this.objectStream.stream.pushStream(
      {
        ':path': SETTINGS.listenerStreams,
        'question-id': this.id,
        'speaker-name': speakerName,
        'speaker-type': speakerType,
      },
      (err, stream) => {
        if (err) throw err
        if (speakerType === SETTINGS.speakerTypeObject) {
          speaker._setStream(stream)
          this.speakers.push(speaker)
          speaker.once('ended', () => this.speakers.splice(this.speakers.indexOf(speaker), 1))
          if (!optional) successCb(speaker)
        } else if (speakerType === SETTINGS.speakerTypeRaw) {
          this.speakers.push(stream)
          stream.once('finish', () => this.speakers.splice(this.speakers.indexOf(stream), 1))
          if (!optional) successCb(stream)
        } else throw new Error('unknown speaker type')
      },
    )
    return result
  }

  createListener(speakerName, speakerType = SETTINGS.speakerTypeObject) {
    return new ListenerPromise(this, speakerName, speakerType)
  }
}
