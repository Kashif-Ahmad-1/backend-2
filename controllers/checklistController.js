const Checklist = require('../models/Checklist');

// Save checklist data
exports.saveChecklist = async (req, res) => {
  const { clientInfo, checklist, authorizedSignature } = req.body;
  
  try {
    const newChecklist = new Checklist({
      clientInfo,
      checklist,
      authorizedSignature,
      createdAt: new Date(),
    });
    
    await newChecklist.save();
    res.status(201).json(newChecklist);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error saving checklist' });
  }
};

// Fetch checklists by client ID
exports.getChecklistsByClientId = async (req, res) => {
  const { clientId } = req.params;
  
  try {
    const checklists = await Checklist.find({ 'clientInfo.id': clientId });
    res.json(checklists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching checklists' });
  }
};
