import Event from "../models/events.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

// @desc    Create a new event
const createEvent = asynchandler(async (req, res) => {
  const { title, description, date, location } = req.body;
  const userId = req.user._id;

  if (!title || !date) {
    throw new ApiError(400, "Title and date are required");
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    owner: userId
  });

  const createdEvent = await Event.findById(event._id)
    .populate("owner", "username fullname avatar");

  return res.status(201).json(
    new ApiResponse(201, createdEvent, "Event created successfully")
  );
});

// @desc    Get all events
const getAllEvents = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const events = await Event.find()
    .populate("owner", "username fullname avatar")
    .populate("attendees", "username fullname avatar")
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);

  const totalEvents = await Event.countDocuments();

  return res.status(200).json(
    new ApiResponse(200, {
      events,
      totalEvents,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit)
    }, "Events fetched successfully")
  );
});

// @desc    Get upcoming events
const getUpcomingEvents = asynchandler(async (req, res) => {
  const currentDate = new Date();

  const events = await Event.find({ date: { $gte: currentDate } })
    .populate("owner", "username fullname avatar")
    .populate("attendees", "username fullname avatar")
    .sort({ date: 1 })
    .limit(10);

  return res.status(200).json(
    new ApiResponse(200, events, "Upcoming events fetched successfully")
  );
});

// @desc    Get a single event by ID
const getEventById = asynchandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId)
    .populate("owner", "username fullname avatar bio")
    .populate("attendees", "username fullname avatar");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(
    new ApiResponse(200, event, "Event fetched successfully")
  );
});

// @desc    Update an event
const updateEvent = asynchandler(async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, location } = req.body;
  const userId = req.user._id;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Only owner or admin can update
  if (event.owner.toString() !== userId.toString() && req.user.role !== "Admin") {
    throw new ApiError(403, "You can only update your own events");
  }

  if (title) event.title = title;
  if (description !== undefined) event.description = description;
  if (date) event.date = date;
  if (location !== undefined) event.location = location;

  await event.save();

  const updatedEvent = await Event.findById(eventId)
    .populate("owner", "username fullname avatar");

  return res.status(200).json(
    new ApiResponse(200, updatedEvent, "Event updated successfully")
  );
});

// @desc    Delete an event
const deleteEvent = asynchandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Only owner or admin can delete
  if (event.owner.toString() !== userId.toString() && req.user.role !== "Admin") {
    throw new ApiError(403, "You can only delete your own events");
  }

  await Event.findByIdAndDelete(eventId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Event deleted successfully")
  );
});

// @desc    Attend/Unattend an event
const toggleAttendance = asynchandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const isAttending = event.attendees.includes(userId);

  if (isAttending) {
    // Unattend
    event.attendees.pull(userId);
    await event.save();
    return res.status(200).json(
      new ApiResponse(200, { attending: false }, "Event unattendance recorded")
    );
  } else {
    // Attend
    event.attendees.push(userId);
    await event.save();
    return res.status(200).json(
      new ApiResponse(200, { attending: true }, "Event attendance recorded")
    );
  }
});

export {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleAttendance
};





