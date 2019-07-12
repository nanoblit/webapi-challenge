const route = require('express').Router();
const db = require('./data/helpers/projectModel');

route.get('/', async (req, res) => {
  try {
    const projects = await db.get();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

route.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await db.get();
    if (!projects.find(project => project.id === Number(id))) {
      res.status(404).json({ error: 'There is no project with given id' });
    } else {
      const project = await db.get(id);
      res.status(200).json(project);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

route.post('/', async (req, res) => {
  try {
    const { body } = req;
    if (!body.name || !body.description) {
      res.status(400).json({ error: 'Name and description strings are required' });
    } else {
      const project = await db.insert(body);
      res.status(200).json(project);
    }
  } catch (error) {
    res.status(500).json('Internal server error');
  }
});

route.put('/:id', async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    if (!body.name || !body.description) {
      res.status(400).json({ error: 'Name and description strings are required' });
    } else {
      const project = await db.update(id, body);
      if (!project) {
        res.status(400).json({ error: 'There is no project with given id' });
      } else {
        res.status(200).json(project);
      }
    }
  } catch (error) {
    res.status(500).json('Internal server error');
  }
});

route.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const wasDeleted = await db.remove(id);
    if (!wasDeleted) {
      res.status(400).json({ error: 'There is no project with given id' });
    } else {
      res.status(200).json(wasDeleted);
    }
  } catch (error) {
    res.status(500).json('Internal server error');
  }
});

module.exports = route;
