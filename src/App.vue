<template>
  <div>
    <h1>Send a message to Kafka</h1>
    <form @submit.prevent="submitMessage">
      <div>
        <label for="topic">Select Kafka Topic:</label>
        <select v-model="selectedTopic">
          <option v-for="topic in topics" :key="topic" :value="topic">{{ topic }}</option>
        </select>
      </div>

      <div>
        <label for="message">Message (JSON):</label>
        <textarea v-model="message" placeholder="Enter JSON message"></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      topics: [],
      selectedTopic: '',
      message: ''
    }
  },
  mounted() {
    this.fetchTopics()
  },
  methods: {
    async fetchTopics() {
      try {
        const response = await axios.get('http://localhost:9501/topics')
        this.topics = response.data
      } catch (error) {
        console.error('Error fetching topics:', error)
      }
    },
    async submitMessage() {
      try {
        const parsedMessage = JSON.parse(this.message)
        await axios.post('http://localhost:9501/publish', {
          topic: this.selectedTopic,
          message: parsedMessage
        })
        alert('Message sent successfully!')
      } catch (error) {
        alert('Error sending message: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
