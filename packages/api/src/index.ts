export * from './api.gen'

import { ArcadeumAPI as BaseArcadeumAPI } from './api.gen'
import fetch from 'cross-fetch'

export class ArcadeumAPIClient extends BaseArcadeumAPI {
  jwtAuth: string | undefined = undefined

  constructor(hostname: string) {
    super(hostname, fetch)
    this.fetch = this._fetch
  }

  _fetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
      // automatically include jwt auth header to requests
      // if its been set on the api client
      const headers: { [key: string]: any } = {}
      if (this.jwtAuth && this.jwtAuth.length > 0) {
        headers['Authorization'] = `BEARER ${this.jwtAuth}`
      }

      // before the request is made
      init!.headers = { ...init!.headers, ...headers }
  
      fetch(input, init).then(resp => {
        // after the request has been made..
        resolve(resp)
      }).catch(err => {
        // request error
        reject(err)
      })
    })
  } 
}
