<template>
  <div class="page">
    <h1 class="title"> Kafsender </h1>
    <form @submit.prevent="submitMessage">
      <div>
        <label for="topic">Select Kafka Topic:</label>
        <select v-model="selectedTopic" class="form-select">
          <option value="">Select a existent topic</option>
          <option v-for="topic in topics" :key="topic" :value="topic">{{ topic }}</option>
        </select>

        <label for="topic">Send to a new Topic:</label>
        <input v-model="typedTopic" class="form-control" placeholder="Enter a new topic..." />
      </div>

      <div>
        <label for="message">Message (JSON):</label>
        <codemirror
          v-model="message"
          :style="{ height: '50vh' }"
          :autofocus="true"
          :extensions="extensions"
          @update:model-value="onEditorChange"
        />
      </div>

      <button type="submit" class="btn btn-success">Send Message</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

export default {
  components: {
    Codemirror
  },
  data() {
    return {
      topics: [],
      selectedTopic: '',
      typedTopic: '',
      message: '{}',
      extensions: [
        json(),
        oneDark,
      ]
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
    onEditorChange(value) {
      this.message = value
    },
    async submitMessage() {
      try {
        const parsedMessage = JSON.parse(this.message)
        await axios.post('http://localhost:9501/publish', {
          topic: this.selectedTopic || this.typedTopic,
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

.page {
  background-color: rgb(7, 3, 37);
  color: white;
  height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

header {
  background-color: rgb(7, 3, 37);
  color: white;
  text-align: center;
}

button {
  margin-top: 20px;
  float: right;
}
</style>
