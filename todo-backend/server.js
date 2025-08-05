const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://vinithbusipalli:vinith12378.@cluster0.sf6qdv6.mongodb.net/portfolio', 
    { useNewUrlParser: true, useUnifiedTopology: true },
    console.log('database conneced'));
const todoSchema = new mongoose.Schema({
  text: String,
  dueAt: String,
  done: Boolean,
  addedAt: String
});
const Todo = mongoose.model('Todo', todoSchema);
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
  res.json(todo);
});
app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
app.listen(4000, () => console.log('server connected'));
