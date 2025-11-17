import Poll from "../models/poll.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

// @desc    Create a new poll
const createPoll = asynchandler(async (req, res) => {
  const { question, options, expiresAt } = req.body;
  const userId = req.user._id;

  if (!question) {
    throw new ApiError(400, "Poll question is required");
  }

  if (!options || !Array.isArray(options) || options.length < 2) {
    throw new ApiError(400, "At least two options are required");
  }

  // Transform options array to include votes array
  const formattedOptions = options.map(option => ({
    text: option,
    votes: []
  }));

  const poll = await Poll.create({
    question,
    options: formattedOptions,
    createdBy: userId,
    expiresAt: expiresAt || null
  });

  const createdPoll = await Poll.findById(poll._id)
    .populate("createdBy", "username fullname avatar");

  return res.status(201).json(
    new ApiResponse(201, createdPoll, "Poll created successfully")
  );
});

// @desc    Get all polls
const getAllPolls = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const polls = await Poll.find()
    .populate("createdBy", "username fullname avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPolls = await Poll.countDocuments();

  return res.status(200).json(
    new ApiResponse(200, {
      polls,
      totalPolls,
      currentPage: page,
      totalPages: Math.ceil(totalPolls / limit)
    }, "Polls fetched successfully")
  );
});

// @desc    Get active polls (not expired)
const getActivePolls = asynchandler(async (req, res) => {
  const currentDate = new Date();

  const polls = await Poll.find({
    $or: [
      { expiresAt: { $gte: currentDate } },
      { expiresAt: null }
    ]
  })
    .populate("createdBy", "username fullname avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, polls, "Active polls fetched successfully")
  );
});

// @desc    Get a single poll by ID
const getPollById = asynchandler(async (req, res) => {
  const { pollId } = req.params;

  const poll = await Poll.findById(pollId)
    .populate("createdBy", "username fullname avatar bio");

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  return res.status(200).json(
    new ApiResponse(200, poll, "Poll fetched successfully")
  );
});

// @desc    Vote on a poll
const votePoll = asynchandler(async (req, res) => {
  const { pollId } = req.params;
  const { optionIndex } = req.body;
  const userId = req.user._id;

  if (optionIndex === undefined || optionIndex === null) {
    throw new ApiError(400, "Option index is required");
  }

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  // Check if poll is expired
  if (poll.expiresAt && new Date() > poll.expiresAt) {
    throw new ApiError(400, "This poll has expired");
  }

  // Check if option index is valid
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    throw new ApiError(400, "Invalid option index");
  }

  // Remove user's vote from all options first (in case they voted before)
  poll.options.forEach(option => {
    option.votes.pull(userId);
  });

  // Add user's vote to the selected option
  poll.options[optionIndex].votes.push(userId);
  await poll.save();

  const updatedPoll = await Poll.findById(pollId)
    .populate("createdBy", "username fullname avatar");

  return res.status(200).json(
    new ApiResponse(200, updatedPoll, "Vote recorded successfully")
  );
});

// @desc    Update a poll
const updatePoll = asynchandler(async (req, res) => {
  const { pollId } = req.params;
  const { question, expiresAt } = req.body;
  const userId = req.user._id;

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  // Only creator or admin can update
  if (poll.createdBy.toString() !== userId.toString() && req.user.role !== "Admin") {
    throw new ApiError(403, "You can only update your own polls");
  }

  // Can't update options if someone has already voted
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
  if (totalVotes > 0 && (req.body.options || req.body.options === [])) {
    throw new ApiError(400, "Cannot modify poll options after votes have been cast");
  }

  if (question) poll.question = question;
  if (expiresAt !== undefined) poll.expiresAt = expiresAt;

  await poll.save();

  const updatedPoll = await Poll.findById(pollId)
    .populate("createdBy", "username fullname avatar");

  return res.status(200).json(
    new ApiResponse(200, updatedPoll, "Poll updated successfully")
  );
});

// @desc    Delete a poll
const deletePoll = asynchandler(async (req, res) => {
  const { pollId } = req.params;
  const userId = req.user._id;

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  // Only creator or admin can delete
  if (poll.createdBy.toString() !== userId.toString() && req.user.role !== "Admin") {
    throw new ApiError(403, "You can only delete your own polls");
  }

  await Poll.findByIdAndDelete(pollId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Poll deleted successfully")
  );
});

export {
  createPoll,
  getAllPolls,
  getActivePolls,
  getPollById,
  votePoll,
  updatePoll,
  deletePoll
};





