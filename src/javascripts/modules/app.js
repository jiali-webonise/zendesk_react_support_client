import React from 'react'
import {render} from 'react-dom'
import {resizeContainer} from '../lib/helpers'
import EventTimeline from './event_timeline'

const MAX_HEIGHT = 1000

class App {
  constructor(client, appData) {
    this._client = client
    this._appData = appData
    this.initializePromise = this.init()
  }

  async init() {
    const requesterId = (await this._client.get('ticket.requester.id'))['ticket.requester.id']
    const eventRequestOptions = {
      url: `/api/v2/users/${requesterId}/events`,
      data: `page[size]=5`
    }

    const events = (await this._client.request(eventRequestOptions))
    // Sorts events by created_at timestamp
    const sortedEvents = events.events.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
    const container = document.querySelector('.main')

    render(<EventTimeline events={sortedEvents} />, container)
    return resizeContainer(this._client, MAX_HEIGHT)
  }
}

export default App