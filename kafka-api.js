const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();
app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  clientId: 'kafsender-api',
  brokers: ['kafka:9092'],
  connectionTimeout: 20_000,
  authenticationTimeout: 5_000,
  ssl: false,
  sasl: {
    mechanism: process.env.KAFKA_SECURITY_MECHANISM,
    username: process.env.KAFKA_SECURITY_USERNAME,
    password: process.env.KAFKA_SECURITY_PASSWORD,
  },
});

const producer = kafka.producer();

app.get('/topics', async (_req, res) => {
  const admin = kafka.admin()
  await admin.connect()
  const topics = await admin.listTopics()
  await admin.disconnect()
  res.json(topics.sort())
})

app.post('/publish', async (req, res) => {
  const { topic, message } = req.body;
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
    await producer.disconnect();
    res.status(200).json({ status: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(9501, () => {
  console.log('Kafka backend running on http://localhost:9501');
});
