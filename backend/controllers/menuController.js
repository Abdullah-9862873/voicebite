const MenuItem = require("../models/MenuItem");

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getItemsByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const items = await MenuItem.find({ category }).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
