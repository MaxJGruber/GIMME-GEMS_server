const express = require("express");
const router = express.Router();

const OrderModel = require("../models/Order.model");

router.get("/user-orders", async (req, res, next) => {
  if (req.session.currentUser) {
    try {
      const allUserOrders = await OrderModel.find({
        createdBy: req.session.currentUser,
      });
      res.status(200).json(allUserOrders);
    } catch (error) {
      res.status(500).json(err);
      next(err);
    }
  }
});

router.get("/all-admin", async (req, res, next) => {
  if (req.session.currentUser.isAdmin) {
    try {
      const allOrders = await OrderModel.find();
      res.status(200).json(allOrders);
    } catch (err) {
      res.status(500).json(err);
      next(err);
    }
  }
});

router.get("/one-order/:id", async (req, res, next) => {
  try {
    const foundOrder = await OrderModel.find(req.params.id);
    res.status(200).json(foundOrder);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const createdOrder = await OrderModel.create(req.body);
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

router.patch("/:id/edit", async (req, res, next) => {
  try {
    const updateOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(202).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

router.delete("/:id/delete", async (req, res, next) => {
  try {
    await OrderModel.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const foundOrder = await (
      await OrderModel.findById(req.params.id)
    ).execPopulate("basket");
    res.status(200).json(foundOrder);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
});

module.exports = router;
