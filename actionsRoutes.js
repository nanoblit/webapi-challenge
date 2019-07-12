const route = require('express').Router();
const db = require('./data/helpers/actionModel');
const projectdb = require('./data/helpers/projectModel');

route.get('/', async (req, res) => {
  try {
    const actions = await db.get();
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

route.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const actions = await db.get();
    if (
      !actions.find(action => action.id === Number(id))
    ) {
      res.status(404).json({ error: 'There is no action with given id' });
    } else {
      const action = await db.get(id);
      res.status(200).json(action);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

route.post('/', async (req, res) => {
  try {
    const { body } = req;
    const projects = await projectdb.get();
    if (!projects.find(({ id }) => id === body.project_id)) {
      res.status(404).json({ error: 'There is no project with given id' });
    } else if (
      body.project_id === undefined
      || !body.description
      || body.description.length > 128
      || !body.notes
    ) {
      res.status(400).json({
        error:
          'Project_id, description and notes are required. Description must be no longer than 128 characters.',
      });
    } else {
      const action = await db.insert(body);
      res.status(200).json(action);
    }
  } catch (error) {
    res.status(500).json('Internal server error');
  }
});

route.put('/:id', async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    if (
      body.project_id === undefined
      || !body.description
      || body.description.length > 128
      || !body.notes
    ) {
      res.status(400).json({
        error:
          'Project_id, description and notes are required. Description must be no longer than 128 characters.',
      });
    } else {
      const action = await db.update(id, body);
      if (!action) {
        res.status(400).json({ error: 'There is no action with given id' });
      } else {
        res.status(200).json(action);
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
      res.status(400).json({ error: 'There is no action with given id' });
    } else {
      res.status(200).json(wasDeleted);
    }
  } catch (error) {
    res.status(500).json('Internal server error');
  }
});

module.exports = route;
