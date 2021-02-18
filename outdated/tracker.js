const tackerDb = new Map()

const tracker = {
  waitForFulfillment: (key, fulfillmentCallBack) => {
    tackerDb.set(key, fulfillmentCallBack)
    const cancelCb = () => tracker.cancel(key)
    return cancelCb
  },
  fulfill: (key) => {
    const fulfillmentCallBack = tackerDb.get(key)
    tackerDb.delete(key)
    return fulfillmentCallBack
  },
  cancel: (key) => tackerDb.delete(key),
}

export default tracker
