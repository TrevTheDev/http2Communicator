/* eslint-disable no-unused-expressions */
// eslint-disable-next-line node/no-unpublished-import
import chai from 'chai'
import server from '../mash/mash.js'
import NodeClient from '../src/node client.js'

const { expect } = chai

let mash
server.listen()

describe('test comms server', () => {
  before(() => {
    mash = new NodeClient()
  })
  after(async () => {
    await mash.end()
    await server.gracefulShutdown()
  })
  it('u()', async () => {
    const result = await mash.ask({
      code: 'u();',
    })
    console.log(JSON.stringify(result))
    expect(mash.objectStream.headers[':status']).to.equal(200)
    expect(mash.objectStream.headers['content-type']).to.equal(
      'application/json; charset=utf-8',
    )
    expect(result.output.path.path).to.equal(process.cwd())
  })

  it('u().content', async () => {
    let result
    try {
      result = await mash.ask({ code: 'u().content;' })
    } catch (e) {
      console.log(e)
    }
    expect(result.output).to.be.an('array')
  })

  it('u().exists', async () => {
    const result = await mash.ask({ code: 'u().exists;' })
    expect(result.output).to.be.true
  })

  it('u().parent', async () => {
    const result = await mash.ask({ code: 'u().parent;' })
    expect(result.output.path.split('/').length + 1).to.be.equal(
      process.cwd().split('/').length,
    )
  })

  it('u().addDirectory and .delete()', async () => {
    const result = await mash.ask({
      code: `(async () => {
  const testDir = await u('./.tmp');
  const tmp = await testDir.addDirectory('.tmp2',true);
  await tmp.delete();
  return testDir.addDirectory('.tmp2');
})();`,
    })
    expect(result.output.path).to.equal(`${process.cwd()}/.tmp/.tmp2`)
    const result2 = await mash.ask({
      code: `u('${result.output.path}').delete()`,
    })
    expect(result2.output).to.be.true
  })

  it('copies files', async () => {
    const copyCmd = mash.ask({
      code: `( async () => { 
  //await u('./.tmp/node_modules').delete(true,undefined,true);
  await u('./.tmp/lodash').delete(true,undefined,true);
  //await u('./.tmp/.bin').delete(true,undefined,true);
  const interActionHandler = async (progUpdate) => {
    const res = await Client.ask({
      message: 'overwrite',
      ...progUpdate,
      validResponses: ['yes', 'no', 'all', 'none','cancel']
    });
    console.log(res.response);
    return res.response;
  }

  const copyCmd = u('./node_modules/lodash').copyTo('./.tmp', 'askBeforeOverwrite', interActionHandler );
  const progressChannel = Client.createSpeaker('progressStream', undefined, true);
  let pgChannel = undefined;
  progressChannel.on('connected', () => pgChannel = progressChannel );
  copyCmd.on('progressUpdate', progressTracker => {
    // console.log(progressTracker.bytesCompleted);
    if(pgChannel) pgChannel.say(progressTracker.toJSON());
  });

  const result = await copyCmd;

  if(pgChannel) pgChannel.end()

  return result;
} )();`,
    })
    copyCmd.on('question', (question) => question.reply({ response: 'yes' }))
    copyCmd.on('progressStream', (objectStream) => {
      objectStream.on('object', (object) => console.log(object))
    })
    const result = await copyCmd
    console.log(JSON.stringify(result))
  })

  it('copies files and cancels', async () => {
    const copyCmd = mash.ask({
      code: `( async () => { 
  await u('./.tmp/node_modules').delete(true,undefined,true);

  const interActionHandler = async (progUpdate) => {
    const res = await Client.ask({
      message: 'overwrite',
      ...progUpdate,
      validResponses: ['yes', 'no', 'all', 'none','cancel']
    });
    console.log(res.response);
    return res.response;
  }

  const copyCmd = u('./node_modules').copyTo('./.tmp', 'askBeforeOverwrite', interActionHandler );

  const progressChannel = await Client.createSpeaker('progressStream');
  copyCmd.on('progressUpdate', progressTracker => progressChannel.say(progressTracker.toJSON()));

  Client.on('cancel',(msg)=> copyCmd.cancel());
  
  try{ 
    const result = await copyCmd;
    progressChannel.end()
    return  result;
  } catch(e) {
    debugger;  
    progressChannel.end()
    if(e.message === "copyTo: cancelled by user") throw { type: 'cancelled', message: 'copyTo: cancelled by user' }
    else throw e
  }
} )();`,
    })
    copyCmd.on('question', (question) => question.reply({ response: 'yes' }))
    copyCmd.on('progressStream', (objectStream) => {
      objectStream.on('object', (object) => console.log(object))
    })
    setTimeout(() => {
      copyCmd.say({ reason: 'usr cancel' }, 'cancel')
    }, 3000)
    try {
      await copyCmd
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  })

  it('read and write file streams', async () => {
    const readWrite = mash.ask({
      code: `new Promise((resolve)=>{
  u('./.tmp/package.test').delete(true,undefined,true).then(()=>{
    Promise.all([
      u('./.tmp/package.test'),
      u('./package.json').readStream(),
      Client.createListener('incomingStream', 'raw'),
      Client.createSpeaker('outgoingStream', 'raw')
    ]).then(values=>{
      const newFile = values[0];
      const readFileStream = values[1];
      const incomingStream = values[2];
      const outgoingStream = values[3];
      const out = newFile.writeStream(incomingStream, true);
      readFileStream.pipe(outgoingStream);
      out.then(result=>resolve(result))
    })
  })
  
 });`,
    })
    let incomingStream
    let outgoingStream
    const pipe = () => {
      if (incomingStream && outgoingStream)
        outgoingStream.pipe(incomingStream)
    }
    readWrite.on('incomingStream', (stream) => {
      incomingStream = stream
      pipe()
    })
    readWrite.on('outgoingStream', (stream) => {
      outgoingStream = stream
      pipe()
    })
    const result = await readWrite
    expect(result.output.path).to.equal(`${process.cwd()}/.tmp/package.test`)
    console.log(result)
  })

//   it("u('./path/to/newSymlink').linkTo('/path/to/source') and .linkTarget", async () => {
//     const result = await request(CommsServer)
//       .post('/srvr')
//       .send(
//         `(async () => {
//   const testDir = await u('./.tmp');
//   await testDir.u('symlink').delete(undefined,undefined,true);
//   return testDir.u('symlink').linkTo((await u()));
// })();`,
//       )
//       .type('text/plain')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//     expect(result.body.path).to.equal(`${process.cwd()}/.tmp/symlink`)
//     const result1 = await request(CommsServer)
//       .post('/srvr')
//       .send(`u('${result.body.path}').linkTarget`)
//       .type('text/plain')
//       .set('Accept', 'text/plain')
//       .expect('Content-Type', /json/)
//       .expect(200)
//     expect(result1.body.path.path).to.equal(`${process.cwd()}`)
//   })
})
