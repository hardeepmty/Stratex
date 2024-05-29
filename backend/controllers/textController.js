const csvtojson = require('csvtojson');
const Text = require('../models/Text');

const createText = async (req, res) => {
  try {
    const jsonArray = await csvtojson().fromString(req.file.buffer.toString());
    const content = JSON.stringify(jsonArray);
    const text = { content, createdBy: req.user.id };
    Text.create(text, (err, result) => {
      if (err) throw err;
      res.send('Text created!');
    });
  } catch (error) {
    console.error('Failed to process CSV file:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getAllTexts = (req, res) => {
  Text.findAll((err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const updateText = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  Text.findById(id, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const text = results[0];
      if (text.createdBy !== req.user.id) {
        return res.sendStatus(403); // Forbidden
      }
      Text.updateById(id, content, (err, result) => {
        if (err) throw err;
        res.send('Text updated!');
      });
    } else {
      res.sendStatus(404); // Not Found
    }
  });
};

const deleteText = (req, res) => {
  const { id } = req.params;
  Text.findById(id, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const text = results[0];
      if (text.createdBy !== req.user.id) {
        return res.sendStatus(403); // Forbidden
      }
      Text.deleteById(id, (err, result) => {
        if (err) throw err;
        res.send('Text deleted!');
      });
    } else {
      res.sendStatus(404); // Not Found
    }
  });
};

module.exports = { createText, getAllTexts, updateText, deleteText };
