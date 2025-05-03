// src/utils/crudController.js
exports.getAll = (Model) =>
    asyncHandler(async (req, res) => {
        const data = await Model.find();
        res.status(200).json({ success: true, data });
    });

exports.getOne = (Model) =>
    asyncHandler(async (req, res) => {
        const data = await Model.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }
        res.status(200).json({ success: true, data });
    });

exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const data = await Model.create(req.body);
        res.status(201).json({ success: true, data });
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res) => {
        const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!data) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }
        res.status(200).json({ success: true, data });
    });

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res) => {
        const data = await Model.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }
        res.status(200).json({ success: true, data: null });
    });
