const Asset = require("../models/AssetsModel");
const express = require("express");
const CatchAsyncError = require("../middlewares/CatchAsyncError");

exports.GetAsset = CatchAsyncError(async (req, res) => {
  const asset = await Asset.find();
  res.status(200).json(asset);
});
exports.AddAsset = CatchAsyncError(async (req, res) => {
  const {
    employeename,
    employeeid,
    assetitem,
    quantity,
    modal,
    status,
    description,
  } = req.body;

  const asset = await Asset.create({
    employeename,
    employeeid,
    assetitem,
    quantity,
    modal,
    status,
    description,
  });

  if (asset) {
    res.status(200).json({ message: "Asset added successfully!", asset });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

exports.UpdateAsset = CatchAsyncError(async (req, res) => {
  const { assetId } = req.query;
  const asset = await Asset.findByIdAndUpdate({ _id:assetId }, req.body, {
    new: true,
  });
  if (asset) {
    res.status(200).json({ message: "Asset updated successfully!", asset });
  } else {
    res.status(404).json({ message: "Asset not found" });
  }
});
exports.DeleteAsset = CatchAsyncError(async (req, res) => {
  const{assetId}=req.query;
  const asset = await Asset.findByIdAndDelete({_id:assetId})
  if (asset) {
    res.status(200).json({ message: "Asset deleted successfully!" });
  }
  else {
    res.status(404).json({ message: "Asset not found" });
  }
});