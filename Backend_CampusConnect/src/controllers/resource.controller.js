import Resource from "../models/resources.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import fs from 'fs';
import path from 'path';

// @desc    Upload a new resource (simplified for development)
const uploadResource = asynchandler(async (req, res) => {
  const { title, description, course } = req.body;
  const userId = req.user._id;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  // For development, skip file upload and use a placeholder
  const resource = await Resource.create({
    title,
    description: description || '',
    fileUrl: '/placeholder-file.pdf', // Placeholder URL for development
    uploadedBy: userId,
    course: course || null
  });

  const createdResource = await Resource.findById(resource._id)
    .populate("uploadedBy", "username fullname avatar");

  return res.status(201).json(
    new ApiResponse(201, createdResource, "Resource uploaded successfully (development mode)")
  );
});

// @desc    Get all resources
const getAllResources = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { course, search } = req.query;
  const filter = {};

  if (course) filter.course = course;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const resources = await Resource.find(filter)
    .populate("uploadedBy", "username fullname avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalResources = await Resource.countDocuments(filter);
  const totalPages = Math.ceil(totalResources / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      resources,
      pagination: {
        currentPage: page,
        totalPages,
        totalResources,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, "Resources fetched successfully")
  );
});

// @desc    Get resource by ID
const getResourceById = asynchandler(async (req, res) => {
  const { resourceId } = req.params;

  const resource = await Resource.findById(resourceId)
    .populate("uploadedBy", "username fullname avatar");

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  return res.status(200).json(
    new ApiResponse(200, resource, "Resource fetched successfully")
  );
});

// @desc    Get resources by course
const getResourcesByCourse = asynchandler(async (req, res) => {
  const { courseId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const resources = await Resource.find({ course: courseId })
    .populate("uploadedBy", "username fullname avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalResources = await Resource.countDocuments({ course: courseId });
  const totalPages = Math.ceil(totalResources / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      resources,
      pagination: {
        currentPage: page,
        totalPages,
        totalResources,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, "Resources fetched successfully")
  );
});

// @desc    Get user resources
const getUserResources = asynchandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const resources = await Resource.find({ uploadedBy: userId })
    .populate("uploadedBy", "username fullname avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalResources = await Resource.countDocuments({ uploadedBy: userId });
  const totalPages = Math.ceil(totalResources / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      resources,
      pagination: {
        currentPage: page,
        totalPages,
        totalResources,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, "User resources fetched successfully")
  );
});

// @desc    Update resource
const updateResource = asynchandler(async (req, res) => {
  const { resourceId } = req.params;
  const { title, description, course } = req.body;
  const userId = req.user._id;

  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  // Check if user owns the resource or is admin
  if (resource.uploadedBy.toString() !== userId.toString() && req.user.role !== 'Admin') {
    throw new ApiError(403, "You can only update your own resources");
  }

  const updatedResource = await Resource.findByIdAndUpdate(
    resourceId,
    {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(course !== undefined && { course })
    },
    { new: true }
  )
    .populate("uploadedBy", "username fullname avatar");

  return res.status(200).json(
    new ApiResponse(200, updatedResource, "Resource updated successfully")
  );
});

// @desc    Delete resource
const deleteResource = asynchandler(async (req, res) => {
  const { resourceId } = req.params;
  const userId = req.user._id;

  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  // Check if user owns the resource or is admin
  if (resource.uploadedBy.toString() !== userId.toString() && req.user.role !== 'Admin') {
    throw new ApiError(403, "You can only delete your own resources");
  }

  // Delete the file from local storage if it's a local file
  if (resource.fileUrl.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', resource.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await Resource.findByIdAndDelete(resourceId);

  return res.status(200).json(
    new ApiResponse(200, null, "Resource deleted successfully")
  );
});

export {
  uploadResource,
  getAllResources,
  getResourceById,
  getResourcesByCourse,
  getUserResources,
  updateResource,
  deleteResource
};
