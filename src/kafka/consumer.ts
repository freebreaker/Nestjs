import * as kafka from 'kafka-node';

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const offset = new kafka.Offset(client);

const topics = [
  {
    topic: 'topic',
  },
];
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  // encoding: "buffer"
};
// { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };

const consumer = new kafka.Consumer(client, topics, options);

// 处理消息
consumer.on('message', (message) => {

  // Read string into a buffer.
  console.info(`[message]:==:>${JSON.stringify(message)}`);
  // const buf = new Buffer(String(message.value), 'binary')
  const decodedMessage = message; // JSON.parse(buf.toString())

  console.log('decodedMessage: ', decodedMessage);
});

// 消息处理错误
consumer.on('error', (err) => {
  console.log('error', err);
});

consumer.on('offsetOutOfRange', (topic) => {
  console.info(`[offsetOutOfRange]:==:>${topic}`);
  topic.maxNum = 2;
  offset.fetch([topic], (err, offsets) => {
    if (err) {
      return console.error(err);
    }
    const min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
});

process.on('SIGINT', () => {
  consumer.close(true, () => {
    console.log('consumer colse!');
    process.exit();
  });
});


export default consumer;