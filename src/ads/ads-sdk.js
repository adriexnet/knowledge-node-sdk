import got from 'got'

export const types = {
  portrait: 3361
}

export default class KnowledgeAds {
  constructor (config: { siteId: string }) {
    this.config = config
    this.netWorkId = 10087
  }

  getAd (type: string, user: string) {
    return new Promise((resolve, reject) => {
      got.post(`https://engine.adzerk.net/api/v2`, {
        json: true,
        headers: {
          'Content-type': 'application/json'
        },
        body: {
          placements: [
            {
              divName: 'ads',
              networkId: this.netWorkId,
              siteId: this.config.siteId,
              adTypes: [type]
            }
          ],
          user: {
            key: user
          }
        }
      }).then(({body}) => {
        if (body.decisions.ads === null) {
          resolve(null)
          return
        }

        const content = body.decisions.ads.contents.shift()
        if (typeof content === 'undefined') {
          resolve(null)
          return
        }
        resolve({
          type: content.type === 'raw' ? 'html5' : 'image',
          width: content.data.width,
          height: content.data.height,
          content: content.type === 'raw' ? content.body : content.data.imageUrl,
          clickUrl: body.decisions.ads.clickUrl
        })
      }).catch(({statusCode, statusMessage}) => reject(new Error(`${statusCode}: ${statusMessage}`)))
    })
  }
}
