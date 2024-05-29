const csvtojson = require('csvtojson');
const Text = require('../models/Text');

exports.createText = async (req, res) => {
  try {
    const jsonArray = await csvtojson().fromString(req.file.buffer.toString());
    const content = JSON.stringify(jsonArray);
    const text = { content, createdBy: req.user.id };

    Text.create(text, (err, result) => {
      if (err) {
        console.error('Failed to create text:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send('Text created!');
    });
  } catch (error) {
    console.error('Failed to process CSV file:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getTexts = (req, res) => {
  Text.getAll((err, results) => {
    if (err) {
      console.error('Failed to get texts:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
};

exports.updateText = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  Text.findById(id, (err, results) => {
    if (err) {
      console.error('Failed to find text:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length > 0) {
      const text = results[0];
      if (text.createdBy !== req.user.id) {
        return res.sendStatus(403); 
      }

      Text.update(id, content, (err, result) => {
        if (err) {
          console.error('Failed to update text:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.send('Text updated!');
      });
    } else {
      res.sendStatus(404);
    }
  });
};

exports.deleteText = (req, res) => {
  const { id } = req.params;

  Text.findById(id, (err, results) => {
    if (err) {
      console.error('Failed to find text:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length > 0) {
      const text = results[0];
      if (text.createdBy !== req.user.id) {
        return res.sendStatus(403); 
      }

      Text.delete(id, (err, result) => {
        if (err) {
          console.error('Failed to delete text:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.send('Text deleted!');
      });
    } else {
      res.sendStatus(404); 
    }
  });
};
