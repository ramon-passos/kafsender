const express = require('express');
const cors = require('cors');
const { kafka } = require('./kafka-client');

const app = express();
app.use(cors());
app.use(express.json());

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
    const producer = kafka.producer();
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
