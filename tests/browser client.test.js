import Mocha from 'mocha/browser-entry.js'
import chai from 'chai'
import ChaiAsPromised from 'chai-as-promised'
import connection from '../browser/browser client.js'

const { mocha } = Mocha

// const { mocha } = window

debugger

mocha.setup('bdd')
mocha.checkLeaks()

const { expect } = chai
chai.use(ChaiAsPromised)

// eslint-disable-next-line prefer-arrow-callback
describe('test', function () {
  this.timeout(500000)
  // let browserClient
  // before(async () => {
  //   browserClient = await (new BrowserClient())
  // })
  it('passes', async () => {
    // const question = browserClient.ask({ content: 'STEP 1', count: 1 })
    //
    // question.on('question received', (msg) => {
    //   // debugger
    //   msg.doneWithObject()
    //   expect(msg.header.body.content).to.equal('STEP 1')
    //   question.say({ content: 'STEP 2', count: msg.header.body.count }, 'echo')
    // })
    // question.on('echoed', async (msg) => {
    //   // debugger
    //   msg.doneWithObject()
    //   expect(msg.header.body.content).to.equal('STEP 2')
    //   const nextQuestion = question.ask({ content: 'STEP 3', count: msg.header.body.count })
    //   nextQuestion.on('question received', ((msg2) => {
    //     msg2.doneWithObject()
    //     expect(msg2.header.body.content).to.equal('STEP 3')
    //     nextQuestion.say({ content: 'STEP 4', count: msg2.header.body.count }, 'answer question')
    //   }))
    //   const nextQuestionResult = await nextQuestion
    //   // debugger
    //   expect(nextQuestionResult.header.body.content).to.equal('STEP 4')
    //   question.say({ content: 'STEP 5', count: nextQuestionResult.header.body.count + 1 }, 'answer question')
    // })
    //
    // // await response to question
    // const response = await question
    // expect(response.header.body.content).to.equal('STEP 5')
    // console.log(`CLIENT: LOG STEP 1 ANSWER: ${JSON.stringify(response)}`)
    //
    // // gracefully ends comms with the server
    // debugger
    // await browserClient.end()
  })

  it('fails', async () => {
    debugger
    const { ask } = await connection()
    debugger
    const question = ask({ content: 'STEP 1', count: 1 })
    question.on('question received', (msg) => {
      debugger
      msg.doneWithObject()
      expect(msg.messageObject.body.content).to.equal('STEP 1')
      question.say({ error: 'STEP 2', count: msg.messageObject.body.count + 1 }, 'throw')
    })
    try {
      debugger
      const response = await question
      debugger
    } catch (e) {
      debugger
      console.log(e, ask, question)
    }
  })
})

mocha.run()

// const doIt = async () => {
//   const client = await (new BrowserClient())
//
//   // ask for something from the comms server (question)
//   const question = client.ask({ what: 'is', your: 'name', step: 1 })
//
//   // handles any messages sent by comms server of type 'hello' to this question
//   question.on('hello', (msg) => {
//     console.log(`CLIENT: LOG STEP 2: ${JSON.stringify(msg)}`)
//     // sends message to comms server of type 'message' to this question
//     question.say({ i: 'say', stuff: true, step: 4 })
//   })
//
//   // handles any questions from the  comms server to this question
//   // Response object is provided
//   question.on('question', (response) => {
//     console.log(`CLIENT: LOG STEP 3: ${JSON.stringify(response.json)}`)
//     // handles any messages sent by comms server of type 'more' to this response
//     response.on('more', (msg) => {
//       console.log(`CLIENT: LOG STEP 6: ${JSON.stringify(msg)}`)
//       // reply to servers question
//       response.reply({
//         answer: 'yes', i: 'like', my: 'name', step: 7,
//       })
//     })
//     // sends message to comms server of type 'message' to this response
//     response.say({ i: 'also', say: 'stuff', step: 5 })
//   })
//
//   // // stream established by comms server.createListener
//   // question.on('uploadFile', (stream) => {
//   //   fs.createReadStream('./package.json').pipe(stream)
//   // })
//
//   // stream established by comms server.createSpeaker
//   question.on('downloadFile', (stream) => {
//     stream.pipe(process.stdout)
//   })
//
//   // await response to question
//   const response = await question
//   console.log(`CLIENT: LOG STEP 1 ANSWER: ${JSON.stringify(response)}`)
//
//   // gracefully ends comms with the server
//   await client.end()
// }
//
// window.doIt = doIt
